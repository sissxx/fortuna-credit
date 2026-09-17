import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Countdown from "../Countdown";
import { localePath, type Locale } from "@/i18n/config";
import { formatDate, t } from "@/i18n/format";
import { newOfficeMeta } from "@/config/site";
import type { Dictionary } from "@/i18n/getDictionary";

export default function NewLocationSection({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const date = formatDate(newOfficeMeta.openingDateISO, locale);

  return (
    <section aria-labelledby="new-location-heading" className="relative overflow-hidden bg-brand-black">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 15% 20%, rgba(201,162,39,0.15), transparent 60%), radial-gradient(600px circle at 85% 80%, rgba(229,196,90,0.12), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="animate-fade-up">
          <Badge variant="gold">{dict.newLocation.badge}</Badge>
          <h2 id="new-location-heading" className="font-heading mt-4 text-3xl font-normal text-white sm:text-4xl text-balance">
            {t(dict.newLocation.title, { date })}
          </h2>
          <p className="mt-4 max-w-md text-brand-muted">{dict.newLocation.description}</p>

          <dl className="mt-8 space-y-4 border-l-2 border-brand-gold/40 pl-5">
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-brand-gold">{dict.newLocation.cityLabel}</dt>
              <dd className="mt-1 text-lg text-white">{dict.newOfficeData.city}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-brand-gold">{dict.newLocation.addressLabel}</dt>
              <dd className="mt-1 text-lg text-white">{dict.newOfficeData.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-brand-gold">{dict.newLocation.phoneLabel}</dt>
              <dd className="mt-1 text-lg text-white">{dict.newOfficeData.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-brand-gold">{dict.newLocation.hoursLabel}</dt>
              <dd className="mt-1 text-lg text-white">{dict.newOfficeData.hours}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={localePath(locale, "locations")} variant="primary">
              {dict.newLocation.cta1}
            </Button>
            <Button href={localePath(locale, "locations")} variant="outline">
              {dict.newLocation.cta2}
            </Button>
          </div>
        </div>

        <div className="animate-fade-up rounded-3xl border border-brand-gold/20 bg-gradient-to-b from-brand-black-deep to-brand-black p-8 shadow-2xl sm:p-10">
          <Countdown targetDate={newOfficeMeta.openingDateISO} dict={dict} locale={locale} />
        </div>
      </div>
    </section>
  );
}
