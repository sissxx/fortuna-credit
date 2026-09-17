import { LAYOUT_PRESETS } from "./layoutPresets";
import { getFortunaContext, type ContextLocale, type FortunaBusinessContext, type ValueProp } from "@/lib/fortuna/businessContext";
import { genId, type CampaignCopy, type CampaignInput, type DesignVariation, type FormatId, type PostType } from "./types";

/**
 * Content-generation abstraction (see project instructions §15). The admin
 * UI only depends on this interface — swap TemplateContentGenerator for a
 * real LLM-backed implementation later without touching any component.
 *
 * This generator is fully grounded in FORTUNA_CONTEXT
 * (src/lib/fortuna/businessContext.ts) — the real vision statement, value
 * propositions, eligibility rules and office/contact data already published
 * on the site. Headline, supporting text and CTA are never typed freehand
 * by the caller; they are always derived from the context plus the
 * admin's selected focus areas and post type.
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

// The value props the admin explicitly selected (if any), resolved against
// the current locale's context. Falls back to a deterministic pick from the
// full list so a campaign with no selection still gets varied, on-context
// copy instead of a single default every time.
function resolveFocusProps(input: CampaignInput, ctx: FortunaBusinessContext): ValueProp[] {
  const selected = ctx.valueProps.filter((v) => input.focusAreas.includes(v.title));
  if (selected.length > 0) return selected;
  const seed = hashSeed(input.postType + ctx.locale);
  return [pick(ctx.valueProps, seed)];
}

function joinWithAnd(items: string[], locale: ContextLocale): string {
  if (items.length <= 1) return items[0] ?? "";
  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  return `${rest.join(", ")} ${locale === "bg" ? "и" : "and"} ${last}`;
}

function withAdditionalInfo(text: string, input: CampaignInput): string {
  return input.additionalInfo?.trim() ? `${text} ${input.additionalInfo.trim()}` : text;
}

function captionCandidates(input: CampaignInput, ctx: FortunaBusinessContext, focus: ValueProp[]): string[] {
  const bg = ctx.locale === "bg";
  const focusTitles = joinWithAnd(focus.map((f) => f.title.toLowerCase()), ctx.locale);

  switch (input.postType) {
    case "promotional":
      return [ctx.service.description, `${ctx.tagline} ${focus[0].description}`];
    case "product-announcement":
      return [
        (bg ? `${ctx.name} — ` : `${ctx.name} — `) + ctx.service.description,
        bg ? `Ето какво предлагаме: ${focusTitles}.` : `Here's what we offer: ${focusTitles}.`,
      ];
    case "sale-discount":
      // No real rates/offers are published — ground this in eligibility +
      // process speed instead of inventing a discount.
      return [
        bg
          ? `Проверете дали отговаряте на условията и кандидатствайте — ${ctx.eligibility[0].toLowerCase()}.`
          : `Check if you qualify and apply — ${ctx.eligibility[0].toLowerCase()}.`,
      ];
    case "educational": {
      const rule = pick(ctx.eligibility, hashSeed(input.postType));
      return [
        bg
          ? `Какво трябва да знаете, преди да кандидатствате: ${rule.toLowerCase()}.`
          : `What you should know before applying: ${rule.toLowerCase()}.`,
        ctx.responsibleBorrowing[0],
      ];
    }
    case "testimonial": {
      const supportProp = ctx.valueProps.find((v) => /support|подход/i.test(v.title)) ?? focus[0];
      return [
        bg
          ? `${supportProp.description} Ето защо клиентите ни избират ${ctx.name}.`
          : `${supportProp.description} That's why customers choose ${ctx.name}.`,
      ];
    }
    case "feature-highlight":
      return [`${focus[0].title}. ${focus[0].description}`];
    case "event-announcement":
      return [
        bg
          ? `Нов офис на ${ctx.name} — ${ctx.newOffice.openingDateLabel} в ${ctx.newOffice.city}.`
          : `A new ${ctx.name} location — ${ctx.newOffice.openingDateLabel} in ${ctx.newOffice.city}.`,
      ];
    case "brand-awareness":
      return [`${ctx.tagline} ${ctx.vision}`, ctx.vision];
    case "custom":
    default:
      return [ctx.service.description];
  }
}

export class TemplateContentGenerator implements ContentGenerator {
  async generateCampaignCopy(input: CampaignInput, locale: ContextLocale): Promise<CampaignCopy> {
    const ctx = getFortunaContext(locale);
    const focus = resolveFocusProps(input, ctx);
    const seed = hashSeed(focus.map((f) => f.title).join("|") + input.postType);

    const headline =
      input.postType === "event-announcement"
        ? ctx.newOffice.city
        : focus.length === 1
          ? focus[0].title
          : ctx.service.name;

    const supportingText =
      focus.length === 1 ? focus[0].description : joinWithAnd(focus.map((f) => f.title), locale);

    const cta = CTA_DEFAULTS[input.postType][locale];
    const caption = withAdditionalInfo(pick(captionCandidates(input, ctx, focus), seed), input);

    const focusTags = focus.map((f) => slugTag(f.title)).filter(Boolean);
    const brandTag = slugTag(ctx.name);
    const hashtags = Array.from(
      new Set([brandTag, ...focusTags, ...(locale === "bg" ? ["#Кредит", "#БързКредит"] : ["#Credit", "#FastCredit"])])
    ).slice(0, 8);

    return { headline, supportingText, cta, caption, hashtags };
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
