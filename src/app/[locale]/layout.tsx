import type { Metadata } from "next";
import { Inter, Vidaloka, Playfair_Display } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import MobileBottomCTA from "@/components/MobileBottomCTA";
import MobileCtaSpacer from "@/components/MobileCtaSpacer";
import { ToastProvider } from "@/components/ui/Toast";
import { locales, resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { siteUrl } from "@/i18n/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Matches the logo wordmark. Latin-only on Google Fonts — used for English
// display headings and the brand wordmark, never for Cyrillic text.
const vidaloka = Vidaloka({
  variable: "--font-vidaloka",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Cyrillic-capable stand-in for Bulgarian display headings — a similarly
// elegant high-contrast serif, so bg/en headings read as one brand even
// though Vidaloka itself has no Cyrillic glyphs.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.meta.home.title,
      template: `%s | ${dict.siteName}`,
    },
    description: dict.meta.home.description,
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);

  const headingFont = locale === "en" ? "var(--font-vidaloka)" : "var(--font-playfair)";

  return (
    <html
      lang={dict.htmlLang}
      className={`${inter.variable} ${vidaloka.variable} ${playfair.variable} h-full antialiased`}
      style={{ ["--font-heading" as string]: headingFont }}
    >
      <body className="flex min-h-full flex-col bg-white text-brand-gray">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-brand-gold focus:px-4 focus:py-2 focus:text-brand-black focus:font-semibold"
        >
          {dict.common.skipToContent}
        </a>
        <ToastProvider>
          <AnnouncementBar dict={dict} locale={locale} />
          <Header dict={dict} locale={locale} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <MobileCtaSpacer locale={locale} />
          <Footer dict={dict} locale={locale} />
          <MobileBottomCTA dict={dict} locale={locale} />
        </ToastProvider>
      </body>
    </html>
  );
}
