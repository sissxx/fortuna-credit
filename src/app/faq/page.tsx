import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import CTASection from "@/components/sections/CTASection";
import { faqs } from "@/config/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about applying, eligibility, repayment, and Fortuna Credit offices.",
  alternates: { canonical: "/faq" },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Can't find what you're looking for? Our team is happy to help."
            dark
          />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Accordion items={faqs} />
        </div>
      </section>

      <CTASection title="Still have questions?" description="Reach out and a member of our team will help." />
    </>
  );
}
