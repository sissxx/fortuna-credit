import ApplyForm from "./ApplyForm";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "apply", title: dict.meta.apply.title, description: dict.meta.apply.description });
}

export default async function ApplyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);

  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ApplyForm dict={dict} locale={locale} />
      </div>
    </section>
  );
}
