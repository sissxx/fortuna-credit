import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import { eligibilityRequirements } from "@/config/site";

export default function EligibilitySection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/8 bg-gradient-to-br from-black/[0.02] to-transparent p-8 sm:p-12">
          <SectionHeading eyebrow="Eligibility" title="Can I apply?" />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {eligibilityRequirements.map((requirement) => (
              <li key={requirement} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm text-brand-gray/80">{requirement}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href="/conditions" variant="secondary">
              Check Eligibility
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
