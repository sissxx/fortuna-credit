"use client";

import { usePathname } from "next/navigation";
import { localePath, type Locale } from "@/i18n/config";

// Reserves space for the fixed mobile bottom CTA bar so it never overlaps
// the footer. Hidden together with the bar itself on the apply page, where
// it would otherwise leave a pointless gap.
export default function MobileCtaSpacer({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const applyHref = localePath(locale, "apply");

  if (pathname === applyHref) return null;

  return <div className="h-20 lg:hidden" aria-hidden />;
}
