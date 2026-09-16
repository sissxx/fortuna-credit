import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import LoanCalculator from "@/components/LoanCalculator";
import CTASection from "@/components/sections/CTASection";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { localePath, resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "loans", title: dict.meta.loans.title, description: dict.meta.loans.description });
}

export default async function LoansPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.loansPage;

  const highlights = [
    { label: p.highlights.minAmount, value: dict.conditionsPage.labels.minAmount },
    { label: p.highlights.maxAmount, value: dict.conditionsPage.labels.maxAmount },
    { label: p.highlights.loanTerms, value: dict.conditionsPage.labels.loanTerms },
    { label: p.highlights.interestRate, value: dict.conditionsPage.labels.interestRate },
  ];
  // Actual figures live in dict.conditionsPage; here we only need the badge
  // treatment, so reuse the "to be confirmed" placeholder consistently.
  const values = [dict.common.tbc, dict.common.tbc, dict.common.tbc, dict.common.tbc];

  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.description} dark />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, i) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{values[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:px-8">
          <div>
            <SectionHeading eyebrow={p.calcEyebrow} title={p.calcTitle} description={p.calcDescription} />
            <ul className="mt-8 space-y-4 text-sm text-brand-gray/75">
              <li className="flex gap-3">
                <Dot /> {p.bullet1}
              </li>
              <li className="flex gap-3">
                <Dot /> {p.bullet2}
              </li>
              <li className="flex gap-3">
                <Dot /> {p.bullet3}
              </li>
            </ul>
            <div className="mt-8">
              <Button href={localePath(locale, "conditions")} variant="secondary">
                {p.viewConditions}
              </Button>
            </div>
          </div>

          <LoanCalculator dict={dict} locale={locale} />
        </div>
      </section>

      <CTASection dict={dict} locale={locale} />
    </>
  );
}

function Dot() {
  return <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden />;
}
