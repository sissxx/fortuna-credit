import { LAYOUT_PRESETS } from "./layoutPresets";
import {
  getFortunaContext,
  findOfficeByText,
  type ContextLocale,
  type FortunaBusinessContext,
  type FortunaOffice,
  type ValueProp,
} from "@/lib/fortuna/businessContext";
import { pickFromLibrary, type CopyCategory } from "@/lib/fortuna/copyLibrary";
import {
  genId,
  type CampaignCopy,
  type CampaignInput,
  type DesignVariation,
  type FormatId,
  type OfficeSnapshot,
  type PostType,
} from "./types";

/**
 * Content-generation abstraction (see project instructions §15). The admin
 * UI only depends on this interface — swap TemplateContentGenerator for a
 * real LLM-backed implementation later without touching any component.
 *
 * The admin gives a single free-text "campaign idea"; this generator reads
 * it against the Fortuna Credit brand context (src/lib/fortuna/businessContext.ts)
 * and copy library (src/lib/fortuna/copyLibrary.ts) to infer a post type,
 * relevant value props, and — if a real, verified office is named or
 * selected — that office's contact info. It never invents a phone number,
 * address, offer or condition; anything it can't verify is simply omitted.
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
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 9973;
  return h;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary keyword match — plain .includes() would let "promo" match
// inside "promotional" and misfire (e.g. "promotional post" wrongly
// inferred as a sale/discount post). Keywords may be multi-word phrases
// with a trailing space (e.g. "new ") to anchor the start only.
function containsKeyword(normalizedText: string, keyword: string): boolean {
  const kw = normalize(keyword).trim();
  if (!kw) return false;
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(kw)}([^\\p{L}\\p{N}]|$)`, "u").test(normalizedText);
}

// --- Idea understanding -----------------------------------------------

const POST_TYPE_KEYWORDS: Record<PostType, string[]> = {
  "sale-discount": ["discount", "sale", "offer", "promo", "отстъпк", "промоц", "намал"],
  testimonial: ["testimonial", "review", "customer story", "клиент", "истори", "отзив"],
  "event-announcement": ["event", "opening", "grand opening", "launch event", "открив", "събитие"],
  educational: ["learn", "how ", "explain", "education", "разбер", "научи", "обясн", "знаеш ли"],
  "feature-highlight": ["why ", "feature", "benefit", "advantage", "защо", "предимств", "полза"],
  "brand-awareness": ["close to", "trust", "brand", "about us", "близо до", "доверие", "марка"],
  "product-announcement": ["announce", "new ", "introduc", "представяме", "нов "],
  promotional: [],
  custom: [],
};

function inferPostType(ideaNorm: string): PostType {
  for (const [type, keywords] of Object.entries(POST_TYPE_KEYWORDS) as [PostType, string[]][]) {
    if (keywords.some((k) => containsKeyword(ideaNorm, k))) return type;
  }
  return "promotional";
}

const TONE_KEYWORDS: Record<CopyCategory, string[]> = {
  lifestyle: ["young", "start", "new beginning", "emotional", "dream", "млад", "нов старт", "начинание", "мечт"],
  trust: ["close", "trust", "human", "personal", "care", "близо", "доверие", "личен", "грижа"],
  hooks: [],
  cta: [],
};

function inferToneCategory(ideaNorm: string): CopyCategory {
  for (const [category, keywords] of Object.entries(TONE_KEYWORDS) as [CopyCategory, string[]][]) {
    if (keywords.length && keywords.some((k) => containsKeyword(ideaNorm, k))) return category;
  }
  return "hooks";
}

function inferValueProps(ideaNorm: string, ctx: FortunaBusinessContext, seed: number): ValueProp[] {
  const scored = ctx.valueProps
    .map((v) => {
      const words = normalize(`${v.title} ${v.description}`).split(/\W+/).filter((w) => w.length > 3);
      const score = words.filter((w) => containsKeyword(ideaNorm, w)).length;
      return { v, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) return scored.slice(0, 2).map((s) => s.v);
  return [pick(ctx.valueProps, seed)];
}

function toOfficeSnapshot(office: FortunaOffice): OfficeSnapshot {
  return { id: office.id, name: office.name, city: office.city, phone: office.phone, isNew: office.isNew };
}

function resolveOffice(input: CampaignInput, ctx: FortunaBusinessContext): FortunaOffice | null {
  if (input.officeId && input.officeId !== "all") {
    return ctx.offices.find((o) => o.id === input.officeId) ?? null;
  }
  return findOfficeByText(input.idea, ctx);
}

type Analysis = {
  postType: PostType;
  tone: CopyCategory;
  focus: ValueProp[];
  office: FortunaOffice | null;
  seed: number;
};

function analyzeIdea(input: CampaignInput, ctx: FortunaBusinessContext): Analysis {
  const ideaNorm = normalize(input.idea);
  const seed = hashSeed(ideaNorm || ctx.locale);
  return {
    postType: inferPostType(ideaNorm),
    tone: inferToneCategory(ideaNorm),
    focus: inferValueProps(ideaNorm, ctx, seed),
    office: resolveOffice(input, ctx),
    seed,
  };
}

// --- Copy assembly -------------------------------------------------------

function officeCta(office: FortunaOffice, locale: ContextLocale): string {
  return locale === "bg" ? `Посети ни в ${office.city}.` : `Visit us in ${office.city}.`;
}

function buildCopyForLocale(locale: ContextLocale, analysis: Analysis, variationIndex: number): CampaignCopy {
  const ctx = getFortunaContext(locale);
  const office = analysis.office ? ctx.offices.find((o) => o.id === analysis.office!.id) ?? null : null;
  const focus = ctx.valueProps.filter((v) => analysis.focus.some((f) => f.title === v.title));
  const primaryFocus = focus[0] ?? ctx.valueProps[0];
  const seed = analysis.seed + variationIndex;

  // Headline: an office-led idea leads with the city; otherwise pull from
  // the tone-appropriate hook/lifestyle library, alternating with the
  // value-prop title so the 5 variations genuinely differ.
  let headline: string;
  if (office && (analysis.postType === "event-announcement" || variationIndex === 0)) {
    headline = `${ctx.name} — ${office.city}`;
  } else if (variationIndex % 2 === 0) {
    headline = pickFromLibrary(analysis.tone === "cta" ? "hooks" : analysis.tone, locale, seed);
  } else {
    headline = primaryFocus.title;
  }

  // Supporting text: trust copy when an office/personal angle is present,
  // otherwise the matched value prop's own description.
  const supportingText =
    office || analysis.tone === "trust"
      ? pickFromLibrary("trust", locale, seed + 1)
      : primaryFocus.description;

  const cta = office && variationIndex % 2 === 0 ? officeCta(office, locale) : pickFromLibrary("cta", locale, seed + 2);

  const caption = office
    ? `${pickFromLibrary("trust", locale, seed)} ${locale === "bg" ? `Посетете ни в ${office.city}.` : `Visit us in ${office.city}.`}`
    : `${pickFromLibrary("hooks", locale, seed)} ${primaryFocus.description}`;

  const focusTags = focus.map((f) => slugTag(f.title)).filter(Boolean);
  const brandTag = slugTag(ctx.name);
  const cityTag = office ? slugTag(office.city) : "";
  const hashtags = Array.from(
    new Set(
      [brandTag, cityTag, ...focusTags, ...(locale === "bg" ? ["#Кредит", "#БързКредит"] : ["#Credit", "#FastCredit"])].filter(
        Boolean
      )
    )
  ).slice(0, 8);

  return { headline, supportingText, cta, caption, hashtags };
}

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

export class TemplateContentGenerator implements ContentGenerator {
  async generateCampaignCopy(input: CampaignInput, locale: ContextLocale): Promise<CampaignCopy> {
    const ctx = getFortunaContext(locale);
    const analysis = analyzeIdea(input, ctx);
    return buildCopyForLocale(locale, analysis, 0);
  }

  async generateVariations(input: CampaignInput, formatId: FormatId, locale: ContextLocale): Promise<DesignVariation[]> {
    const primaryCtx = getFortunaContext(locale);
    const analysis = analyzeIdea(input, primaryCtx);
    const secondaryLocale: ContextLocale = locale === "bg" ? "en" : "bg";

    return LAYOUT_PRESETS.map((preset, index) => {
      const copy = buildCopyForLocale(locale, analysis, index);
      const secondary =
        input.languageMode === "both" ? buildCopyForLocale(secondaryLocale, analysis, index) : null;
      const office = analysis.office ? toOfficeSnapshot(primaryCtx.offices.find((o) => o.id === analysis.office!.id)!) : null;

      return {
        id: genId(preset.id),
        layoutPresetId: preset.id,
        label: preset.label,
        formatId,
        edits: {
          headline: copy.headline,
          supportingText: copy.supportingText,
          cta: copy.cta,
          secondary: secondary ? { headline: secondary.headline, supportingText: secondary.supportingText, cta: secondary.cta } : null,
          headlineScale: preset.headlineScale,
          textAlign: preset.textAlign,
          image: { src: null, fit: "cover", position: "center" },
          showAccent: preset.showAccentHairline,
          showLogo: true,
          office,
        },
      };
    });
  }
}

let instance: ContentGenerator | null = null;
export function getContentGenerator(): ContentGenerator {
  if (!instance) instance = new TemplateContentGenerator();
  return instance;
}

export type { Analysis as IdeaAnalysis };
export { analyzeIdea };
