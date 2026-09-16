"use client";

import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function MobileBottomCTA({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const pathname = usePathname();
  const applyHref = localePath(locale, "apply");

  // The apply page already ends in a submit/continue button in view — a
  // floating "Apply Now" bar on top of it is redundant and, worse, covers
  // form content while scrolling. Hide it there.
  if (pathname === applyHref) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-80 flex items-center justify-between gap-4 border-t border-brand-gold/20 bg-brand-black/95 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 backdrop-blur-md lg:hidden"
      role="complementary"
      aria-label={dict.mobileCta.apply}
    >
      <p className="text-sm font-semibold text-white">
        {dict.mobileCta.title}
        <span className="block text-xs font-normal text-brand-muted">{dict.mobileCta.subtitle}</span>
      </p>
      <Button href={applyHref} size="md" variant="primary" className="shrink-0">
        {dict.mobileCta.apply} →
      </Button>
    </div>
  );
}
