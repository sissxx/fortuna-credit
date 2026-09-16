import Link from "next/link";
import Logo from "./Logo";
import { localePath, type Locale, type RouteKey } from "@/i18n/config";
import { formatDate, t } from "@/i18n/format";
import { fortuna, newOfficeMeta } from "@/config/site";
import type { Dictionary } from "@/i18n/getDictionary";

const NAV_ROUTES: RouteKey[] = ["home", "loans", "howItWorks", "conditions", "locations", "faq", "contact"];
const NAV_LABEL_KEY: Record<RouteKey, keyof Dictionary["nav"]> = {
  home: "home",
  loans: "loans",
  howItWorks: "howItWorks",
  conditions: "conditions",
  locations: "locations",
  faq: "faq",
  contact: "contact",
  apply: "apply",
  applicationStatus: "apply",
};

export default function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const conditionsHref = localePath(locale, "conditions");
  const contactHref = localePath(locale, "contact");

  const legalLinks = [
    { label: dict.footer.legalLinks.terms, href: `${conditionsHref}#terms` },
    { label: dict.footer.legalLinks.privacy, href: `${conditionsHref}#privacy` },
    { label: dict.footer.legalLinks.cookies, href: `${conditionsHref}#cookies` },
    { label: dict.footer.legalLinks.responsibleLending, href: `${conditionsHref}#responsible-lending` },
    { label: dict.footer.legalLinks.complaints, href: `${contactHref}#complaints` },
  ];

  return (
    <footer className="border-t border-white/10 bg-brand-black pb-24 pt-16 text-brand-muted lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo dark locale={locale} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{dict.footer.description}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">{dict.footer.navigate}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_ROUTES.map((route) => (
                <li key={route}>
                  <Link href={localePath(locale, route)} className="hover:text-brand-gold-bright">
                    {dict.nav[NAV_LABEL_KEY[route]]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">{dict.footer.legal}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-brand-gold-bright">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">{dict.footer.contact}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={fortuna.phoneHref} className="hover:text-brand-gold-bright">
                  {dict.common.phonePlaceholder}
                </a>
              </li>
              <li>
                <a href={fortuna.emailHref} className="hover:text-brand-gold-bright">
                  {dict.common.emailPlaceholder}
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-brand-gold/30 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                {t(dict.footer.newLocationTitle, { date: formatDate(newOfficeMeta.openingDateISO, locale) })}
              </p>
              <p className="mt-2 text-sm text-white">{dict.newOfficeData.city}</p>
              <p className="text-xs">{dict.newOfficeData.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{t(dict.footer.copyright, { year: new Date().getFullYear() })}</p>
          <p className="max-w-2xl leading-relaxed text-brand-muted/70">
            {t(dict.footer.legalDisclaimer, { badge: dict.common.tbc })}
          </p>
        </div>
      </div>
    </footer>
  );
}
