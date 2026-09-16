import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import OfficeCard from "@/components/OfficeCard";
import CTASection from "@/components/sections/CTASection";
import { offices } from "@/config/site";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Find a Fortuna Credit office near you, including our new location opening October 1. Addresses, phone numbers, and hours.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  const newOfficeEntry = offices.find((o) => o.isNew);
  const existingOffices = offices.filter((o) => !o.isNew);

  return (
    <>
      <section className="bg-brand-black py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Locations"
            title="Visit a Fortuna Credit office"
            description="Speak with our team in person, get help with your application, or ask questions about your loan."
            dark
          />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {newOfficeEntry && (
            <div className="mb-12">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-brand-gold">
                Opening soon
              </h2>
              <OfficeCard office={newOfficeEntry} />
            </div>
          )}

          <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-brand-gray/50">
            Current offices
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {existingOffices.map((office) => (
              <OfficeCard key={office.id} office={office} />
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Can't find an office nearby?" description="Apply online from anywhere in minutes." />
    </>
  );
}
