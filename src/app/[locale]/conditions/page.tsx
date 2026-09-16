import type { ReactNode } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import CTASection from "@/components/sections/CTASection";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { withBadge } from "@/i18n/renderTemplate";
import { resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "conditions", title: dict.meta.conditions.title, description: dict.meta.conditions.description });
}

function ConditionsTable({ rows, tbc }: { rows: { label: string; value: string }[]; tbc: string }) {
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
                {row.value === tbc ? <Badge variant="outline">{tbc}</Badge> : row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ConditionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.conditionsPage;
  const l = p.labels;
  const tbc = dict.common.tbc;

  const keyTerms = [
    { label: l.minAmount, value: tbc },
    { label: l.maxAmount, value: tbc },
    { label: l.loanTerms, value: tbc },
    { label: l.interestRate, value: tbc },
    { label: l.apr, value: tbc },
    { label: l.fees, value: tbc },
  ];
  const eligibility = [
    { label: l.minimumAge, value: tbc },
    { label: l.requiredDocuments, value: tbc },
    { label: l.incomeRequirements, value: tbc },
  ];
  const repayment = [
    { label: l.repaymentMethods, value: tbc },
    { label: l.earlyRepayment, value: tbc },
    { label: l.latePayment, value: tbc },
    { label: l.otherCharges, value: tbc },
  ];

  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.description} dark />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-14 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-bold text-brand-black">{p.keyTermsTitle}</h2>
            <p className="mt-2 text-sm text-brand-gray/60">{p.keyTermsDescription}</p>
            <div className="mt-5">
              <ConditionsTable rows={keyTerms} tbc={tbc} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-black">{p.eligibilityTitle}</h2>
            <p className="mt-2 text-sm text-brand-gray/60">{p.eligibilityDescription}</p>
            <div className="mt-5">
              <ConditionsTable rows={eligibility} tbc={tbc} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-black">{p.repaymentTitle}</h2>
            <p className="mt-2 text-sm text-brand-gray/60">{p.repaymentDescription}</p>
            <div className="mt-5">
              <ConditionsTable rows={repayment} tbc={tbc} />
            </div>
          </div>

          <LegalBlock id="terms" title={p.termsTitle} body={withBadge(p.termsBody, tbc)} />
          <LegalBlock id="privacy" title={p.privacyTitle} body={withBadge(p.privacyBody, tbc)} />
          <LegalBlock id="cookies" title={p.cookiesTitle} body={withBadge(p.cookiesBody, tbc)} />

          <div id="responsible-lending" className="scroll-mt-24 rounded-2xl border border-brand-gold/30 bg-brand-black p-7 text-white">
            <h2 className="text-xl font-bold">{p.responsibleTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">{withBadge(p.responsibleBody, tbc)}</p>
          </div>
        </div>
      </section>

      <CTASection dict={dict} locale={locale} title={p.ctaTitle} description={p.ctaDescription} />
    </>
  );
}

function LegalBlock({ id, title, body }: { id: string; title: string; body: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 rounded-2xl border border-black/8 bg-black/[0.02] p-7">
      <h2 className="text-xl font-bold text-brand-black">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-brand-gray/70">{body}</p>
    </div>
  );
}
