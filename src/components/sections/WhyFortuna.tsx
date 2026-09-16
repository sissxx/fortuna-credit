import SectionHeading from "../ui/SectionHeading";
import { advantages } from "@/config/site";

const icons = [
  <path key="1" d="M4 8h16M4 12h10M4 16h7" />,
  <path key="2" d="M5 12l4 4L19 6" />,
  <path key="3" d="M12 4a8 8 0 108 8" />,
  <path key="4" d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" />,
  <path key="5" d="M4 6h16v12H4zM4 10h16" />,
  <path key="6" d="M12 4v16M4 12h16" />,
];

export default function WhyFortuna() {
  return (
    <section className="bg-brand-black py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Fortuna Credit"
          title="Built around trust and simplicity"
          description="We designed our process to be transparent from the first click to your final payment."
          dark
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage, index) => (
            <div
              key={advantage.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-brand-gold/40 hover:bg-white/[0.05]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 text-brand-gold-bright">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {icons[index % icons.length]}
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{advantage.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
