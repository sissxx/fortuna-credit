import type { NextConfig } from "next";
import { routeSlugs } from "./src/i18n/config";

// Canonical page folders are named with the English route slug. Bulgarian
// pages are served at their own localized slug via a rewrite, and the
// English-named path is permanently redirected to the localized one so
// there is exactly one indexable URL per locale (no duplicate content).
const localizedRoutes = Object.values(routeSlugs).filter(
  (slugs) => slugs.bg && (slugs.bg as string) !== (slugs.en as string)
);

const bgRewrites = localizedRoutes.map((slugs) => ({
  source: `/bg/${slugs.bg}`,
  destination: `/bg/${slugs.en}`,
}));

const bgRedirects = localizedRoutes.map((slugs) => ({
  source: `/bg/${slugs.en}`,
  destination: `/bg/${slugs.bg}`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  async rewrites() {
    return bgRewrites;
  },
  async redirects() {
    return bgRedirects;
  },
};

export default nextConfig;
