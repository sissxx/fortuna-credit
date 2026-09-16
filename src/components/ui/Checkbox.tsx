"use client";

import { cn } from "@/lib/utils";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  error?: string;
};

export default function Checkbox({ label, error, className, id, required, ...rest }: Props) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const errorId = `${checkboxId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={checkboxId} className="flex cursor-pointer items-start gap-3 text-sm text-brand-gray">
        <input
          id={checkboxId}
          type="checkbox"
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 rounded border-black/25 text-brand-gold accent-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold",
            className
          )}
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={errorId} role="alert" className="ml-8 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
