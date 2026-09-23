"use client";

import { useEffect, useState, type ReactNode } from "react";
import FormStepper from "@/components/ui/FormStepper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { loanConfig, fortuna, officesMeta } from "@/config/site";
import { localePath, type Locale } from "@/i18n/config";
import { formatCurrency, t } from "@/i18n/format";
import { renderTemplate } from "@/i18n/renderTemplate";
import type { Dictionary } from "@/i18n/getDictionary";

const STORAGE_KEY = "fortuna-application-draft";

type FormData = {
  amount: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  city: string;
  address: string;
  preferredOffice: string;
  preferredContactMethod: string;
  employmentStatus: string;
  monthlyIncome: string;
  existingObligations: string;
  privacyConsent: boolean;
  termsAccepted: boolean;
};

const initialData: FormData = {
  amount: loanConfig.defaultAmount,
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dob: "",
  city: "",
  address: "",
  preferredOffice: "",
  preferredContactMethod: "",
  employmentStatus: "",
  monthlyIncome: "",
  existingObligations: "",
  privacyConsent: false,
  termsAccepted: false,
};

type Errors = Partial<Record<keyof FormData, string>>;

export default function ApplyForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [applicationId, setApplicationId] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const af = dict.applyForm;
  const v = af.validation;
  const STEPS = af.steps;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const selection = window.localStorage.getItem("fortuna-loan-selection");
      let merged = initialData;
      if (saved) merged = { ...merged, ...JSON.parse(saved) };
      if (selection) {
        const { amount } = JSON.parse(selection);
        merged = { ...merged, amount };
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(merged);
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateStep(current: number): boolean {
    const next: Errors = {};

    if (current === 1) {
      if (!data.amount || data.amount < loanConfig.minAmount || data.amount > loanConfig.maxAmount) {
        next.amount = v.amount;
      }
      if (!data.firstName.trim()) next.firstName = v.firstName;
      if (!data.lastName.trim()) next.lastName = v.lastName;
      if (!data.phone.trim()) next.phone = v.phone;
      else if (!/^[0-9+()\-\s]{7,}$/.test(data.phone)) next.phone = v.phoneInvalid;
      if (!data.email.trim()) next.email = v.email;
      else if (!/^\S+@\S+\.\S+$/.test(data.email)) next.email = v.emailInvalid;
      if (!data.dob) next.dob = v.dob;
    }

    if (current === 2) {
      if (!data.city.trim()) next.city = v.city;
      if (!data.address.trim()) next.address = v.address;
      if (!data.preferredContactMethod) next.preferredContactMethod = v.contactMethod;
    }

    if (current === 3) {
      if (!data.employmentStatus) next.employmentStatus = v.employmentStatus;
      if (!data.monthlyIncome.trim()) next.monthlyIncome = v.monthlyIncome;
      else if (!/^\d+$/.test(data.monthlyIncome)) next.monthlyIncome = v.monthlyIncomeInvalid;
    }

    if (current === 4) {
      if (!data.privacyConsent) next.privacyConsent = v.privacyConsent;
      if (!data.termsAccepted) next.termsAccepted = v.termsAccepted;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (!validateStep(4)) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit-failed");
      const { applicationId: id } = (await res.json()) as { applicationId: string };
      setApplicationId(id);
      setStatus("success");
      window.localStorage.removeItem(STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    const s = af.success;
    return (
      <div className="animate-fade-up rounded-3xl border border-brand-gold/30 bg-brand-black-deep p-8 text-center text-white sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold text-brand-black">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 12.5L9.5 18L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="font-heading mt-6 text-2xl font-normal sm:text-3xl">{s.title}</h1>
        <p className="mt-3 text-brand-muted">{t(s.body, { name: data.firstName || "" })}</p>
        <p className="mt-2 text-sm text-brand-gold-bright">{t(s.reference, { id: applicationId })}</p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold">{s.whatNext}</h2>
          <ol className="mt-3 space-y-2 text-sm text-brand-muted">
            <li>1. {s.step1}</li>
            <li>2. {s.step2}</li>
            <li>3. {s.step3}</li>
          </ol>
          <p className="mt-4 text-xs text-brand-muted/70">{s.disclaimer}</p>
        </div>

        <div className="mx-auto mt-6 grid max-w-md gap-2 text-sm text-brand-muted">
          <p>
            {renderTemplate(s.contactLine, {
              phone: (
                <a href={fortuna.phoneHref} className="text-brand-gold-bright">
                  {dict.common.phonePlaceholder}
                </a>
              ),
              email: (
                <a href={fortuna.emailHref} className="text-brand-gold-bright">
                  {dict.common.emailPlaceholder}
                </a>
              ),
            })}
          </p>
          <p>{s.officeLine}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={localePath(locale, "applicationStatus")} variant="primary">
            {s.checkStatus}
          </Button>
          <Button href={localePath(locale, "locations")} variant="outline">
            {s.findOffice}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-brand-black sm:text-3xl">{af.title}</h1>
      <p className="mt-2 text-sm text-brand-gray/60">{af.subtitle}</p>

      <div className="mt-8">
        <FormStepper steps={STEPS} currentStep={step} />
      </div>

      <div className="mt-8 rounded-3xl border border-black/8 bg-white p-6 shadow-sm sm:p-8">
        {step === 1 && <StepPersonal data={data} update={update} errors={errors} dict={dict} locale={locale} />}
        {step === 2 && <StepContact data={data} update={update} errors={errors} dict={dict} />}
        {step === 3 && <StepFinancial data={data} update={update} errors={errors} dict={dict} />}
        {step === 4 && <StepReview data={data} update={update} errors={errors} dict={dict} locale={locale} />}

        {status === "error" && (
          <p className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{dict.applyForm.submitError}</p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/8 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
            className={step === 1 ? "invisible" : ""}
          >
            ← {dict.common.back}
          </Button>

          {step < STEPS.length ? (
            <Button type="button" onClick={goNext}>
              {dict.common.continueLabel}
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={status === "submitting"}>
              {status === "submitting" ? dict.common.submitting : dict.common.submit}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

type StepProps = {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Errors;
  dict: Dictionary;
  locale: Locale;
};

function StepPersonal({ data, update, errors, dict, locale }: StepProps) {
  const p = dict.applyForm.personal;
  const l = dict.applyForm.loan;
  const money = (value: number) => formatCurrency(value, locale, loanConfig.currency);

  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-bold text-brand-black">{p.legend}</legend>

      <Input
        id="apply-amount"
        label={l.amount}
        type="number"
        required
        inputMode="numeric"
        min={loanConfig.minAmount}
        max={loanConfig.maxAmount}
        step={loanConfig.amountStep}
        value={data.amount || ""}
        onChange={(e) => update("amount", Number(e.target.value))}
        hint={money(data.amount || 0)}
        error={errors.amount}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label={p.firstName} required autoComplete="given-name" value={data.firstName} onChange={(e) => update("firstName", e.target.value)} error={errors.firstName} />
        <Input label={p.lastName} required autoComplete="family-name" value={data.lastName} onChange={(e) => update("lastName", e.target.value)} error={errors.lastName} />
        <Input label={p.phone} type="tel" required autoComplete="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
        <Input label={p.email} type="email" required autoComplete="email" value={data.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
        <Input label={p.dob} type="date" required autoComplete="bday" value={data.dob} onChange={(e) => update("dob", e.target.value)} error={errors.dob} />
      </div>
    </fieldset>
  );
}

function StepContact({ data, update, errors, dict }: Omit<StepProps, "locale">) {
  const c = dict.applyForm.contact;
  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-bold text-brand-black">{c.legend}</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label={c.city} required autoComplete="address-level2" value={data.city} onChange={(e) => update("city", e.target.value)} error={errors.city} />
        <Input label={c.address} required autoComplete="street-address" value={data.address} onChange={(e) => update("address", e.target.value)} error={errors.address} />
        <Select label={c.preferredOffice} optional optionalLabel={dict.common.optional} value={data.preferredOffice} onChange={(e) => update("preferredOffice", e.target.value)}>
          <option value="">{c.preferredOfficeNone}</option>
          {officesMeta.map((office) => {
            const name = office.isNew ? dict.newOfficeData.name : dict.offices.find((o) => o.id === office.id)?.name ?? office.id;
            return (
              <option key={office.id} value={name}>
                {name}
              </option>
            );
          })}
        </Select>
        <Select
          label={c.preferredContactMethod}
          required
          value={data.preferredContactMethod}
          onChange={(e) => update("preferredContactMethod", e.target.value)}
          error={errors.preferredContactMethod}
        >
          <option value="">{c.methodPlaceholder}</option>
          <option value="phone">{c.methodPhone}</option>
          <option value="email">{c.methodEmail}</option>
          <option value="sms">{c.methodSms}</option>
        </Select>
      </div>
    </fieldset>
  );
}

function StepFinancial({ data, update, errors, dict }: Omit<StepProps, "locale">) {
  const f = dict.applyForm.financial;
  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-bold text-brand-black">{f.legend}</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label={f.employmentStatus}
          required
          value={data.employmentStatus}
          onChange={(e) => update("employmentStatus", e.target.value)}
          error={errors.employmentStatus}
        >
          <option value="">{f.statusPlaceholder}</option>
          <option value="employed">{f.statusEmployed}</option>
          <option value="self-employed">{f.statusSelfEmployed}</option>
          <option value="unemployed">{f.statusUnemployed}</option>
          <option value="retired">{f.statusRetired}</option>
          <option value="student">{f.statusStudent}</option>
        </Select>
        <Input
          label={f.monthlyIncome}
          required
          inputMode="numeric"
          value={data.monthlyIncome}
          onChange={(e) => update("monthlyIncome", e.target.value)}
          error={errors.monthlyIncome}
        />
        <div className="sm:col-span-2">
          <Input
            label={f.existingObligations}
            optional
            optionalLabel={dict.common.optional}
            hint={f.existingObligationsHint}
            value={data.existingObligations}
            onChange={(e) => update("existingObligations", e.target.value)}
          />
        </div>
      </div>
    </fieldset>
  );
}

function StepReview({ data, update, errors, dict, locale }: StepProps) {
  const r = dict.applyForm.review;
  const money = (value: number) => formatCurrency(value, locale, loanConfig.currency);
  const conditionsHref = localePath(locale, "conditions");

  const methodLabels: Record<string, string> = {
    phone: dict.applyForm.contact.methodPhone,
    email: dict.applyForm.contact.methodEmail,
    sms: dict.applyForm.contact.methodSms,
  };

  const statusLabels: Record<string, string> = {
    employed: dict.applyForm.financial.statusEmployed,
    "self-employed": dict.applyForm.financial.statusSelfEmployed,
    unemployed: dict.applyForm.financial.statusUnemployed,
    retired: dict.applyForm.financial.statusRetired,
    student: dict.applyForm.financial.statusStudent,
  };

  return (
    <fieldset className="space-y-6">
      <legend className="text-lg font-bold text-brand-black">{r.legend}</legend>

      <ReviewGroup title={r.groupLoan}>
        <ReviewRow label={r.amount} value={money(data.amount)} />
      </ReviewGroup>

      <ReviewGroup title={r.groupPersonal}>
        <ReviewRow label={r.name} value={`${data.firstName} ${data.lastName}`.trim() || "—"} />
        <ReviewRow label={r.phone} value={data.phone || "—"} />
        <ReviewRow label={r.email} value={data.email || "—"} />
        <ReviewRow label={r.dob} value={data.dob || "—"} />
      </ReviewGroup>

      <ReviewGroup title={r.groupContact}>
        <ReviewRow label={r.city} value={data.city || "—"} />
        <ReviewRow label={r.address} value={data.address || "—"} />
        <ReviewRow label={r.preferredOffice} value={data.preferredOffice || dict.applyForm.contact.preferredOfficeNone} />
        <ReviewRow label={r.contactMethod} value={methodLabels[data.preferredContactMethod] ?? "—"} />
      </ReviewGroup>

      <ReviewGroup title={r.groupFinancial}>
        <ReviewRow label={r.employmentStatus} value={statusLabels[data.employmentStatus] ?? "—"} />
        <ReviewRow label={r.monthlyIncome} value={data.monthlyIncome ? money(Number(data.monthlyIncome)) : "—"} />
      </ReviewGroup>

      <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-4 text-xs leading-relaxed text-brand-gray/70">
        {r.disclosure}
      </div>

      <div className="space-y-3">
        <Checkbox
          label={renderConsentLabel(r.privacyLabel, r.privacyLinkText, `${conditionsHref}#privacy`)}
          required
          checked={data.privacyConsent}
          onChange={(e) => update("privacyConsent", e.target.checked)}
          error={errors.privacyConsent}
        />
        <Checkbox
          label={renderConsentLabel(r.termsLabel, r.termsLinkText, `${conditionsHref}#terms`)}
          required
          checked={data.termsAccepted}
          onChange={(e) => update("termsAccepted", e.target.checked)}
          error={errors.termsAccepted}
        />
      </div>
    </fieldset>
  );
}

function renderConsentLabel(template: string, linkText: string, href: string): ReactNode {
  return renderTemplate(template, {
    link: (
      <a href={href} className="text-brand-gold underline">
        {linkText}
      </a>
    ),
  });
}

function ReviewGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-black/8 bg-black/[0.02] p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gold">{title}</h3>
      <dl className="mt-3 space-y-1.5">{children}</dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-brand-gray/60">{label}</dt>
      <dd className="text-right font-medium text-brand-black">{value}</dd>
    </div>
  );
}
