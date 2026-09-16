"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, routeSlugs, type Locale, type RouteKey } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { cn } from "@/lib/utils";

function currentRouteKey(pathname: string, locale: Locale): RouteKey | null {
  const rest = pathname.replace(new RegExp(`^/${locale}/?`), "");
  if (!rest) return "home";
  const firstSegment = rest.split("/")[0];
  const entry = (Object.entries(routeSlugs) as [RouteKey, Record<Locale, string>][]).find(
    ([, slugs]) => slugs[locale] === firstSegment
  );
  return entry ? entry[0] : null;
}

export default function LanguageSwitcher({
  dict,
  locale,
  variant = "header",
}: {
  dict: Dictionary;
  locale: Locale;
  variant?: "header" | "menu";
}) {
  const pathname = usePathname();
  const route = currentRouteKey(pathname, locale);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-black/10 p-0.5 text-xs font-bold",
        variant === "menu" && "w-full justify-center border-white/15"
      )}
      role="group"
      aria-label={dict.languageSwitcher.label}
    >
      {locales.map((loc) => {
        const isActive = loc === locale;
        const slug = route ? routeSlugs[route][loc] : "";
        const href = slug ? `/${loc}/${slug}` : `/${loc}`;

        return (
          <Link
            key={loc}
            href={href}
            aria-current={isActive ? "true" : undefined}
            lang={loc}
            className={cn(
              "rounded-full px-2.5 py-1.5 transition-colors",
              isActive
                ? "bg-brand-gold text-brand-black"
                : variant === "menu"
                  ? "text-white/60 hover:text-white"
                  : "text-brand-gray/60 hover:text-brand-black"
            )}
          >
            {dict.languageSwitcher[loc]}
          </Link>
        );
      })}
    </div>
  );
}
