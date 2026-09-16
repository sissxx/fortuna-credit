"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./ui/Button";
import LanguageSwitcher from "./LanguageSwitcher";
import { localePath, type Locale, type RouteKey } from "@/i18n/config";
import { fortuna } from "@/config/site";
import type { Dictionary } from "@/i18n/getDictionary";
import { cn } from "@/lib/utils";

const NAV_ROUTES: RouteKey[] = ["home", "loans", "howItWorks", "conditions", "locations", "faq", "contact"];
const NAV_LABEL_KEY: Record<RouteKey, keyof Dictionary["nav"]> = {
  home: "home",
  loans: "loans",
  howItWorks: "howItWorks",
  conditions: "conditions",
  locations: "locations",
  faq: "faq",
  contact: "contact",
  apply: "apply",
  applicationStatus: "apply",
};

export default function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const applyHref = localePath(locale, "apply");

  return (
    <header className="sticky top-0 z-90 border-b border-black/8 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo locale={locale} />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-7">
            {NAV_ROUTES.map((route) => {
              const href = localePath(locale, route);
              const isActive = pathname === href;
              return (
                <li key={route}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-sm font-medium text-brand-gray transition-colors hover:text-brand-black",
                      isActive && "text-brand-black"
                    )}
                  >
                    {dict.nav[NAV_LABEL_KEY[route]]}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-brand-gold transition-transform duration-200",
                        isActive && "scale-x-100"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher dict={dict} locale={locale} />
          <a href={fortuna.phoneHref} className="whitespace-nowrap text-sm font-medium text-brand-gray hover:text-brand-black">
            {dict.common.phonePlaceholder}
          </a>
          <Button href={applyHref} size="md">
            {dict.nav.apply}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button href={applyHref} size="sm" className="!px-4 !py-2">
            {dict.nav.apply}
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? dict.header.closeMenu : dict.header.openMenu}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-brand-black"
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-4 bg-current transition-all duration-200",
                  menuOpen && "top-1.5 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity duration-200",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-3 h-0.5 w-4 bg-current transition-all duration-200",
                  menuOpen && "top-1.5 -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "grid overflow-hidden border-t border-black/8 bg-white transition-all duration-300 ease-out lg:hidden",
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 border-t-0"
        )}
      >
        <div className="overflow-hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4">
            {NAV_ROUTES.map((route) => {
              const href = localePath(locale, route);
              return (
                <Link
                  key={route}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 text-base font-medium text-brand-gray hover:bg-black/5 hover:text-brand-black",
                    pathname === href && "bg-black/5 text-brand-black"
                  )}
                >
                  {dict.nav[NAV_LABEL_KEY[route]]}
                </Link>
              );
            })}
            <a
              href={fortuna.phoneHref}
              className="mt-2 rounded-lg border border-black/10 px-3 py-3 text-center text-base font-medium text-brand-gray"
            >
              {dict.common.callUs}: {dict.common.phonePlaceholder}
            </a>
            <div className="mt-3 flex justify-center border-t border-black/8 pt-4">
              <LanguageSwitcher dict={dict} locale={locale} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
