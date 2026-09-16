"use client";

import { useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { renderTemplate } from "@/i18n/renderTemplate";
import { fortuna } from "@/config/site";
import type { Dictionary } from "@/i18n/getDictionary";

type StatusKey = "received" | "underReview" | "infoRequired" | "approved" | "completed" | "notFound";

const DEMO_STATES: StatusKey[] = ["received", "underReview", "infoRequired", "approved", "completed"];
const BADGE_VARIANT: Record<StatusKey, "gold" | "success" | "warning" | "dark"> = {
  received: "gold",
  underReview: "gold",
  infoRequired: "warning",
  approved: "success",
  completed: "success",
  notFound: "dark",
};

function hashToStatus(input: string): StatusKey {
  if (!input.trim()) return "notFound";
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) % 997;
  return DEMO_STATES[hash % DEMO_STATES.length];
}

export default function StatusChecker({ dict }: { dict: Dictionary }) {
  const [applicationId, setApplicationId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<StatusKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const p = dict.applicationStatusPage;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!applicationId.trim() && !phone.trim()) {
      setError(p.errorMissing);
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

  const status = result ? p.statuses[result] : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black sm:text-3xl">{p.title}</h1>
      <p className="mt-2 text-sm text-brand-gray/60">{p.description}</p>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
        {dict.common.frontendPlaceholderNotice}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4 rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
        <Input
          label={p.applicationId}
          optional
          optionalLabel={dict.common.optional}
          placeholder={p.applicationIdPlaceholder}
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
        />
        <Input label={p.phone} optional optionalLabel={dict.common.optional} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? dict.common.checking : p.submit}
        </Button>
      </form>

      {status && (
        <div className="mt-6 animate-fade-up rounded-2xl border border-black/8 bg-black/[0.02] p-6">
          <Badge variant={BADGE_VARIANT[result as StatusKey]}>{status.label}</Badge>
          <p className="mt-3 text-sm text-brand-gray/75">{status.description}</p>
          {result === "notFound" && (
            <p className="mt-3 text-sm text-brand-gray/60">
              {renderTemplate(p.helpLine, {
                phone: (
                  <a href={fortuna.phoneHref} className="text-brand-gold underline">
                    {dict.common.phonePlaceholder}
                  </a>
                ),
                email: (
                  <a href={fortuna.emailHref} className="text-brand-gold underline">
                    {dict.common.emailPlaceholder}
                  </a>
                ),
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
