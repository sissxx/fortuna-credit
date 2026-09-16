import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import CallbackForm from "@/components/CallbackForm";
import ContactForm from "@/components/ContactForm";
import { fortuna } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Fortuna Credit by phone, email, or request a callback. View our working hours and office locations.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Contact"
            title="We're here to help"
            description="Reach us by phone, email, or in person — whichever is easiest for you."
            dark
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Call us</p>
              <a href={fortuna.phoneHref} className="mt-2 block text-xl font-bold text-white hover:text-brand-gold-bright">
                {fortuna.phone}
              </a>
              <Button href={fortuna.phoneHref} variant="outline" size="sm" className="mt-4">
                Call Now
              </Button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Email</p>
              <a href={`mailto:${fortuna.email}`} className="mt-2 block text-xl font-bold text-white hover:text-brand-gold-bright">
                {fortuna.email}
              </a>
              <Button href="#contact-form" variant="outline" size="sm" className="mt-4">
                Send Message
              </Button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Working hours</p>
              <ul className="mt-2 space-y-1 text-sm text-brand-muted">
                <li>Mon–Fri: {fortuna.workingHours.weekdays}</li>
                <li>Sat: {fortuna.workingHours.saturday}</li>
                <li>Sun: {fortuna.workingHours.sunday}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <CallbackForm />
          <div id="contact-form">
            <ContactForm />
          </div>
        </div>
      </section>

      <section id="complaints" className="scroll-mt-24 bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-8">
            <h2 className="text-xl font-bold text-brand-black">Complaints procedure</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-gray/70">
              If you&apos;re not satisfied with our service, please contact us using the details above
              and our team will work to resolve your concern. Our formal complaints procedure is{" "}
              <span className="font-semibold text-brand-gold">[TO BE CONFIRMED]</span>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
