import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gold text-brand-black hover:bg-brand-gold-bright hover:shadow-[0_0_24px_rgba(201,162,39,0.35)] active:scale-[0.98]",
  secondary:
    "bg-brand-black text-white border border-brand-gold/40 hover:border-brand-gold hover:bg-brand-black-deep active:scale-[0.98]",
  outline:
    "bg-transparent border border-white/25 text-white hover:border-brand-gold hover:text-brand-gold-bright active:scale-[0.98]",
  ghost: "bg-transparent text-brand-gray hover:text-brand-black underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", children, className, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={props.href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
