import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import CTASection from "@/components/sections/CTASection";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { formatDate, t } from "@/i18n/format";
import { newOfficeMeta } from "@/config/site";
import { resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "faq", title: dict.meta.faq.title, description: dict.meta.faq.description });
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.faqPage;

  const date = formatDate(newOfficeMeta.openingDateISO, locale);
  const faqs = dict.faqs.map((faq) => ({
    ...faq,
    answer: t(faq.answer, { date, city: dict.newOfficeData.city }),
  }));

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.description} dark />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Accordion items={faqs} />
        </div>
      </section>

      <CTASection dict={dict} locale={locale} title={p.ctaTitle} description={p.ctaDescription} />
    </>
  );
}
