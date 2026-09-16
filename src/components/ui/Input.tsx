"use client";

import { cn } from "@/lib/utils";
import { useId, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
};

export default function Input({ label, error, hint, optional, className, id, required, ...rest }: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="flex items-baseline justify-between text-sm font-medium text-brand-gray">
        <span>
          {label}
          {required && <span className="ml-0.5 text-brand-gold" aria-hidden>*</span>}
        </span>
        {optional && <span className="text-xs font-normal text-brand-gray/50">Optional</span>}
      </label>
      <input
        id={inputId}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-base text-brand-black placeholder:text-brand-gray/40 transition-colors",
          "focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none",
          error ? "border-red-500" : "border-black/12",
          className
        )}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-brand-gray/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
