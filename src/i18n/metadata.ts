import type { Metadata } from "next";
import { alternatePaths, type Locale, type RouteKey } from "./config";

const siteUrl = "https://www.fortunacredit.example";

export function buildMetadata({
  locale,
  route,
  title,
  description,
}: {
  locale: Locale;
  route: RouteKey;
  title: string;
  description: string;
}): Metadata {
  const paths = alternatePaths(route);
  const canonical = `${siteUrl}${paths[locale]}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        bg: `${siteUrl}${paths.bg}`,
        en: `${siteUrl}${paths.en}`,
        "x-default": `${siteUrl}${paths.bg}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "bg" ? "bg_BG" : "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export { siteUrl };
