import { LAYOUT_PRESETS } from "./layoutPresets";
import { getFortunaContext, type ContextLocale, type FortunaBusinessContext } from "@/lib/fortuna/businessContext";
import { genId, type CampaignCopy, type CampaignInput, type DesignVariation, type FormatId, type PostType } from "./types";

/**
 * Content-generation abstraction (see project instructions §15). The admin
 * UI only depends on this interface — swap TemplateContentGenerator for a
 * real LLM-backed implementation later without touching any component.
 *
 * This generator is grounded in FORTUNA_CONTEXT (src/lib/fortuna/businessContext.ts)
 * — the real vision statement, value propositions, eligibility rules and
 * office/contact data already published on the site — rather than generic
 * marketing filler. A caller never has to re-explain what Fortuna Credit is;
 * it only supplies the campaign-specific bits (headline override, offer,
 * dates) on top of that standing context.
 *
 * Design/layout is deliberately NOT part of this interface's output beyond
 * the DesignVariation shells it returns: colors, fonts and composition come
 * from src/lib/brand/tokens.ts and src/lib/instagram/layoutPresets.ts, which
 * a content generator can never override.
 */
export interface ContentGenerator {
  generateCampaignCopy(input: CampaignInput, locale: ContextLocale): Promise<CampaignCopy>;
  generateVariations(input: CampaignInput, formatId: FormatId, locale: ContextLocale): Promise<DesignVariation[]>;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 9973;
  return h;
}

const CTA_DEFAULTS: Record<PostType, { bg: string; en: string }> = {
  promotional: { bg: "Кандидатствай сега", en: "Apply Now" },
  "product-announcement": { bg: "Научи повече", en: "Learn More" },
  "sale-discount": { bg: "Възползвай се", en: "Get the Offer" },
  educational: { bg: "Прочети повече", en: "Read More" },
  testimonial: { bg: "Кандидатствай сега", en: "Apply Now" },
  "feature-highlight": { bg: "Разгледай", en: "Discover" },
  "event-announcement": { bg: "Виж повече", en: "See Details" },
  "brand-awareness": { bg: "Научи повече", en: "Learn More" },
  custom: { bg: "Научи повече", en: "Learn More" },
};

function slugTag(word: string): string {
  const cleaned = word
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
  if (!cleaned) return "";
  return (
    "#" +
    cleaned
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("")
  );
}

function fill(template: string, input: CampaignInput, product: string): string {
  return template
    .replace(/\{product\}/g, input.productOrService?.trim() || product)
    .replace(/\{offer\}/g, input.offer || "")
    .replace(/\{campaignName\}/g, input.campaignName || "")
    .trim()
    .replace(/\s+/g, " ");
}

// Caption builders per post type — each one is grounded in the real
// business context rather than generic template slop. Returns a caption
// candidate list; one is picked deterministically from the campaign seed
// so re-generating the same campaign is stable, while different campaigns
// naturally land on different phrasing.
function captionCandidates(input: CampaignInput, ctx: FortunaBusinessContext): string[] {
  const bg = ctx.locale === "bg";
  const product = input.productOrService?.trim() || ctx.service.name;

  switch (input.postType) {
    case "promotional":
      return [
        fill(bg ? "{product} — {offer_or_vision}" : "{product} — {offer_or_vision}", input, product).replace(
          "{offer_or_vision}",
          input.offer || ctx.service.description
        ),
        ctx.service.description + (input.offer ? ` ${input.offer}.` : ""),
      ];
    case "product-announcement":
      return [
        (bg ? `Представяме ви ${product}. ` : `Introducing ${product}. `) + ctx.service.description,
        (bg ? `Ново във ${ctx.name}: ` : `New at ${ctx.name}: `) + product + (input.offer ? ` — ${input.offer}` : "."),
      ];
    case "sale-discount":
      return [
        `${input.offer || (bg ? "Специална оферта" : "Special offer")} — ${product}${
          bg ? " само за ограничено време." : ", for a limited time."
        }`,
      ];
    case "educational": {
      const rule = pick(ctx.eligibility, hashSeed(input.campaignName));
      return [
        bg
          ? `Какво трябва да знаете, преди да кандидатствате за ${product}: ${rule.toLowerCase()}.`
          : `What you should know before applying for ${product}: ${rule.toLowerCase()}.`,
        bg
          ? `${ctx.responsibleBorrowing[0]}`
          : `${ctx.responsibleBorrowing[0]}`,
      ];
    }
    case "testimonial": {
      const supportProp = ctx.valueProps.find((v) => /support|подход/i.test(v.title)) ?? ctx.valueProps[2];
      return [
        bg
          ? `${supportProp.description} Ето защо клиентите ни избират ${ctx.name}.`
          : `${supportProp.description} That's why customers choose ${ctx.name}.`,
      ];
    }
    case "feature-highlight": {
      const prop = pick(ctx.valueProps, hashSeed(input.campaignName + input.productOrService));
      return [`${prop.title}. ${prop.description}`];
    }
    case "event-announcement":
      return [
        bg
          ? `${input.campaignName || `Нов офис на ${ctx.name}`} — ${ctx.newOffice.openingDateLabel} в ${ctx.newOffice.city}.`
          : `${input.campaignName || `A new ${ctx.name} location`} — ${ctx.newOffice.openingDateLabel} in ${ctx.newOffice.city}.`,
      ];
    case "brand-awareness":
      return [ctx.tagline + " " + ctx.vision, ctx.vision];
    case "custom":
    default:
      return [fill("{product}. {offer}", input, product)];
  }
}

export class TemplateContentGenerator implements ContentGenerator {
  async generateCampaignCopy(input: CampaignInput, locale: ContextLocale): Promise<CampaignCopy> {
    const ctx = getFortunaContext(locale);
    const seed = hashSeed(input.campaignName + input.productOrService + input.postType);

    const headline = input.headline?.trim() || input.productOrService?.trim() || ctx.service.name;
    const cta = input.cta?.trim() || CTA_DEFAULTS[input.postType][locale];
    const caption = pick(captionCandidates(input, ctx), seed);

    const productTags = (input.productOrService || ctx.service.name)
      .split(/[,/]|\sand\s|\sи\s/i)
      .map((w) => slugTag(w))
      .filter(Boolean)
      .slice(0, 3);

    const brandTag = slugTag(ctx.name);
    const hashtags = Array.from(new Set([brandTag, ...productTags, ...(locale === "bg" ? ["#Кредит", "#БързКредит"] : ["#Credit", "#FastCredit"])])).slice(
      0,
      8
    );

    return {
      headline,
      supportingText: input.supportingText?.trim() || (input.postType === "brand-awareness" ? ctx.service.description : ""),
      cta,
      caption,
      hashtags,
    };
  }

  async generateVariations(input: CampaignInput, formatId: FormatId, locale: ContextLocale): Promise<DesignVariation[]> {
    const copy = await this.generateCampaignCopy(input, locale);

    return LAYOUT_PRESETS.map((preset) => ({
      id: genId(preset.id),
      layoutPresetId: preset.id,
      label: preset.label,
      formatId,
      edits: {
        headline: copy.headline,
        supportingText: copy.supportingText,
        cta: copy.cta,
        offer: input.offer || "",
        headlineScale: preset.headlineScale,
        textAlign: preset.textAlign,
        image: { src: null, fit: "cover", position: "center" },
        showAccent: preset.showAccentHairline,
        showLogo: true,
      },
    }));
  }
}

let instance: ContentGenerator | null = null;
export function getContentGenerator(): ContentGenerator {
  if (!instance) instance = new TemplateContentGenerator();
  return instance;
}
