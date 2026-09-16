import Link from "next/link";
import Logo from "./Logo";
import { fortuna, navItems, newOffice } from "@/config/site";

const legalLinks = [
  { label: "Terms & Conditions", href: "/conditions#terms" },
  { label: "Privacy Policy", href: "/conditions#privacy" },
  { label: "Cookie Policy", href: "/conditions#cookies" },
  { label: "Responsible Lending", href: "/conditions#responsible-lending" },
  { label: "Complaints", href: "/contact#complaints" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-black pb-24 pt-16 text-brand-muted lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Fortuna Credit provides simple, transparent consumer credit with clear terms and
              personal support — online and in person.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Navigate</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-gold-bright">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Legal</h3>
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
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={fortuna.phoneHref} className="hover:text-brand-gold-bright">
                  {fortuna.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${fortuna.email}`} className="hover:text-brand-gold-bright">
                  {fortuna.email}
                </a>
              </li>
              <li>Mon–Fri: {fortuna.workingHours.weekdays}</li>
              <li>Sat: {fortuna.workingHours.saturday}</li>
              <li>Sun: {fortuna.workingHours.sunday}</li>
            </ul>

            <div className="mt-6 rounded-xl border border-brand-gold/30 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                New location opening {newOffice.openingDateLabel}
              </p>
              <p className="mt-2 text-sm text-white">{newOffice.city}</p>
              <p className="text-xs">{newOffice.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fortuna Credit. All rights reserved.</p>
          <p className="max-w-2xl leading-relaxed text-brand-muted/70">
            Fortuna Credit is a consumer credit provider. Loan approval is subject to assessment.
            Borrow only what you can afford to repay. Licensing and registration information:
            [TO BE CONFIRMED].
          </p>
        </div>
      </div>
    </footer>
  );
}
