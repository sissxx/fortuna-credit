import SectionHeading from "@/components/ui/SectionHeading";
import HowItWorks from "@/components/sections/HowItWorks";
import EligibilitySection from "@/components/sections/EligibilitySection";
import CTASection from "@/components/sections/CTASection";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "howItWorks", title: dict.meta.howItWorks.title, description: dict.meta.howItWorks.description });
}

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.howItWorksPage;

  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.description} dark align="center" className="mx-auto" />
        </div>
      </section>

      <HowItWorks dict={dict} />

      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-8">
            <h3 className="text-lg font-bold text-brand-black">{p.readyTitle}</h3>
            <p className="mt-3 text-sm text-brand-gray/70">{p.readyDescription}</p>
            <ul className="mt-4 grid gap-2 text-sm text-brand-gray/75 sm:grid-cols-2">
              {p.readyChecklist.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-gold">—</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <EligibilitySection dict={dict} locale={locale} />
      <CTASection dict={dict} locale={locale} />
    </>
  );
}
