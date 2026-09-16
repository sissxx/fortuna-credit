"use client";

import { useState, type FormEvent } from "react";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";
import { useToast } from "./ui/Toast";
import { t } from "@/i18n/format";
import type { Dictionary } from "@/i18n/getDictionary";

type Errors = Partial<Record<"name" | "contact" | "subject" | "message", string>>;

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { showToast } = useToast();
  const c = dict.contactForm;

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = c.errorName;
    if (!contact.trim()) next.contact = c.errorContact;
    if (!subject) next.subject = c.errorSubject;
    if (!message.trim() || message.trim().length < 10) next.message = c.errorMessage;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      showToast(dict.toasts.messageSent, "success");
    }, 900);
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-8 text-center">
        <p className="text-lg font-bold text-emerald-400">{c.successTitle}</p>
        <p className="mt-2 text-sm text-brand-gray/70">{t(c.successBody, { name: name.split(" ")[0] || "" })}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
      <Input label={c.name} name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Input
        label={c.contact}
        name="contact"
        autoComplete="email"
        required
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        error={errors.contact}
      />
      <Select label={c.subject} name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} error={errors.subject}>
        <option value="">{c.subjectPlaceholder}</option>
        <option value="application">{c.subjectApplication}</option>
        <option value="loan-conditions">{c.subjectConditions}</option>
        <option value="office-visit">{c.subjectVisit}</option>
        <option value="complaint">{c.subjectComplaint}</option>
        <option value="other">{c.subjectOther}</option>
      </Select>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-brand-gray">
          {c.message} <span className="text-brand-gold" aria-hidden>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-base text-brand-black placeholder:text-brand-gray/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.message && (
          <p role="alert" className="text-xs font-medium text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {c.errorGeneric}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? dict.common.sending : c.submit}
      </Button>
    </form>
  );
}
