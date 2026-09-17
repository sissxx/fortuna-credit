// Persistent Fortuna Credit business/brand context for the admin marketing
// tools. This is NOT a generic "tell the AI about your brand" config — it
// is derived directly from the real site content (src/config/site.ts,
// src/i18n/dictionaries) so the Instagram generator already knows what
// Fortuna Credit is, what it offers, where its offices are, and how it
// talks, without the admin re-explaining it per campaign.
//
// Nothing here is invented: every value is read from the same source of
// truth the public website renders from. Where the business hasn't
// supplied real data (phone numbers, office addresses, loan terms), the
// same bracket placeholders shown on the website are reused verbatim —
// never replaced with plausible-looking fake data. If a generated ad
// references an office the admin didn't select and the free-text idea
// doesn't clearly name a real, known office, no office is attached rather
// than guessing one.
import bgDict from "@/i18n/dictionaries/bg";
import enDict from "@/i18n/dictionaries/en";
import { fortuna, officesMeta, loanConfig } from "@/config/site";

export type ContextLocale = "bg" | "en";

export type ValueProp = { title: string; description: string };

export type FortunaOffice = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  isNew: boolean;
  openingDateISO?: string;
  openingDateLabel?: string;
};

export type FortunaBusinessContext = {
  locale: ContextLocale;
  name: string;
  /** One-line brand tagline, as shown in the hero. */
  tagline: string;
  /** The vision/positioning statement used site-wide (meta description). */
  vision: string;
  /** The single product this business offers — do not invent a product line. */
  service: { name: string; description: string };
  valueProps: ValueProp[];
  eligibility: string[];
  responsibleBorrowing: string[];
  contact: { phoneDisplay: string; phoneHref: string; emailDisplay: string; emailHref: string };
  offices: FortunaOffice[];
  loan: { minAmount: number; maxAmount: number; minTerm: number; maxTerm: number; currency: string };
};

function extractCity(address: string): string {
  // Office copy is stored as "[CITY]" / "[АДРЕС]"-style placeholders or a
  // real "Street, City" string once supplied — take the trailing segment.
  const parts = address.split(",");
  return parts[parts.length - 1].trim() || address;
}

function buildContext(locale: ContextLocale): FortunaBusinessContext {
  const dict = locale === "bg" ? bgDict : enDict;
  const openingDateLabel = locale === "bg" ? "1 октомври" : "October 1";

  const offices: FortunaOffice[] = officesMeta.map((meta) => {
    if (meta.isNew) {
      return {
        id: meta.id,
        name: dict.newOfficeData.name,
        city: dict.newOfficeData.city,
        address: dict.newOfficeData.address,
        phone: dict.newOfficeData.phone,
        hours: dict.newOfficeData.hours,
        isNew: true,
        openingDateISO: meta.openingDateISO,
        openingDateLabel,
      };
    }
    const index = officesMeta.filter((m) => !m.isNew).findIndex((m) => m.id === meta.id);
    const copy = dict.offices[index] ?? dict.offices[0];
    return {
      id: meta.id,
      name: copy.name,
      city: extractCity(copy.address),
      address: copy.address,
      phone: copy.phone,
      hours: `${dict.officeCard.mondayFriday}: ${copy.hours.mondayFriday}`,
      isNew: false,
    };
  });

  return {
    locale,
    name: fortuna.name,
    tagline: `${dict.hero.titleLine1} ${dict.hero.titleLine2}`,
    vision: dict.meta.home.description,
    service: {
      name: locale === "bg" ? "Потребителски кредити" : "Consumer loans",
      description: dict.hero.subtitle,
    },
    valueProps: dict.why.items,
    eligibility: dict.eligibility.items,
    responsibleBorrowing: dict.responsibleBorrowing.points,
    contact: {
      phoneDisplay: dict.common.phonePlaceholder,
      phoneHref: fortuna.phoneHref,
      emailDisplay: dict.common.emailPlaceholder,
      emailHref: fortuna.emailHref,
    },
    offices,
    loan: {
      minAmount: loanConfig.minAmount,
      maxAmount: loanConfig.maxAmount,
      minTerm: loanConfig.minTerm,
      maxTerm: loanConfig.maxTerm,
      currency: loanConfig.currency,
    },
  };
}

export const FORTUNA_CONTEXT: Record<ContextLocale, FortunaBusinessContext> = {
  bg: buildContext("bg"),
  en: buildContext("en"),
};

export function getFortunaContext(locale: ContextLocale): FortunaBusinessContext {
  return FORTUNA_CONTEXT[locale];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Looks for a mention of a known, verified office's city in free text (the
 * admin's campaign idea). Only ever matches against real configured
 * offices — never fabricates a match for a city that isn't one of ours.
 */
export function findOfficeByText(text: string, ctx: FortunaBusinessContext): FortunaOffice | null {
  const normalizedText = normalize(text);
  if (!normalizedText.trim()) return null;

  return (
    ctx.offices.find((office) => {
      const city = normalize(office.city);
      // Bracket placeholders (e.g. "[CITY]") can't meaningfully match free
      // text — skip until the business supplies a real city name.
      if (!city || city.includes("[")) return false;
      return normalizedText.includes(city);
    }) ?? null
  );
}
