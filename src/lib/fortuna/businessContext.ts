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
// never replaced with plausible-looking fake data.
import bgDict from "@/i18n/dictionaries/bg";
import enDict from "@/i18n/dictionaries/en";
import { fortuna, officesMeta, newOfficeMeta, loanConfig } from "@/config/site";

export type ContextLocale = "bg" | "en";

export type ValueProp = { title: string; description: string };

export type FortunaBusinessContext = {
  locale: ContextLocale;
  name: string;
  /** One-line brand tagline, as shown in the hero. */
  tagline: string;
  /** The vision/positioning statement used site-wide (meta description). */
  vision: string;
  /** The single product this business offers — do not invent a product line. */
  service: { name: string; description: string };
  /** Short brand voice descriptors, derived from the site's own value props. */
  toneWords: string[];
  valueProps: ValueProp[];
  eligibility: string[];
  responsibleBorrowing: string[];
  contact: { phoneDisplay: string; phoneHref: string; emailDisplay: string; emailHref: string };
  offices: { id: string; name: string; address: string; city: string }[];
  newOffice: {
    city: string;
    address: string;
    phone: string;
    hours: string;
    openingDateISO: string;
    openingDateLabel: string;
  };
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

  return {
    locale,
    name: fortuna.name,
    tagline: `${dict.hero.titleLine1} ${dict.hero.titleLine2}`,
    vision: dict.meta.home.description,
    service: {
      name: locale === "bg" ? "Потребителски кредити" : "Consumer loans",
      description: dict.hero.subtitle,
    },
    toneWords:
      locale === "bg"
        ? ["Доверие", "Яснота", "Бързина", "Прозрачност", "Личен подход"]
        : ["Trust", "Clarity", "Speed", "Transparency", "Personal support"],
    valueProps: dict.why.items,
    eligibility: dict.eligibility.items,
    responsibleBorrowing: dict.responsibleBorrowing.points,
    contact: {
      phoneDisplay: dict.common.phonePlaceholder,
      phoneHref: fortuna.phoneHref,
      emailDisplay: dict.common.emailPlaceholder,
      emailHref: fortuna.emailHref,
    },
    offices: officesMeta
      .filter((o) => !o.isNew)
      .map((meta, i) => {
        const copy = dict.offices[i] ?? dict.offices[0];
        return { id: meta.id, name: copy.name, address: copy.address, city: extractCity(copy.address) };
      }),
    newOffice: {
      city: dict.newOfficeData.city,
      address: dict.newOfficeData.address,
      phone: dict.newOfficeData.phone,
      hours: dict.newOfficeData.hours,
      openingDateISO: newOfficeMeta.openingDateISO,
      openingDateLabel: locale === "bg" ? "1 октомври" : "October 1",
    },
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
