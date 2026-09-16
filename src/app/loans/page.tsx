import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import LoanCalculator from "@/components/LoanCalculator";
import CTASection from "@/components/sections/CTASection";
import { loanConditions } from "@/config/site";

export const metadata: Metadata = {
  title: "Loans",
  description:
    "Explore Fortuna Credit's loan options, estimate your repayment with our calculator, and learn what to expect before you apply.",
  alternates: { canonical: "/loans" },
};

const highlights = [
  { label: "Minimum amount", value: loanConditions.minAmount },
  { label: "Maximum amount", value: loanConditions.maxAmount },
  { label: "Loan terms", value: loanConditions.loanTerms },
  { label: "Interest rate", value: loanConditions.interestRate },
];

export default function LoansPage() {
  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Loans"
            title="Credit designed to be simple to understand"
            description="One straightforward loan product with clear terms — estimate your repayment below, then apply when you're ready."
            dark
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Estimate your loan"
              title="See what your repayment could look like"
              description="Adjust the amount and term to get an illustrative estimate. Your actual offer is confirmed after application and assessment."
            />
            <ul className="mt-8 space-y-4 text-sm text-brand-gray/75">
              <li className="flex gap-3">
                <Dot /> Choose an amount and term that fits your situation.
              </li>
              <li className="flex gap-3">
                <Dot /> Review the estimated interest, fees, and total repayment.
              </li>
              <li className="flex gap-3">
                <Dot /> Apply directly with your selected amount pre-filled.
              </li>
            </ul>
            <div className="mt-8">
              <Button href="/conditions" variant="secondary">
                View Full Conditions
              </Button>
            </div>
          </div>

          <LoanCalculator />
        </div>
      </section>

      <CTASection />
    </>
  );
}

function Dot() {
  return <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden />;
}
