import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Countdown from "../Countdown";
import { newOffice } from "@/config/site";

export default function NewLocationSection() {
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
          <Badge variant="gold">We are growing</Badge>
          <h2 id="new-location-heading" className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            A new Fortuna Credit location opens {newOffice.openingDateLabel}
          </h2>
          <p className="mt-4 max-w-md text-brand-muted">
            Visit our new office and speak with our team in person. We&apos;re expanding to make
            simple, transparent credit even easier to reach.
          </p>

          <dl className="mt-8 space-y-4 border-l-2 border-brand-gold/40 pl-5">
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-brand-gold">City</dt>
              <dd className="mt-1 text-lg text-white">{newOffice.city}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-brand-gold">Address</dt>
              <dd className="mt-1 text-lg text-white">{newOffice.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-brand-gold">Phone</dt>
              <dd className="mt-1 text-lg text-white">{newOffice.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-brand-gold">Hours</dt>
              <dd className="mt-1 text-lg text-white">{newOffice.hours}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/locations" variant="primary">
              Discover the New Location
            </Button>
            <Button href="/locations" variant="outline">
              Get Directions
            </Button>
          </div>
        </div>

        <div className="animate-fade-up rounded-3xl border border-brand-gold/20 bg-gradient-to-b from-brand-black-deep to-brand-black p-8 shadow-2xl sm:p-10">
          <Countdown targetDate={newOffice.openingDate} city={newOffice.city} address={newOffice.address} />
        </div>
      </div>
    </section>
  );
}
