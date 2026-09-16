import SectionHeading from "../ui/SectionHeading";
import type { Dictionary } from "@/i18n/getDictionary";

export default function HowItWorks({ dict }: { dict: Dictionary }) {
  const s = dict.howItWorksSection;

  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} description={s.description} align="center" className="mx-auto" />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {s.steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative animate-fade-up rounded-2xl border border-black/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_12px_40px_rgba(201,162,39,0.12)]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-4xl font-extrabold text-black/8 transition-colors duration-300 group-hover:text-brand-gold/25">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-bold text-brand-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray/70">{step.description}</p>
              {index < s.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-[-14px] top-1/2 hidden h-px w-7 -translate-y-1/2 bg-gradient-to-r from-brand-gold/40 to-transparent lg:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
