import type { Metadata } from "next";
import StatusChecker from "./StatusChecker";

export const metadata: Metadata = {
  title: "Check Your Application",
  description: "Check the status of your Fortuna Credit loan application.",
  alternates: { canonical: "/application-status" },
};

export default function ApplicationStatusPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <StatusChecker />
      </div>
    </section>
  );
}
