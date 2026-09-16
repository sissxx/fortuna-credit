import SectionHeading from "../ui/SectionHeading";
import type { Dictionary } from "@/i18n/getDictionary";

export default function ResponsibleBorrowing({ dict }: { dict: Dictionary }) {
  const r = dict.responsibleBorrowing;

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
        <SectionHeading eyebrow={r.eyebrow} title={r.title} description={r.description} />
        <ul className="space-y-3">
          {r.points.map((point) => (
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
