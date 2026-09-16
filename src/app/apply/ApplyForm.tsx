"use client";

import { useEffect, useState, type ReactNode } from "react";
import FormStepper from "@/components/ui/FormStepper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { loanConfig, fortuna, offices } from "@/config/site";
import { formatCurrency } from "@/lib/utils";
import { estimateLoan } from "@/components/LoanCalculator";

const STEPS = ["Loan", "Personal", "Contact", "Financial", "Review"];
const STORAGE_KEY = "fortuna-application-draft";

type FormData = {
  amount: number;
  term: number;
  purpose: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  idNumber: string;
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
  term: loanConfig.defaultTerm,
  purpose: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dob: "",
  idNumber: "",
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

export default function ApplyForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [applicationId, setApplicationId] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const selection = window.localStorage.getItem("fortuna-loan-selection");
      let merged = initialData;
      if (saved) merged = { ...merged, ...JSON.parse(saved) };
      if (selection) {
        const { amount, term } = JSON.parse(selection);
        merged = { ...merged, amount, term };
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
      if (!data.purpose) next.purpose = "Please select a loan purpose.";
    }

    if (current === 2) {
      if (!data.firstName.trim()) next.firstName = "First name is required.";
      if (!data.lastName.trim()) next.lastName = "Last name is required.";
      if (!data.phone.trim()) next.phone = "Phone number is required.";
      else if (!/^[0-9+()\-\s]{7,}$/.test(data.phone)) next.phone = "Enter a valid phone number.";
      if (!data.email.trim()) next.email = "Email is required.";
      else if (!/^\S+@\S+\.\S+$/.test(data.email)) next.email = "Enter a valid email address.";
      if (!data.dob) next.dob = "Date of birth is required.";
      if (!data.idNumber.trim()) next.idNumber = "Identification information is required.";
    }

    if (current === 3) {
      if (!data.city.trim()) next.city = "City is required.";
      if (!data.address.trim()) next.address = "Address is required.";
      if (!data.preferredContactMethod) next.preferredContactMethod = "Please select a preferred contact method.";
    }

    if (current === 4) {
      if (!data.employmentStatus) next.employmentStatus = "Please select your employment status.";
      if (!data.monthlyIncome.trim()) next.monthlyIncome = "Monthly income is required.";
      else if (!/^\d+$/.test(data.monthlyIncome)) next.monthlyIncome = "Enter a whole number amount.";
    }

    if (current === 5) {
      if (!data.privacyConsent) next.privacyConsent = "You must accept the privacy notice to continue.";
      if (!data.termsAccepted) next.termsAccepted = "You must accept the terms to submit your application.";
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

  function handleSubmit() {
    if (!validateStep(5)) return;
    setStatus("submitting");

    setTimeout(() => {
      const id = `FC-${Math.floor(100000 + Math.random() * 900000)}`;
      setApplicationId(id);
      setStatus("success");
      window.localStorage.removeItem(STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  }

  if (status === "success") {
    return (
      <div className="animate-fade-up rounded-3xl border border-brand-gold/30 bg-brand-black-deep p-8 text-center text-white sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold text-brand-black">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 12.5L9.5 18L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Application received</h1>
        <p className="mt-3 text-brand-muted">
          Thank you, {data.firstName || "there"}. Your application has been successfully submitted.
        </p>
        <p className="mt-2 text-sm text-brand-gold-bright">Reference: {applicationId}</p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold">What happens next</h2>
          <ol className="mt-3 space-y-2 text-sm text-brand-muted">
            <li>1. Our team reviews your application and information provided.</li>
            <li>2. We may contact you if additional information is required.</li>
            <li>3. You&apos;ll be informed of the outcome and, if approved, the terms that apply.</li>
          </ol>
          <p className="mt-4 text-xs text-brand-muted/70">
            Submitting an application does not guarantee approval. All applications are subject to
            assessment.
          </p>
        </div>

        <div className="mx-auto mt-6 grid max-w-md gap-2 text-sm text-brand-muted">
          <p>
            Questions? Call <a href={fortuna.phoneHref} className="text-brand-gold-bright">{fortuna.phone}</a> or
            email <a href={`mailto:${fortuna.email}`} className="text-brand-gold-bright">{fortuna.email}</a>.
          </p>
          <p>You can also visit any Fortuna Credit office — see the Locations page for details.</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/application-status" variant="primary">
            Check Application Status
          </Button>
          <Button href="/locations" variant="outline">
            Find an Office
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black sm:text-3xl">Apply for a loan</h1>
      <p className="mt-2 text-sm text-brand-gray/60">
        This should take about 5 minutes. Your progress is saved automatically.
      </p>

      <div className="mt-8">
        <FormStepper steps={STEPS} currentStep={step} />
      </div>

      <div className="mt-8 rounded-3xl border border-black/8 bg-white p-6 shadow-sm sm:p-8">
        {step === 1 && <StepLoan data={data} update={update} errors={errors} />}
        {step === 2 && <StepPersonal data={data} update={update} errors={errors} />}
        {step === 3 && <StepContact data={data} update={update} errors={errors} />}
        {step === 4 && <StepFinancial data={data} update={update} errors={errors} />}
        {step === 5 && <StepReview data={data} update={update} errors={errors} />}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/8 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
            className={step === 1 ? "invisible" : ""}
          >
            ← Back
          </Button>

          {step < STEPS.length ? (
            <Button type="button" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting…" : "Submit Application"}
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
};

function StepLoan({ data, update, errors }: StepProps) {
  const amountProgress = ((data.amount - loanConfig.minAmount) / (loanConfig.maxAmount - loanConfig.minAmount)) * 100;
  const termProgress = ((data.term - loanConfig.minTerm) / (loanConfig.maxTerm - loanConfig.minTerm)) * 100;
  const { total, monthlyPayment } = estimateLoan(data.amount, data.term);

  return (
    <fieldset className="space-y-6">
      <legend className="text-lg font-bold text-brand-black">Loan details</legend>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="apply-amount" className="text-sm font-medium text-brand-gray">
            Amount needed
          </label>
          <span className="text-lg font-bold tabular-nums text-brand-gold">
            {formatCurrency(data.amount, loanConfig.currencySymbol)}
          </span>
        </div>
        <input
          id="apply-amount"
          type="range"
          min={loanConfig.minAmount}
          max={loanConfig.maxAmount}
          step={loanConfig.amountStep}
          value={data.amount}
          onChange={(e) => update("amount", Number(e.target.value))}
          style={{ ["--range-progress" as string]: `${amountProgress}%` }}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="apply-term" className="text-sm font-medium text-brand-gray">
            Loan term
          </label>
          <span className="text-lg font-bold tabular-nums text-brand-gold">{data.term} months</span>
        </div>
        <input
          id="apply-term"
          type="range"
          min={loanConfig.minTerm}
          max={loanConfig.maxTerm}
          step={loanConfig.termStep}
          value={data.term}
          onChange={(e) => update("term", Number(e.target.value))}
          style={{ ["--range-progress" as string]: `${termProgress}%` }}
        />
      </div>

      <Select
        label="Loan purpose"
        required
        value={data.purpose}
        onChange={(e) => update("purpose", e.target.value)}
        error={errors.purpose}
      >
        <option value="">Select a purpose</option>
        <option value="debt-consolidation">Debt consolidation</option>
        <option value="home-improvement">Home improvement</option>
        <option value="vehicle">Vehicle</option>
        <option value="medical">Medical expenses</option>
        <option value="personal">Personal expenses</option>
        <option value="other">Other</option>
      </Select>

      <div className="rounded-xl border border-black/8 bg-black/[0.02] p-4 text-sm text-brand-gray/70">
        Estimated total repayment: <strong className="text-brand-black">{formatCurrency(total, loanConfig.currencySymbol)}</strong>
        {" "}· Est. monthly payment: <strong className="text-brand-black">{formatCurrency(monthlyPayment, loanConfig.currencySymbol)}</strong>
        <p className="mt-1 text-xs text-brand-gray/50">Illustrative only. Confirmed after assessment.</p>
      </div>
    </fieldset>
  );
}

function StepPersonal({ data, update, errors }: StepProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-bold text-brand-black">Personal information</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" required autoComplete="given-name" value={data.firstName} onChange={(e) => update("firstName", e.target.value)} error={errors.firstName} />
        <Input label="Last name" required autoComplete="family-name" value={data.lastName} onChange={(e) => update("lastName", e.target.value)} error={errors.lastName} />
        <Input label="Phone" type="tel" required autoComplete="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
        <Input label="Email" type="email" required autoComplete="email" value={data.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
        <Input label="Date of birth" type="date" required autoComplete="bday" value={data.dob} onChange={(e) => update("dob", e.target.value)} error={errors.dob} />
        <Input label="Identification number" required hint="As shown on your government-issued ID" value={data.idNumber} onChange={(e) => update("idNumber", e.target.value)} error={errors.idNumber} />
      </div>
    </fieldset>
  );
}

function StepContact({ data, update, errors }: StepProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-bold text-brand-black">Contact details</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="City" required autoComplete="address-level2" value={data.city} onChange={(e) => update("city", e.target.value)} error={errors.city} />
        <Input label="Address" required autoComplete="street-address" value={data.address} onChange={(e) => update("address", e.target.value)} error={errors.address} />
        <Select label="Preferred office" optional value={data.preferredOffice} onChange={(e) => update("preferredOffice", e.target.value)}>
          <option value="">No preference / online only</option>
          {offices.map((office) => (
            <option key={office.id} value={office.name}>
              {office.name}
            </option>
          ))}
        </Select>
        <Select
          label="Preferred contact method"
          required
          value={data.preferredContactMethod}
          onChange={(e) => update("preferredContactMethod", e.target.value)}
          error={errors.preferredContactMethod}
        >
          <option value="">Select a method</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </Select>
      </div>
    </fieldset>
  );
}

function StepFinancial({ data, update, errors }: StepProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-bold text-brand-black">Financial information</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Employment status"
          required
          value={data.employmentStatus}
          onChange={(e) => update("employmentStatus", e.target.value)}
          error={errors.employmentStatus}
        >
          <option value="">Select status</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="retired">Retired</option>
          <option value="student">Student</option>
        </Select>
        <Input
          label="Monthly income"
          required
          inputMode="numeric"
          value={data.monthlyIncome}
          onChange={(e) => update("monthlyIncome", e.target.value)}
          error={errors.monthlyIncome}
        />
        <div className="sm:col-span-2">
          <Input
            label="Existing financial obligations"
            optional
            hint="E.g. other loans or credit commitments"
            value={data.existingObligations}
            onChange={(e) => update("existingObligations", e.target.value)}
          />
        </div>
      </div>
    </fieldset>
  );
}

function StepReview({ data, update, errors }: StepProps) {
  const { total, monthlyPayment } = estimateLoan(data.amount, data.term);

  return (
    <fieldset className="space-y-6">
      <legend className="text-lg font-bold text-brand-black">Review your application</legend>

      <ReviewGroup title="Loan">
        <ReviewRow label="Amount" value={formatCurrency(data.amount, loanConfig.currencySymbol)} />
        <ReviewRow label="Term" value={`${data.term} months`} />
        <ReviewRow label="Purpose" value={data.purpose || "—"} />
        <ReviewRow label="Est. monthly payment" value={formatCurrency(monthlyPayment, loanConfig.currencySymbol)} />
        <ReviewRow label="Est. total repayment" value={formatCurrency(total, loanConfig.currencySymbol)} />
      </ReviewGroup>

      <ReviewGroup title="Personal">
        <ReviewRow label="Name" value={`${data.firstName} ${data.lastName}`.trim() || "—"} />
        <ReviewRow label="Phone" value={data.phone || "—"} />
        <ReviewRow label="Email" value={data.email || "—"} />
        <ReviewRow label="Date of birth" value={data.dob || "—"} />
      </ReviewGroup>

      <ReviewGroup title="Contact">
        <ReviewRow label="City" value={data.city || "—"} />
        <ReviewRow label="Address" value={data.address || "—"} />
        <ReviewRow label="Preferred office" value={data.preferredOffice || "No preference"} />
        <ReviewRow label="Contact method" value={data.preferredContactMethod || "—"} />
      </ReviewGroup>

      <ReviewGroup title="Financial">
        <ReviewRow label="Employment status" value={data.employmentStatus || "—"} />
        <ReviewRow label="Monthly income" value={data.monthlyIncome ? formatCurrency(Number(data.monthlyIncome), loanConfig.currencySymbol) : "—"} />
      </ReviewGroup>

      <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-4 text-xs leading-relaxed text-brand-gray/70">
        By submitting this application, you confirm the information provided is accurate. Submitting
        does not guarantee approval — all applications are subject to review and assessment. Final
        loan terms are confirmed after your application is reviewed.
      </div>

      <div className="space-y-3">
        <Checkbox
          label={<>I have read and accept the <a href="/conditions#privacy" className="text-brand-gold underline">Privacy Policy</a>.</>}
          required
          checked={data.privacyConsent}
          onChange={(e) => update("privacyConsent", e.target.checked)}
          error={errors.privacyConsent}
        />
        <Checkbox
          label={<>I have read and accept the <a href="/conditions#terms" className="text-brand-gold underline">Terms &amp; Conditions</a>.</>}
          required
          checked={data.termsAccepted}
          onChange={(e) => update("termsAccepted", e.target.checked)}
          error={errors.termsAccepted}
        />
      </div>
    </fieldset>
  );
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
