import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function TrustSection({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const trust = dict.trust;
  const conditionsHref = localePath(locale, "conditions");
  const contactHref = localePath(locale, "contact");

  const hrefs = [
    undefined,
    undefined,
    `${conditionsHref}#privacy`,
    `${conditionsHref}#terms`,
    `${contactHref}#complaints`,
    `${conditionsHref}#responsible-lending`,
  ];

  return (
    <section className="bg-brand-black-deep py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={trust.eyebrow} title={trust.title} description={trust.description} dark />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trust.items.map((item, index) => {
            const href = hrefs[index];
            const content = (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{item.title}</p>
                <p className="mt-2 text-sm text-brand-muted">{item.value}</p>
              </>
            );
            const className =
              "block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand-gold/40";

            return href ? (
              <Link key={item.title} href={href} className={className}>
                {content}
              </Link>
            ) : (
              <div key={item.title} className={className}>
                {content}
              </div>
            );
          })}
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-brand-muted/70">{trust.disclaimer}</p>
      </div>
    </section>
  );
}
