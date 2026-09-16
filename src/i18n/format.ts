import type { Locale } from "./config";

export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}

const intlLocale: Record<Locale, string> = {
  bg: "bg-BG",
  en: "en-GB",
};

export function formatCurrency(amount: number, locale: Locale, currency = "BGN"): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(value);
}

export function formatDate(iso: string, locale: Locale, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }): string {
  return new Intl.DateTimeFormat(intlLocale[locale], options).format(new Date(iso));
}
