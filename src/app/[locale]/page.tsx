import Hero from "@/components/sections/Hero";
import NewLocationSection from "@/components/sections/NewLocationSection";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyFortuna from "@/components/sections/WhyFortuna";
import EligibilitySection from "@/components/sections/EligibilitySection";
import CTASection from "@/components/sections/CTASection";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "home", title: dict.meta.home.title, description: dict.meta.home.description });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero dict={dict} locale={locale} />
      <NewLocationSection dict={dict} locale={locale} />
      <HowItWorks dict={dict} />
      <WhyFortuna dict={dict} />
      <EligibilitySection dict={dict} locale={locale} />
      <CTASection dict={dict} locale={locale} />
    </>
  );
}
