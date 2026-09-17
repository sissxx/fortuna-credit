import { getFortunaContext, type ContextLocale } from "@/lib/fortuna/businessContext";

// Read-only reference panel: makes the persistent Fortuna Credit business
// context visible in the admin UI, so the team can see what the generator
// already knows (vision, value props, offices, contact) instead of
// treating it as an opaque black box they have to re-explain every time.
export default function FortunaContextPanel({ locale }: { locale: ContextLocale }) {
  const ctx = getFortunaContext(locale);

  return (
    <details className="group rounded-2xl border border-brand-gold/25 bg-brand-black p-5 text-white open:pb-5" open>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold uppercase tracking-widest text-brand-gold">
        <span>Fortuna Credit — brand context</span>
        <span className="text-xs font-normal normal-case text-brand-muted transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="mt-4 space-y-4 text-xs leading-relaxed text-brand-muted">
        <p className="text-sm text-white">{ctx.vision}</p>

        <div>
          <p className="font-bold uppercase tracking-widest text-brand-gold/80">Value props</p>
          <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
            {ctx.valueProps.map((v) => (
              <li key={v.title}>— {v.title}</li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="font-bold uppercase tracking-widest text-brand-gold/80">Contact</p>
            <p>{ctx.contact.phoneDisplay}</p>
            <p>{ctx.contact.emailDisplay}</p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-brand-gold/80">Offices</p>
            {ctx.offices.map((o) => (
              <p key={o.id}>{o.city}</p>
            ))}
            <p>
              {ctx.newOffice.city}{" "}
              <span className="text-brand-gold">({ctx.newOffice.openingDateLabel})</span>
            </p>
          </div>
        </div>

        <p className="text-[11px] text-brand-muted/70">
          Sourced from the live site config/dictionaries — edit those to update this context everywhere, including here.
        </p>
      </div>
    </details>
  );
}
