import SectionHeading from "@/components/ui/SectionHeading";
import OfficeCard, { type OfficeView } from "@/components/OfficeCard";
import CTASection from "@/components/sections/CTASection";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { officesMeta } from "@/config/site";
import { resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "locations", title: dict.meta.locations.title, description: dict.meta.locations.description });
}

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.locationsPage;

  const existingCopy = dict.offices;
  const offices: OfficeView[] = officesMeta.map((meta) => {
    if (meta.isNew) {
      return {
        id: meta.id,
        name: dict.newOfficeData.name,
        address: dict.newOfficeData.address,
        phone: dict.newOfficeData.phone,
        hours: { mondayFriday: dict.newOfficeData.hours, saturday: dict.newOfficeData.hours, sunday: dict.newOfficeData.hours },
        isNew: true,
        openingDateISO: meta.openingDateISO,
      };
    }
    const copy = existingCopy.find((o) => o.id === meta.id) ?? existingCopy[0];
    return { ...copy, isNew: false };
  });

  const newOffice = offices.find((o) => o.isNew);
  const existingOffices = offices.filter((o) => !o.isNew);

  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.description} dark />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {newOffice && (
            <div className="mb-12">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-brand-gold">{p.openingSoon}</h2>
              <OfficeCard office={newOffice} dict={dict} locale={locale} />
            </div>
          )}

          <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-brand-gray/50">{p.currentOffices}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {existingOffices.map((office) => (
              <OfficeCard key={office.id} office={office} dict={dict} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <CTASection dict={dict} locale={locale} title={p.ctaTitle} description={p.ctaDescription} />
    </>
  );
}
