import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import CTASection from "@/components/sections/CTASection";
import { loanConditions } from "@/config/site";

export const metadata: Metadata = {
  title: "Loan Conditions",
  description:
    "Review Fortuna Credit's loan conditions, eligibility requirements, fees, and repayment terms in one clear place.",
  alternates: { canonical: "/conditions" },
};

const keyTerms = [
  { label: "Minimum loan amount", value: loanConditions.minAmount },
  { label: "Maximum loan amount", value: loanConditions.maxAmount },
  { label: "Loan terms", value: loanConditions.loanTerms },
  { label: "Interest rate", value: loanConditions.interestRate },
  { label: "APR", value: loanConditions.apr },
  { label: "Fees", value: loanConditions.fees },
];

const eligibility = [
  { label: "Minimum age", value: loanConditions.minimumAge },
  { label: "Required documents", value: loanConditions.requiredDocuments.join(", ") },
  { label: "Income requirements", value: loanConditions.incomeRequirements },
];

const repayment = [
  { label: "Repayment methods", value: loanConditions.repaymentMethods },
  { label: "Early repayment", value: loanConditions.earlyRepayment },
  { label: "Late payment", value: loanConditions.latePayment },
  { label: "Other charges", value: loanConditions.otherCharges },
];

function ConditionsTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/8">
      <table className="w-full text-left text-sm">
        <tbody className="divide-y divide-black/8">
          {rows.map((row) => (
            <tr key={row.label} className="odd:bg-black/[0.015]">
              <th scope="row" className="w-1/2 px-5 py-4 font-semibold text-brand-black sm:w-2/5">
                {row.label}
              </th>
              <td className="px-5 py-4 text-brand-gray/75">
                {row.value === "[TO BE CONFIRMED]" ? (
                  <Badge variant="outline">To be confirmed</Badge>
                ) : (
                  row.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ConditionsPage() {
  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Conditions"
            title="Loan conditions, in plain language"
            description="Everything below is organized so you can find what you need quickly. Figures marked as to be confirmed will be published as soon as they are finalized."
            dark
          />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-14 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-bold text-brand-black">Key loan terms</h2>
            <p className="mt-2 text-sm text-brand-gray/60">Core figures that define your loan.</p>
            <div className="mt-5">
              <ConditionsTable rows={keyTerms} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-black">Eligibility requirements</h2>
            <p className="mt-2 text-sm text-brand-gray/60">What you need to qualify.</p>
            <div className="mt-5">
              <ConditionsTable rows={eligibility} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-black">Repayment</h2>
            <p className="mt-2 text-sm text-brand-gray/60">How and when repayments are due.</p>
            <div className="mt-5">
              <ConditionsTable rows={repayment} />
            </div>
          </div>

          <div id="terms" className="scroll-mt-24 rounded-2xl border border-black/8 bg-black/[0.02] p-7">
            <h2 className="text-xl font-bold text-brand-black">Full Terms &amp; Conditions</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray/70">
              The complete Terms &amp; Conditions document governing Fortuna Credit loan agreements is{" "}
              <Badge variant="outline">to be confirmed</Badge>. It will be published here and provided to
              every applicant before they accept a loan offer.
            </p>
          </div>

          <div id="privacy" className="scroll-mt-24 rounded-2xl border border-black/8 bg-black/[0.02] p-7">
            <h2 className="text-xl font-bold text-brand-black">Privacy Policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray/70">
              Our Privacy Policy explains how we collect, use, and protect your personal information.
              Full details are <Badge variant="outline">to be confirmed</Badge>.
            </p>
          </div>

          <div id="cookies" className="scroll-mt-24 rounded-2xl border border-black/8 bg-black/[0.02] p-7">
            <h2 className="text-xl font-bold text-brand-black">Cookie Policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray/70">
              Details on the cookies and similar technologies used on this website are{" "}
              <Badge variant="outline">to be confirmed</Badge>.
            </p>
          </div>

          <div
            id="responsible-lending"
            className="scroll-mt-24 rounded-2xl border border-brand-gold/30 bg-brand-black p-7 text-white"
          >
            <h2 className="text-xl font-bold">Responsible Lending Information</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">
              Fortuna Credit assesses every application to help ensure loans are appropriate for the
              applicant&apos;s circumstances. We encourage every customer to review the total repayment
              amount, understand applicable interest and fees, and confirm repayments fit comfortably
              within their budget before accepting an offer. Specific responsible lending policies and
              disclosures are <Badge variant="outline">to be confirmed</Badge>.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Have questions about your terms?"
        description="Our team can walk you through exactly what applies to your application."
      />
    </>
  );
}
