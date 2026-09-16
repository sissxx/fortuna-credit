import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Card({
  children,
  className,
  variant = "light",
}: {
  children: ReactNode;
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        variant === "light"
          ? "bg-white border-black/8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          : "bg-brand-black-deep border-white/10 hover:border-brand-gold/40",
        className
      )}
    >
      {children}
    </div>
  );
}
