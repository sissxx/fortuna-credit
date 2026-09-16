"use client";

import { useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { fortuna } from "@/config/site";

type StatusKey =
  | "received"
  | "under-review"
  | "info-required"
  | "approved"
  | "completed"
  | "not-found";

const STATUS_CONTENT: Record<StatusKey, { label: string; description: string; variant: "gold" | "success" | "warning" | "dark" }> = {
  received: {
    label: "Application received",
    description: "We've received your application and it's in our queue for review.",
    variant: "gold",
  },
  "under-review": {
    label: "Under review",
    description: "Our team is currently reviewing your application and information provided.",
    variant: "gold",
  },
  "info-required": {
    label: "Additional information required",
    description: "We need a bit more information from you before we can continue. Please check your email or phone for details.",
    variant: "warning",
  },
  approved: {
    label: "Approved",
    description: "Your application has been approved. Review your offer for the confirmed terms.",
    variant: "success",
  },
  completed: {
    label: "Completed",
    description: "This application has been completed and funds were provided according to the agreed terms.",
    variant: "success",
  },
  "not-found": {
    label: "Unable to find application",
    description: "We couldn't find an application matching those details. Double-check your reference and try again, or contact us.",
    variant: "dark",
  },
};

const DEMO_STATES: StatusKey[] = ["received", "under-review", "info-required", "approved", "completed"];

function hashToStatus(input: string): StatusKey {
  if (!input.trim()) return "not-found";
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) % 997;
  return DEMO_STATES[hash % DEMO_STATES.length];
}

export default function StatusChecker() {
  const [applicationId, setApplicationId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<StatusKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!applicationId.trim() && !phone.trim()) {
      setError("Enter your Application ID or the phone number used on your application.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setResult(hashToStatus(applicationId || phone));
      setLoading(false);
    }, 800);
  }

  const status = result ? STATUS_CONTENT[result] : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black sm:text-3xl">Check your application</h1>
      <p className="mt-2 text-sm text-brand-gray/60">
        Enter your Application ID and/or the phone number used when you applied.
      </p>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
        Frontend placeholder — not connected to a live backend
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4 rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
        <Input
          label="Application ID"
          optional
          placeholder="e.g. FC-482913"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
        />
        <Input label="Phone number" optional type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Checking…" : "Check Status"}
        </Button>
      </form>

      {status && (
        <div className="mt-6 animate-fade-up rounded-2xl border border-black/8 bg-black/[0.02] p-6">
          <Badge variant={status.variant}>{status.label}</Badge>
          <p className="mt-3 text-sm text-brand-gray/75">{status.description}</p>
          {result === "not-found" && (
            <p className="mt-3 text-sm text-brand-gray/60">
              Need help? Call <a href={fortuna.phoneHref} className="text-brand-gold underline">{fortuna.phone}</a> or
              email <a href={`mailto:${fortuna.email}`} className="text-brand-gold underline">{fortuna.email}</a>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
