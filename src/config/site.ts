// Centralized, locale-independent configuration for Fortuna Credit.
// Translatable copy lives in src/i18n/dictionaries/*. This file holds only
// structural data: real contact values (once supplied), loan calculator
// numbers, and office/date identifiers that the dictionaries key into.
// Replace placeholder values when the business supplies real data — UI
// components read from this file and the dictionaries, and should not need
// code changes.

export const fortuna = {
  name: "Fortuna Credit",
  phoneHref: "tel:+000000000",
  emailHref: "mailto:info@example.com",
};

export const newOfficeMeta = {
  openingDateISO: "2026-10-01T09:00:00",
};

export type OfficeMeta = {
  id: string;
  isNew: boolean;
  openingDateISO?: string;
};

export const officesMeta: OfficeMeta[] = [
  { id: "office-1", isNew: false },
  { id: "office-2", isNew: false },
  { id: "office-new", isNew: true, openingDateISO: newOfficeMeta.openingDateISO },
];

// Loan calculator configuration. All figures are placeholders until the
// business supplies real terms — the calculator clearly labels its output
// as illustrative only.
export const loanConfig = {
  minAmount: 500,
  maxAmount: 10000,
  defaultAmount: 3000,
  amountStep: 100,
  minTerm: 3,
  maxTerm: 36,
  defaultTerm: 12,
  termStep: 1,
  // Placeholder illustrative rate — NOT a real APR. Replace when confirmed.
  interestRate: 0, // 0 disables interest math until a real rate is supplied
  feesFlat: 0, // placeholder flat fee amount
  currency: "BGN",
};
