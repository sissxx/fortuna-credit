import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import HowItWorks from "@/components/sections/HowItWorks";
import EligibilitySection from "@/components/sections/EligibilitySection";
import CTASection from "@/components/sections/CTASection";
import { loanConditions } from "@/config/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See exactly how a Fortuna Credit application works — from applying online to receiving your funds.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="A guided process, start to finish"
            description="We keep every step clear so you always know what happens next."
            dark
            align="center"
            className="mx-auto"
          />
        </div>
      </section>

      <HowItWorks />

      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-8">
            <h3 className="text-lg font-bold text-brand-black">What to have ready</h3>
            <p className="mt-3 text-sm text-brand-gray/70">
              Having a few details on hand makes your application faster to complete:
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-brand-gray/75 sm:grid-cols-2">
              {loanConditions.requiredDocuments.map((doc, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-brand-gold">—</span> {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <EligibilitySection />
      <CTASection />
    </>
  );
}
