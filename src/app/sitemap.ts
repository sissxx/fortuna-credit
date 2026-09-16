import type { MetadataRoute } from "next";

const baseUrl = "https://www.fortunacredit.example";

const routes = [
  "",
  "/loans",
  "/how-it-works",
  "/conditions",
  "/locations",
  "/faq",
  "/contact",
  "/apply",
  "/application-status",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
