import type { Metadata } from "next";
import ApplyForm from "./ApplyForm";

export const metadata: Metadata = {
  title: "Apply Now",
  description: "Apply for a Fortuna Credit loan online in a few simple steps.",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage() {
  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ApplyForm />
      </div>
    </section>
  );
}
