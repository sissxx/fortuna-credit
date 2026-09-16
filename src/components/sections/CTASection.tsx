import Button from "../ui/Button";
import { fortuna } from "@/config/site";

export default function CTASection({
  title = "Ready to get started?",
  description = "Apply online in minutes, or speak with our team at a location near you.",
}: {
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
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-brand-muted">{description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/apply" size="lg" variant="primary">
            Apply Now
          </Button>
          <Button href={fortuna.phoneHref} size="lg" variant="outline">
            Call Us
          </Button>
          <Button href="/locations" size="lg" variant="ghost" className="!text-brand-muted hover:!text-brand-gold-bright">
            Find an Office
          </Button>
        </div>
      </div>
    </section>
  );
}
