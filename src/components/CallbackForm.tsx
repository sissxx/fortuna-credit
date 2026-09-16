"use client";

import { useState, type FormEvent } from "react";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";
import { useToast } from "./ui/Toast";

type Errors = Partial<Record<"name" | "phone", string>>;

export default function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { showToast } = useToast();

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!phone.trim()) next.phone = "Please enter your phone number.";
    else if (!/^[0-9+()\-\s]{7,}$/.test(phone)) next.phone = "Please enter a valid phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      showToast("Callback request received. We'll be in touch soon.", "success");
    }, 900);
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-gold/30 bg-brand-black-deep p-6 text-center text-white sm:p-8">
        <p className="text-lg font-bold text-brand-gold-bright">Request received</p>
        <p className="mt-2 text-sm text-brand-muted">
          Thank you, {name.split(" ")[0] || "there"}. Our team will call you at {phone}
          {preferredTime ? ` around ${preferredTime.toLowerCase()}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
      <div>
        <h3 className="text-lg font-bold text-brand-black">Prefer a call?</h3>
        <p className="mt-1 text-sm text-brand-gray/60">Leave your number and our team can contact you.</p>
      </div>

      <Input
        label="Name"
        name="name"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />
      <Select
        label="Preferred time"
        name="preferredTime"
        optional
        value={preferredTime}
        onChange={(e) => setPreferredTime(e.target.value)}
      >
        <option value="">No preference</option>
        <option value="Morning">Morning</option>
        <option value="Afternoon">Afternoon</option>
        <option value="Evening">Evening</option>
      </Select>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="callback-message" className="flex items-baseline justify-between text-sm font-medium text-brand-gray">
          <span>Message</span>
          <span className="text-xs font-normal text-brand-gray/50">Optional</span>
        </label>
        <textarea
          id="callback-message"
          name="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-base text-brand-black placeholder:text-brand-gray/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
        />
      </div>

      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Request a Callback"}
      </Button>
    </form>
  );
}
