"use client";

import { useState } from "react";
import Link from "next/link";
import { newOffice } from "@/config/site";
import { cn } from "@/lib/utils";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-95 flex items-center justify-center gap-2 bg-brand-black px-4 py-2.5 text-center text-xs font-medium text-white sm:text-sm">
      <p className="truncate">
        <span className="font-bold text-brand-gold-bright">New Fortuna Credit location</span>
        <span className="hidden sm:inline"> — opening {newOffice.openingDateLabel} in {newOffice.city}.</span>
        <span className="sm:hidden"> — {newOffice.openingDateLabel}.</span>
      </p>
      <Link
        href="/locations"
        className={cn(
          "shrink-0 rounded-full border border-brand-gold/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-gold-bright transition-colors hover:bg-brand-gold hover:text-brand-black"
        )}
      >
        Discover
      </Link>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/50 hover:text-white sm:flex"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
