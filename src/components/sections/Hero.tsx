import Button from "../ui/Button";
import LoanCalculator from "../LoanCalculator";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-brand-black">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px circle at 80% -10%, rgba(201,162,39,0.18), transparent 55%), radial-gradient(500px circle at 0% 100%, rgba(201,162,39,0.1), transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8 lg:py-24">
        <div className="animate-fade-up">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold-bright">
            {dict.hero.eyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            {dict.hero.titleLine1}
            <br />
            <span className="text-brand-gold-bright">{dict.hero.titleLine2}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-brand-muted">{dict.hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={localePath(locale, "apply")} size="lg" variant="primary">
              {dict.hero.applyNow}
            </Button>
            <Button href={localePath(locale, "howItWorks")} size="lg" variant="outline">
              {dict.hero.howItWorks}
            </Button>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-brand-muted">
            <span className="inline-flex items-center gap-1.5">
              <CheckDot /> {dict.hero.trust1}
            </span>
            <span className="text-white/20" aria-hidden>•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckDot /> {dict.hero.trust2}
            </span>
            <span className="text-white/20" aria-hidden>•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckDot /> {dict.hero.trust3}
            </span>
          </p>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <LoanCalculator dict={dict} locale={locale} variant="dark" />
        </div>
      </div>
    </section>
  );
}

function CheckDot() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="text-brand-gold">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 8.3L7 10.3L11 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
