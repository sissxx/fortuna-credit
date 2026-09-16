import type { MetadataRoute } from "next";
import { locales, alternatePaths, type RouteKey } from "@/i18n/config";
import { siteUrl } from "@/i18n/metadata";

const routes: RouteKey[] = [
  "home",
  "loans",
  "howItWorks",
  "conditions",
  "locations",
  "faq",
  "contact",
  "apply",
  "applicationStatus",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    const paths = alternatePaths(route);
    return locales.map((locale) => ({
      url: `${siteUrl}${paths[locale]}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "home" ? 1 : 0.7,
      alternates: {
        languages: {
          bg: `${siteUrl}${paths.bg}`,
          en: `${siteUrl}${paths.en}`,
        },
      },
    }));
  });
}
