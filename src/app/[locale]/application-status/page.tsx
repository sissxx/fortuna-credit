import StatusChecker from "./StatusChecker";
import { getDictionary } from "@/i18n/getDictionary";
import { buildMetadata } from "@/i18n/metadata";
import { resolveLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    route: "applicationStatus",
    title: dict.meta.applicationStatus.title,
    description: dict.meta.applicationStatus.description,
  });
}

export default async function ApplicationStatusPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <StatusChecker dict={dict} />
      </div>
    </section>
  );
}
