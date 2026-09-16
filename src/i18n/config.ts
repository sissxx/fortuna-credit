export const locales = ["bg", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bg";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Canonical (English-based) route segment for each page, and the localized
// slug shown in the URL for each locale. Used to build hreflang alternates
// and locale-aware links without duplicating page implementations.
export const routeSlugs = {
  home: { bg: "", en: "" },
  loans: { bg: "krediti", en: "loans" },
  howItWorks: { bg: "kak-raboti", en: "how-it-works" },
  conditions: { bg: "usloviya", en: "conditions" },
  locations: { bg: "ofisi", en: "locations" },
  faq: { bg: "vaprosi", en: "faq" },
  contact: { bg: "kontakti", en: "contact" },
  apply: { bg: "kandidatstvane", en: "apply" },
  applicationStatus: { bg: "status-na-zayavka", en: "application-status" },
} as const;

export type RouteKey = keyof typeof routeSlugs;

export function localePath(locale: Locale, route: RouteKey): string {
  const slug = routeSlugs[route][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function alternatePaths(route: RouteKey): Record<Locale, string> {
  return {
    bg: localePath("bg", route),
    en: localePath("en", route),
  };
}

// Next.js generates PageProps/LayoutProps with `params: Promise<{ locale: string }>`
// for the `[locale]` segment, which is wider than our Locale union. Route
// handlers declare `params: Promise<{ locale: string }>` and call this to get
// a narrowed, validated Locale instead of casting ad hoc everywhere.
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : defaultLocale;
}
