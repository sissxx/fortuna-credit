import SectionHeading from "../ui/SectionHeading";

const points = [
  "Review the total repayment amount before accepting an offer.",
  "Understand the interest and fees that apply to your loan.",
  "Make sure your repayments fit comfortably within your budget.",
  "Read your loan agreement carefully before signing.",
  "Ask our team any questions before accepting the terms.",
];

export default function ResponsibleBorrowing() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
        <SectionHeading
          eyebrow="Responsible lending"
          title="Borrow responsibly"
          description="Credit is a useful tool when it fits your circumstances. We encourage every applicant to take a moment before accepting an offer."
        />
        <ul className="space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 rounded-xl border border-black/8 bg-black/[0.02] p-4 text-sm text-brand-gray/75">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
