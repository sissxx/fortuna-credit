import { LAYOUT_PRESETS } from "./layoutPresets";
import {
  getFortunaContext,
  type ContextLocale,
  type FortunaOffice,
  type ValueProp,
} from "@/lib/fortuna/businessContext";
import { AI_CHOOSE, pickFromLibrary, translatePhrase, type CopyCategory } from "@/lib/fortuna/copyLibrary";
import {
  genId,
  type CampaignCopy,
  type CampaignInput,
  type DesignVariation,
  type FormatId,
  type MessageSelections,
  type OfficeSnapshot,
} from "./types";

/**
 * Content-generation abstraction (see project instructions §15). The admin
 * UI only depends on this interface — swap TemplateContentGenerator for a
 * real LLM-backed implementation later without touching any component.
 *
 * Fortuna Credit is the only brand this generator ever produces ads for —
 * there is no "what to promote" input, because there's nothing to choose:
 * every post promotes Fortuna Credit. The admin optionally pins an exact
 * phrase per marketing-message menu (src/lib/fortuna/copyLibrary.ts, §30–35);
 * an explicit pick is used verbatim, every time, in every variation (§38) —
 * it is never silently overridden by anything else this generator decides.
 * Menus left on "AI Choose" fall back to a seeded library pick instead.
 *
 * It never invents a phone number, address, offer or condition; office
 * contact info only ever comes from verified business data
 * (src/lib/fortuna/businessContext.ts) and only when the admin explicitly
 * selects an office.
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

function toOfficeSnapshot(office: FortunaOffice): OfficeSnapshot {
  return { id: office.id, name: office.name, city: office.city, phone: office.phone, isNew: office.isNew };
}

/** Translates any explicit (non-AI_CHOOSE) selections to another locale via
 * their paired index in the copy library, so a bilingual post's secondary
 * language reflects the same admin-chosen message, not a different one. */
function resolveSelectionsForLocale(selections: MessageSelections, fromLocale: ContextLocale, toLocale: ContextLocale): MessageSelections {
  if (fromLocale === toLocale) return selections;
  const translate = (category: CopyCategory, value: string) => (value === AI_CHOOSE ? AI_CHOOSE : translatePhrase(category, value, fromLocale, toLocale));
  return {
    hook: translate("hooks", selections.hook),
    trust: translate("trust", selections.trust),
    lifestyle: translate("lifestyle", selections.lifestyle),
    cta: translate("cta", selections.cta),
    shortHeadline: translate("shortHeadline", selections.shortHeadline),
  };
}

function officeCta(office: FortunaOffice, locale: ContextLocale): string {
  return locale === "bg" ? `Посети ни в ${office.city}.` : `Visit us in ${office.city}.`;
}

function buildCopyForLocale(locale: ContextLocale, office: FortunaOffice | null, focus: ValueProp, selections: MessageSelections, seed: number): CampaignCopy {
  const ctx = getFortunaContext(locale);

  // Resolve each menu: an explicit admin pick is used exactly as chosen
  // (§38) and can NEVER be overridden further down — office/city copy or
  // any other fallback logic only ever fills in for menus left on
  // "AI Choose". "AI Choose" itself varies per variation via the seed so
  // the 5 designs still read as genuinely different.
  const hook = selections.hook !== AI_CHOOSE ? selections.hook : pickFromLibrary("hooks", locale, seed);
  const trust = selections.trust !== AI_CHOOSE ? selections.trust : pickFromLibrary("trust", locale, seed + 1);
  const lifestyle = selections.lifestyle !== AI_CHOOSE ? selections.lifestyle : pickFromLibrary("lifestyle", locale, seed + 2);
  const shortHeadline = selections.shortHeadline !== AI_CHOOSE ? selections.shortHeadline : null;

  const cta =
    selections.cta !== AI_CHOOSE
      ? selections.cta
      : office && seed % 2 === 0
        ? officeCta(office, locale)
        : pickFromLibrary("cta", locale, seed + 3);

  // Headline: an explicit shortHeadline or hook selection always wins.
  // Only when BOTH are left on "AI Choose" may the office city lead
  // instead, for variety.
  let headline: string;
  if (shortHeadline) {
    headline = shortHeadline;
  } else if (selections.hook !== AI_CHOOSE) {
    headline = hook;
  } else if (office && seed % 3 === 0) {
    headline = `${ctx.name} — ${office.city}`;
  } else {
    headline = hook;
  }

  // Supporting text: an explicit trust or lifestyle pick wins (trust takes
  // priority if both are set); otherwise alternate the AI picks for variety.
  const supportingText =
    selections.trust !== AI_CHOOSE ? trust : selections.lifestyle !== AI_CHOOSE ? lifestyle : seed % 2 === 0 ? trust : lifestyle;

  const captionLead = selections.hook !== AI_CHOOSE ? hook : selections.trust !== AI_CHOOSE ? trust : pickFromLibrary("hooks", locale, seed);
  const caption = office
    ? `${captionLead} ${locale === "bg" ? `Посетете ни в ${office.city}.` : `Visit us in ${office.city}.`}`
    : `${captionLead} ${focus.description}`;

  const focusTag = slugTag(focus.title);
  const brandTag = slugTag(ctx.name);
  const cityTag = office ? slugTag(office.city) : "";
  const hashtags = Array.from(
    new Set([brandTag, cityTag, focusTag, ...(locale === "bg" ? ["#Кредит", "#БързКредит"] : ["#Credit", "#FastCredit"])].filter(Boolean))
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

function resolveOffice(input: CampaignInput, ctxOffices: FortunaOffice[]): FortunaOffice | null {
  if (!input.officeId || input.officeId === "all") return null;
  return ctxOffices.find((o) => o.id === input.officeId) ?? null;
}

function baseSeedFor(input: CampaignInput): number {
  return hashSeed(`${input.officeId}|${Object.values(input.selections).join("|")}`) + input.nonce * 97;
}

export class TemplateContentGenerator implements ContentGenerator {
  async generateCampaignCopy(input: CampaignInput, locale: ContextLocale): Promise<CampaignCopy> {
    const ctx = getFortunaContext(locale);
    const office = resolveOffice(input, ctx.offices);
    const seed = baseSeedFor(input);
    const focus = pick(ctx.valueProps, seed);
    return buildCopyForLocale(locale, office, focus, input.selections, seed);
  }

  async generateVariations(input: CampaignInput, formatId: FormatId, locale: ContextLocale): Promise<DesignVariation[]> {
    const primaryCtx = getFortunaContext(locale);
    const office = resolveOffice(input, primaryCtx.offices);
    const secondaryLocale: ContextLocale = locale === "bg" ? "en" : "bg";
    const secondaryCtx = getFortunaContext(secondaryLocale);
    const secondaryOffice = office ? secondaryCtx.offices.find((o) => o.id === office.id) ?? null : null;
    const secondarySelections = resolveSelectionsForLocale(input.selections, locale, secondaryLocale);
    const baseSeed = baseSeedFor(input);
    const officeSnapshot = office ? toOfficeSnapshot(office) : null;

    return LAYOUT_PRESETS.map((preset, index) => {
      const seed = baseSeed + index;
      const focus = pick(primaryCtx.valueProps, seed);
      const secondaryFocus = pick(secondaryCtx.valueProps, seed);
      const copy = buildCopyForLocale(locale, office, focus, input.selections, seed);
      const secondary =
        input.languageMode === "both"
          ? buildCopyForLocale(secondaryLocale, secondaryOffice, secondaryFocus, secondarySelections, seed)
          : null;

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
          office: officeSnapshot,
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
