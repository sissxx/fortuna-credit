"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loanConfig } from "@/config/site";
import { formatCurrency, cn } from "@/lib/utils";
import Button from "./ui/Button";

export function estimateLoan(amount: number, term: number) {
  const interest = Math.round(amount * (loanConfig.interestRate / 100) * (term / 12));
  const fees = loanConfig.feesFlat;
  const total = amount + interest + fees;
  const monthlyPayment = Math.round(total / term);
  return { interest, fees, total, monthlyPayment };
}

export default function LoanCalculator({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [amount, setAmount] = useState(loanConfig.defaultAmount);
  const [term, setTerm] = useState(loanConfig.defaultTerm);
  const router = useRouter();
  const dark = variant === "dark";

  const { interest, fees, total, monthlyPayment } = useMemo(() => estimateLoan(amount, term), [amount, term]);

  const amountProgress = ((amount - loanConfig.minAmount) / (loanConfig.maxAmount - loanConfig.minAmount)) * 100;
  const termProgress = ((term - loanConfig.minTerm) / (loanConfig.maxTerm - loanConfig.minTerm)) * 100;

  function handleApply() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "fortuna-loan-selection",
        JSON.stringify({ amount, term })
      );
    }
    router.push("/apply");
  }

  return (
    <div
      className={cn(
        "rounded-3xl border p-6 shadow-xl sm:p-8",
        dark ? "border-brand-gold/20 bg-brand-black-deep text-white" : "border-black/8 bg-white text-brand-black"
      )}
    >
      <p className={cn("text-xs font-bold uppercase tracking-widest", dark ? "text-brand-gold" : "text-brand-gold")}>
        Loan calculator
      </p>
      <h3 className={cn("mt-1 text-xl font-bold", dark && "text-white")}>Estimate your loan</h3>

      <div className="mt-6 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="calc-amount" className={cn("text-sm font-medium", dark ? "text-brand-muted" : "text-brand-gray")}>
              How much do you need?
            </label>
            <span className="text-lg font-bold tabular-nums text-brand-gold-bright">
              {formatCurrency(amount, loanConfig.currencySymbol)}
            </span>
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
            aria-valuetext={formatCurrency(amount, loanConfig.currencySymbol)}
          />
          <div className={cn("mt-1 flex justify-between text-xs", dark ? "text-brand-muted/70" : "text-brand-gray/50")}>
            <span>{formatCurrency(loanConfig.minAmount, loanConfig.currencySymbol)}</span>
            <span>{formatCurrency(loanConfig.maxAmount, loanConfig.currencySymbol)}</span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="calc-term" className={cn("text-sm font-medium", dark ? "text-brand-muted" : "text-brand-gray")}>
              Loan term
            </label>
            <span className="text-lg font-bold tabular-nums text-brand-gold-bright">{term} months</span>
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
            aria-valuetext={`${term} months`}
          />
          <div className={cn("mt-1 flex justify-between text-xs", dark ? "text-brand-muted/70" : "text-brand-gray/50")}>
            <span>{loanConfig.minTerm} months</span>
            <span>{loanConfig.maxTerm} months</span>
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
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>Requested amount</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatCurrency(amount, loanConfig.currencySymbol)}</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>Loan term</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{term} months</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>Estimated interest</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatCurrency(interest, loanConfig.currencySymbol)}</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>Estimated fees</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatCurrency(fees, loanConfig.currencySymbol)}</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>Total repayment</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatCurrency(total, loanConfig.currencySymbol)}</dd>
        </div>
        <div>
          <dt className={cn(dark ? "text-brand-muted" : "text-brand-gray/60")}>Est. monthly payment</dt>
          <dd className="mt-0.5 font-bold tabular-nums text-brand-gold-bright">
            {formatCurrency(monthlyPayment, loanConfig.currencySymbol)}
          </dd>
        </div>
      </dl>

      <p className={cn("mt-4 text-xs leading-relaxed", dark ? "text-brand-muted/80" : "text-brand-gray/60")}>
        Illustrative calculation only. Final terms are determined after application and assessment.
      </p>

      <Button onClick={handleApply} className="mt-5 w-full" size="lg">
        Apply for this amount
      </Button>
    </div>
  );
}
