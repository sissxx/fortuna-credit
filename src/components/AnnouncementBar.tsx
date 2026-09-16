"use client";

import { useState } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { formatDate, t } from "@/i18n/format";
import { newOfficeMeta } from "@/config/site";
import type { Dictionary } from "@/i18n/getDictionary";
import { cn } from "@/lib/utils";

export default function AnnouncementBar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const date = formatDate(newOfficeMeta.openingDateISO, locale);
  const city = dict.newOfficeData.city;

  return (
    <div className="relative z-95 flex items-center justify-center gap-2 bg-brand-black px-4 py-2.5 text-center text-xs font-medium text-white sm:text-sm">
      <p className="truncate">
        <span className="font-bold text-brand-gold-bright">{dict.announcementBar.highlight}</span>
        <span className="hidden sm:inline"> {t(dict.announcementBar.suffix, { date, city })}</span>
        <span className="sm:hidden"> {t(dict.announcementBar.suffixShort, { date })}</span>
      </p>
      <Link
        href={localePath(locale, "locations")}
        className="shrink-0 rounded-full border border-brand-gold/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-gold-bright transition-colors hover:bg-brand-gold hover:text-brand-black"
      >
        {dict.announcementBar.cta}
      </Link>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={dict.announcementBar.dismiss}
        className={cn(
          "absolute right-3 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/50 hover:text-white sm:flex"
        )}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
