import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import icon from "../../public/logo/icon.png";
import lockupHorizontalDark from "../../public/logo/lockup-horizontal-dark.png";

export default function Logo({ dark = false, className, locale = "bg" }: { dark?: boolean; className?: string; locale?: Locale }) {
  if (dark) {
    return (
      <Link href={`/${locale}`} className={cn("group inline-block", className)} aria-label="Fortuna Credit">
        <Image
          src={lockupHorizontalDark}
          alt="Fortuna Credit"
          className="h-10 w-auto transition-opacity duration-200 group-hover:opacity-90 sm:h-11"
          priority
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}`}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Fortuna Credit"
    >
      <Image
        src={icon}
        alt=""
        aria-hidden
        className="h-9 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-brand text-xl font-normal tracking-wide text-brand-black">FORTUNA</span>
        <span className="mt-1 flex items-center gap-2">
          <span className="h-px w-4 bg-brand-gold transition-all duration-300 group-hover:w-7" aria-hidden />
          <span className="text-[11px] font-semibold tracking-[0.32em] text-brand-gold">CREDIT</span>
        </span>
      </span>
    </Link>
  );
}
