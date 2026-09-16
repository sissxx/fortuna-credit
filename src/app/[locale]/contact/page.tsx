import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import CallbackForm from "@/components/CallbackForm";
import ContactForm from "@/components/ContactForm";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { withBadge } from "@/i18n/renderTemplate";
import { fortuna } from "@/config/site";
import { resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "contact", title: dict.meta.contact.title, description: dict.meta.contact.description });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.contactPage;

  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.description} dark />

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{p.callUs}</p>
              <a href={fortuna.phoneHref} className="mt-2 block text-xl font-bold text-white hover:text-brand-gold-bright">
                {dict.common.phonePlaceholder}
              </a>
              <Button href={fortuna.phoneHref} variant="outline" size="sm" className="mt-4">
                {p.callNow}
              </Button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{p.email}</p>
              <a href={fortuna.emailHref} className="mt-2 block text-xl font-bold text-white hover:text-brand-gold-bright">
                {dict.common.emailPlaceholder}
              </a>
              <Button href="#contact-form" variant="outline" size="sm" className="mt-4">
                {p.sendMessage}
              </Button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{p.workingHours}</p>
              <ul className="mt-2 space-y-1 text-sm text-brand-muted">
                <li>{dict.officeCard.mondayFriday}: {dict.common.tbc}</li>
                <li>{dict.officeCard.saturday}: {dict.common.tbc}</li>
                <li>{dict.officeCard.sunday}: {dict.common.tbc}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <CallbackForm dict={dict} />
          <div id="contact-form">
            <ContactForm dict={dict} />
          </div>
        </div>
      </section>

      <section id="complaints" className="scroll-mt-24 bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-8">
            <h2 className="text-xl font-bold text-brand-black">{p.complaintsTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray/70">{withBadge(p.complaintsBody, dict.common.tbc)}</p>
          </div>
        </div>
      </section>
    </>
  );
}
