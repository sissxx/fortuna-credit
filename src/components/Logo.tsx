import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

export default function Logo({ dark = false, className, locale = "bg" }: { dark?: boolean; className?: string; locale?: Locale }) {
  return (
    <Link
      href={`/${locale}`}
      className={cn("group inline-flex flex-col leading-none", className)}
      aria-label="Fortuna Credit"
    >
      <span
        className={cn(
          "text-lg font-extrabold tracking-[0.14em]",
          dark ? "text-white" : "text-brand-black"
        )}
      >
        FORTUNA
      </span>
      <span className="mt-1 flex items-center gap-2">
        <span className="h-px w-4 bg-brand-gold transition-all duration-300 group-hover:w-7" aria-hidden />
        <span className="text-[11px] font-semibold tracking-[0.32em] text-brand-gold">CREDIT</span>
      </span>
    </Link>
  );
}
