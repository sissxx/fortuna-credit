import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
          <span className="h-px w-6 bg-brand-gold" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-heading text-3xl font-normal tracking-tight sm:text-4xl",
          dark ? "text-white" : "text-brand-black"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed", dark ? "text-brand-muted" : "text-brand-gray/70")}>
          {description}
        </p>
      )}
    </div>
  );
}
