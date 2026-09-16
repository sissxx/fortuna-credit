"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loanConfig } from "@/config/site";
import { localePath, type Locale } from "@/i18n/config";
import { formatCurrency } from "@/i18n/format";
import type { Dictionary } from "@/i18n/getDictionary";
import { cn } from "@/lib/utils";
import Button from "./ui/Button";

export function estimateLoan(amount: number, term: number) {
  const interest = Math.round(amount * (loanConfig.interestRate / 100) * (term / 12));
  const fees = loanConfig.feesFlat;
  const total = amount + interest + fees;
  const monthlyPayment = Math.round(total / term);
  return { interest, fees, total, monthlyPayment };
}

export default function LoanCalculator({
  dict,
  locale,
  variant = "light",
}: {
  dict: Dictionary;
  locale: Locale;
  variant?: "light" | "dark";
}) {
  const [amount, setAmount] = useState(loanConfig.defaultAmount);
  const [term, setTerm] = useState(loanConfig.defaultTerm);
  const router = useRouter();
  const dark = variant === "dark";

  const { interest, fees, total, monthlyPayment } = useMemo(() => estimateLoan(amount, term), [amount, term]);

  const amountProgress = ((amount - loanConfig.minAmount) / (loanConfig.maxAmount - loanConfig.minAmount)) * 100;
  const termProgress = ((term - loanConfig.minTerm) / (loanConfig.maxTerm - loanConfig.minTerm)) * 100;

  function handleApply() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("fortuna-loan-selection", JSON.stringify({ amount, term }));
    }
    router.push(localePath(locale, "apply"));
  }

  const money = (value: number) => formatCurrency(value, locale, loanConfig.currency);

  return (
    <div
      className={cn(
        "rounded-3xl border p-6 shadow-xl sm:p-8",
        dark ? "border-brand-gold/20 bg-brand-black-deep text-white" : "border-black/8 bg-white text-brand-black"
      )}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{dict.calculator.eyebrow}</p>
      <h3 className={cn("mt-1 text-xl font-bold", dark && "text-white")}>{dict.calculator.title}</h3>

      <div className="mt-6 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="calc-amount" className={cn("text-sm font-medium", dark ? "text-brand-muted" : "text-brand-gray")}>
              {dict.calculator.amountLabel}
            </label>
            <span className="text-lg font-bold tabular-nums text-brand-gold-bright">{money(amount)}</span>
          </div>
          <input
            id="calc-amount"
            type="range"
            min={loanConfig.minAmount}
            max={loanConfig.maxAmount}
            step={loanConfig.amountStep}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ ["--range-progress" as string]: `${amountProgress}%` }}
            aria-valuetext={money(amount)}
          />
          <div className={cn("mt-1 flex justify-between text-xs", dark ? "text-brand-muted/70" : "text-brand-gray/50")}>
            <span>{money(loanConfig.minAmount)}</span>
            <span>{money(loanConfig.maxAmount)}</span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="calc-term" className={cn("text-sm font-medium", dark ? "text-brand-muted" : "text-brand-gray")}>
              {dict.calculator.termLabel}
            </label>
            <span className="text-lg font-bold tabular-nums text-brand-gold-bright">
              {term} {dict.common.months}
            </span>
          </div>
          <input
            id="calc-term"
            type="range"
            min={loanConfig.minTerm}
            max={loanConfig.maxTerm}
            step={loanConfig.termStep}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            style={{ ["--range-progress" as string]: `${termProgress}%` }}
            aria-valuetext={`${term} ${dict.common.months}`}
          />
          <div className={cn("mt-1 flex justify-between text-xs", dark ? "text-brand-muted/70" : "text-brand-gray/50")}>
            <span>
              {loanConfig.minTerm} {dict.common.months}
            </span>
            <span>
              {loanConfig.maxTerm} {dict.common.months}
            </span>
          </div>
        </div>
      </div>

      <dl
        className={cn(
          "mt-7 grid grid-cols-2 gap-4 rounded-2xl border p-4 text-sm",
          dark ? "border-white/10 bg-white/5" : "border-black/8 bg-black/[0.02]"
        )}
      >
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>{dict.calculator.requestedAmount}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{money(amount)}</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>{dict.calculator.loanTerm}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">
            {term} {dict.common.months}
          </dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>{dict.calculator.estInterest}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{money(interest)}</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>{dict.calculator.estFees}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{money(fees)}</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>{dict.calculator.totalRepayment}</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{money(total)}</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>{dict.calculator.monthlyPayment}</dt>
          <dd className="mt-0.5 font-bold tabular-nums text-brand-gold-bright">{money(monthlyPayment)}</dd>
        </div>
      </dl>

      <p className={cn("mt-4 text-xs leading-relaxed", dark ? "text-brand-muted/80" : "text-brand-gray/60")}>
        {dict.common.illustrativeOnly}
      </p>

      <Button onClick={handleApply} className="mt-5 w-full" size="lg">
        {dict.calculator.cta}
      </Button>
    </div>
  );
}
