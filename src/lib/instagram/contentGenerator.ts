import { LAYOUT_PRESETS } from "./layoutPresets";
import { genId, type CampaignCopy, type CampaignInput, type DesignVariation, type FormatId, type PostType } from "./types";

/**
 * Content-generation abstraction (see project instructions §15). The admin
 * UI only depends on this interface — swap TemplateContentGenerator for a
 * real LLM-backed implementation later without touching any component.
 * Design/layout is deliberately NOT part of this interface's output beyond
 * the DesignVariation shells it returns: colors, fonts and composition come
 * from src/lib/brand/tokens.ts and src/lib/instagram/layoutPresets.ts, which
 * a content generator can never override.
 */
export interface ContentGenerator {
  generateCampaignCopy(input: CampaignInput): Promise<CampaignCopy>;
  generateVariations(input: CampaignInput, formatId: FormatId): Promise<DesignVariation[]>;
}

function isCyrillic(text: string): boolean {
  return /[Ѐ-ӿ]/.test(text);
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

const CAPTION_TEMPLATES: Record<PostType, { bg: string[]; en: string[] }> = {
  promotional: {
    bg: [
      "{product} — просто и прозрачно, без излишни усложнения. {offer}",
      "Финансова подкрепа, когато ви трябва. {product} с ясни условия. {offer}",
    ],
    en: [
      "{product} — simple and transparent, without the complications. {offer}",
      "Financial support when you need it. {product} with clear terms. {offer}",
    ],
  },
  "product-announcement": {
    bg: ["Представяме ви {product}. {offer}", "Ново във Fortuna Credit: {product}. {offer}"],
    en: ["Introducing {product}. {offer}", "New at Fortuna Credit: {product}. {offer}"],
  },
  "sale-discount": {
    bg: ["{offer} за {product} — само за ограничено време.", "Специална оферта: {offer} за {product}."],
    en: ["{offer} on {product} — for a limited time.", "Special offer: {offer} on {product}."],
  },
  educational: {
    bg: ["Какво трябва да знаете за {product}, преди да кандидатствате.", "{product} обяснен просто — без дребен шрифт."],
    en: ["What you should know about {product} before you apply.", "{product}, explained simply — no fine print."],
  },
  testimonial: {
    bg: ["Истории на клиенти, които избраха {product}.", "Ето какво споделят клиентите ни за {product}."],
    en: ["Real stories from customers who chose {product}.", "Here's what our customers say about {product}."],
  },
  "feature-highlight": {
    bg: ["{product}: това, което го прави различен.", "Защо клиентите ни избират {product}."],
    en: ["{product}: what makes it different.", "Why our customers choose {product}."],
  },
  "event-announcement": {
    bg: ["Присъединете се към нас — {campaignName}.", "Отбележете си датата: {campaignName}."],
    en: ["Join us for {campaignName}.", "Mark your calendar: {campaignName}."],
  },
  "brand-awareness": {
    bg: ["Fortuna Credit — бърз, лесен и прозрачен кредит.", "Кредит, изграден върху доверие и простота."],
    en: ["Fortuna Credit — fast, simple, transparent credit.", "Credit built on trust and simplicity."],
  },
  custom: {
    bg: ["{product}. {offer}"],
    en: ["{product}. {offer}"],
  },
};

const HASHTAG_BASE: { bg: string[]; en: string[] } = {
  bg: ["#FortunaCredit", "#Кредит", "#БързКредит", "#ФинансоваСвобода"],
  en: ["#FortunaCredit", "#Credit", "#FastCredit", "#FinancialFreedom"],
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

function fill(template: string, input: CampaignInput): string {
  return template
    .replace(/\{product\}/g, input.productOrService || "Fortuna Credit")
    .replace(/\{offer\}/g, input.offer || "")
    .replace(/\{campaignName\}/g, input.campaignName || "")
    .trim()
    .replace(/\s+/g, " ");
}

export class TemplateContentGenerator implements ContentGenerator {
  async generateCampaignCopy(input: CampaignInput): Promise<CampaignCopy> {
    const lang = isCyrillic(input.headline || input.productOrService || input.campaignName) ? "bg" : "en";
    const seed = hashSeed(input.campaignName + input.productOrService + input.postType);

    const headline = input.headline?.trim() || (input.productOrService ? input.productOrService : "Fortuna Credit");
    const cta = input.cta?.trim() || CTA_DEFAULTS[input.postType][lang];
    const captionTemplate = pick(CAPTION_TEMPLATES[input.postType][lang], seed);
    const caption = fill(captionTemplate, input);

    const productTags = (input.productOrService || "")
      .split(/[,/]|\sand\s|\sи\s/i)
      .map((w) => slugTag(w))
      .filter(Boolean)
      .slice(0, 3);

    const hashtags = Array.from(new Set([...HASHTAG_BASE[lang], ...productTags])).slice(0, 8);

    return {
      headline,
      supportingText: input.supportingText?.trim() || "",
      cta,
      caption,
      hashtags,
    };
  }

  async generateVariations(input: CampaignInput, formatId: FormatId): Promise<DesignVariation[]> {
    const copy = await this.generateCampaignCopy(input);

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
