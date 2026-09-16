"use client";

import { cn } from "@/lib/utils";
import { useId, type SelectHTMLAttributes, type ReactNode } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
};

export default function Select({ label, error, optional, className, id, required, children, ...rest }: Props) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="flex items-baseline justify-between text-sm font-medium text-brand-gray">
        <span>
          {label}
          {required && <span className="ml-0.5 text-brand-gold" aria-hidden>*</span>}
        </span>
        {optional && <span className="text-xs font-normal text-brand-gray/50">Optional</span>}
      </label>
      <select
        id={selectId}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full appearance-none rounded-xl border bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23070707%22><path d=%22M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z%22/></svg>')] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-base text-brand-black transition-colors",
          "focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:outline-none",
          error ? "border-red-500" : "border-black/12",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
