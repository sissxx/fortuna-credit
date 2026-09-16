import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import NewLocationSection from "@/components/sections/NewLocationSection";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyFortuna from "@/components/sections/WhyFortuna";
import EligibilitySection from "@/components/sections/EligibilitySection";
import ResponsibleBorrowing from "@/components/sections/ResponsibleBorrowing";
import TrustSection from "@/components/sections/TrustSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Fast, Simple, Transparent Loans",
  description:
    "Fortuna Credit offers fast, simple consumer credit with clear terms and personal support. Apply online or visit an office near you.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewLocationSection />
      <HowItWorks />
      <WhyFortuna />
      <EligibilitySection />
      <ResponsibleBorrowing />
      <TrustSection />
      <CTASection />
    </>
  );
}
