import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Vidaloka, Playfair_Display } from "next/font/google";
import "../globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"], display: "swap" });
const vidaloka = Vidaloka({ variable: "--font-vidaloka", subsets: ["latin"], weight: "400", display: "swap" });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fortuna Credit — Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin/instagram", label: "Instagram Generator" },
  { href: "/admin/instagram/saved", label: "Saved Posts" },
  { href: "/admin/instagram/templates", label: "Templates" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${vidaloka.variable} ${playfair.variable} h-full antialiased`}
      style={{ ["--font-heading" as string]: "var(--font-vidaloka)" }}
    >
      <body className="flex min-h-full bg-white text-brand-gray">
        <ToastProvider>
          <div className="flex min-h-screen w-full">
            <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-brand-black px-5 py-6 lg:flex">
              <Link href="/admin" className="mb-8 block">
                <span className="font-brand text-lg text-white">FORTUNA</span>
                <span className="ml-2 text-[11px] font-semibold tracking-[0.28em] text-brand-gold">ADMIN</span>
              </Link>
              <nav aria-label="Admin" className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-muted transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto rounded-xl border border-brand-gold/20 bg-white/5 p-4 text-xs leading-relaxed text-brand-muted">
                Internal tool — not indexed, not linked from the public site. No authentication is configured;
                restrict access at the hosting/infra layer before deploying.
              </div>
            </aside>

            <div className="flex min-h-screen flex-1 flex-col">
              <header className="flex items-center justify-between border-b border-black/8 bg-white px-4 py-3 lg:hidden">
                <Link href="/admin" className="font-brand text-base text-brand-black">
                  FORTUNA <span className="text-brand-gold">ADMIN</span>
                </Link>
              </header>
              <nav aria-label="Admin mobile" className="flex gap-1 overflow-x-auto border-b border-black/8 bg-white px-4 py-2 lg:hidden">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="shrink-0 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-brand-gray"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <main className="flex-1 bg-black/[0.015] p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
