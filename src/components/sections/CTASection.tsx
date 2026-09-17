import Button from "../ui/Button";
import { localePath, type Locale } from "@/i18n/config";
import { fortuna } from "@/config/site";
import type { Dictionary } from "@/i18n/getDictionary";

export default function CTASection({
  dict,
  locale,
  title,
  description,
}: {
  dict: Dictionary;
  locale: Locale;
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-black-deep py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: "radial-gradient(500px circle at 50% 0%, rgba(201,162,39,0.15), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-normal text-white sm:text-4xl text-balance">{title ?? dict.cta.defaultTitle}</h2>
        <p className="mt-4 text-brand-muted">{description ?? dict.cta.defaultDescription}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href={localePath(locale, "apply")} size="lg" variant="primary">
            {dict.common.applyNow}
          </Button>
          <Button href={fortuna.phoneHref} size="lg" variant="outline">
            {dict.common.callUs}
          </Button>
          <Button href={localePath(locale, "locations")} size="lg" variant="ghost" className="!text-brand-muted hover:!text-brand-gold-bright">
            {dict.common.findOffice}
          </Button>
        </div>
      </div>
    </section>
  );
}
