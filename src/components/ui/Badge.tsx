import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "gold" | "outline" | "dark" | "success" | "warning";

const variants: Record<Variant, string> = {
  gold: "bg-brand-gold text-brand-black",
  outline: "border border-brand-gold text-brand-gold bg-transparent",
  dark: "bg-brand-black text-white border border-white/10",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
};

export default function Badge({
  children,
  variant = "gold",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
