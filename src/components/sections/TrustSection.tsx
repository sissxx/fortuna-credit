import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";
import { fortuna } from "@/config/site";

const trustItems = [
  { title: "Company information", value: fortuna.legalName, href: undefined },
  { title: "Regulatory / licensing", value: "[TO BE CONFIRMED]", href: undefined },
  { title: "Privacy Policy", value: "How we protect your data", href: "/conditions#privacy" },
  { title: "Terms & Conditions", value: "Full loan agreement terms", href: "/conditions#terms" },
  { title: "Complaints procedure", value: "How to raise a concern", href: "/contact#complaints" },
  { title: "Responsible lending", value: "Our approach to responsible credit", href: "/conditions#responsible-lending" },
];

export default function TrustSection() {
  return (
    <section className="bg-brand-black-deep py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trust & transparency"
          title="Information you can verify"
          description="Financial decisions deserve clarity. Here's where to find our company, legal, and regulatory information."
          dark
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trustItems.map((item) => {
            const content = (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{item.title}</p>
                <p className="mt-2 text-sm text-brand-muted">{item.value}</p>
              </>
            );
            const className =
              "block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand-gold/40";

            return item.href ? (
              <Link key={item.title} href={item.href} className={className}>
                {content}
              </Link>
            ) : (
              <div key={item.title} className={className}>
                {content}
              </div>
            );
          })}
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-brand-muted/70">
          Fortuna Credit does not claim any license, registration, award, or regulatory affiliation
          beyond what is confirmed above. Additional legal and regulatory details will be published
          here once available.
        </p>
      </div>
    </section>
  );
}
