import { NextResponse } from "next/server";
import { Resend } from "resend";
import { loanConfig } from "@/config/site";

// Every submitted application is emailed here — the business owner's inbox,
// not a placeholder. See RESEND_API_KEY below for what makes delivery work.
const APPLICATION_RECIPIENT = "siss99.sh@gmail.com";

type ApplicationPayload = {
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
};

function isApplicationPayload(body: unknown): body is ApplicationPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.amount === "number" &&
    typeof b.firstName === "string" &&
    b.firstName.trim().length > 0 &&
    typeof b.lastName === "string" &&
    b.lastName.trim().length > 0 &&
    typeof b.phone === "string" &&
    typeof b.email === "string" &&
    typeof b.dob === "string" &&
    typeof b.city === "string" &&
    typeof b.address === "string" &&
    typeof b.preferredOffice === "string" &&
    typeof b.preferredContactMethod === "string" &&
    typeof b.employmentStatus === "string" &&
    typeof b.monthlyIncome === "string" &&
    typeof b.existingObligations === "string"
  );
}

function generateApplicationId(): string {
  return `FC-${Math.floor(100000 + Math.random() * 900000)}`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isApplicationPayload(body)) {
    return NextResponse.json({ error: "Missing or invalid application fields." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — cannot send application emails.");
    return NextResponse.json({ error: "Email delivery is not configured." }, { status: 500 });
  }

  const applicationId = generateApplicationId();

  const fields: [string, string][] = [
    ["Reference", applicationId],
    ["Requested amount", `${body.amount} ${loanConfig.currency}`],
    ["First name", body.firstName],
    ["Last name", body.lastName],
    ["Phone", body.phone],
    ["Email", body.email],
    ["Date of birth", body.dob],
    ["City", body.city],
    ["Address", body.address],
    ["Preferred office", body.preferredOffice || "—"],
    ["Preferred contact method", body.preferredContactMethod || "—"],
    ["Employment status", body.employmentStatus],
    ["Monthly income", body.monthlyIncome],
    ["Existing obligations", body.existingObligations || "—"],
  ];

  const html = `
    <h2>New Fortuna Credit application — ${applicationId}</h2>
    <table cellpadding="6" cellspacing="0" border="0">
      ${fields.map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join("")}
    </table>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Fortuna Credit <onboarding@resend.dev>",
      to: APPLICATION_RECIPIENT,
      replyTo: body.email,
      subject: `New loan application — ${applicationId}`,
      html,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send application email." }, { status: 502 });
    }
  } catch (err) {
    console.error("Failed to send application email:", err);
    return NextResponse.json({ error: "Failed to send application email." }, { status: 502 });
  }

  return NextResponse.json({ applicationId });
}
