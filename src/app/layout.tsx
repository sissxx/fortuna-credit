import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import MobileBottomCTA from "@/components/MobileBottomCTA";
import { ToastProvider } from "@/components/ui/Toast";
import { fortuna } from "@/config/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.fortunacredit.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fortuna Credit — Fast, Simple, Transparent Loans",
    template: "%s | Fortuna Credit",
  },
  description:
    "Fortuna Credit offers fast, simple consumer credit with clear terms and personal support. Apply online or visit an office near you.",
  openGraph: {
    title: "Fortuna Credit — Fast, Simple, Transparent Loans",
    description:
      "Get the financial support you need with a simple application and clear terms. Apply online or visit a Fortuna Credit office.",
    url: siteUrl,
    siteName: fortuna.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortuna Credit — Fast, Simple, Transparent Loans",
    description: "Simple application. Clear terms. Personal support.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-brand-gray pb-20 lg:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-brand-gold focus:px-4 focus:py-2 focus:text-brand-black focus:font-semibold"
        >
          Skip to main content
        </a>
        <ToastProvider>
          <AnnouncementBar />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileBottomCTA />
        </ToastProvider>
      </body>
    </html>
  );
}
