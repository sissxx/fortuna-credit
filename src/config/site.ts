// Centralized configuration for Fortuna Credit.
// Replace placeholder values ([TO BE CONFIRMED], [PHONE], etc.) with real
// company data when it becomes available. UI components read from this file
// and should not need to change when real values are supplied.

export const fortuna = {
  name: "Fortuna Credit",
  legalName: "Fortuna Credit [TO BE CONFIRMED]",
  phone: "[PHONE NUMBER]",
  phoneHref: "tel:+00000000000",
  email: "[EMAIL ADDRESS]",
  workingHours: {
    weekdays: "[WEEKDAY HOURS]",
    saturday: "[SATURDAY HOURS]",
    sunday: "[SUNDAY HOURS]",
  },
};

export const newOffice = {
  openingDate: "2026-10-01T09:00:00",
  openingDateLabel: "October 1",
  city: "[NEW OFFICE CITY]",
  address: "[NEW OFFICE ADDRESS]",
  phone: "[NEW OFFICE PHONE]",
  hours: "[NEW OFFICE WORKING HOURS]",
};

export type Office = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: {
    mondayFriday: string;
    saturday: string;
    sunday: string;
  };
  mapEmbedUrl?: string;
  isNew: boolean;
  openingDate?: string;
  openingDateLabel?: string;
};

export const offices: Office[] = [
  {
    id: "office-1",
    name: "Fortuna Credit — [CITY]",
    address: "[ADDRESS]",
    phone: "[PHONE]",
    hours: {
      mondayFriday: "[HOURS]",
      saturday: "[HOURS]",
      sunday: "[HOURS]",
    },
    isNew: false,
  },
  {
    id: "office-2",
    name: "Fortuna Credit — [CITY]",
    address: "[ADDRESS]",
    phone: "[PHONE]",
    hours: {
      mondayFriday: "[HOURS]",
      saturday: "[HOURS]",
      sunday: "[HOURS]",
    },
    isNew: false,
  },
  {
    id: "office-new",
    name: `Fortuna Credit — ${newOffice.city}`,
    address: newOffice.address,
    phone: newOffice.phone,
    hours: {
      mondayFriday: newOffice.hours,
      saturday: newOffice.hours,
      sunday: newOffice.hours,
    },
    isNew: true,
    openingDate: newOffice.openingDate,
    openingDateLabel: newOffice.openingDateLabel,
  },
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
  currency: "USD",
  currencySymbol: "$",
};

export const loanConditions = {
  minAmount: "[TO BE CONFIRMED]",
  maxAmount: "[TO BE CONFIRMED]",
  loanTerms: "[TO BE CONFIRMED]",
  interestRate: "[TO BE CONFIRMED]",
  apr: "[TO BE CONFIRMED]",
  fees: "[TO BE CONFIRMED]",
  minimumAge: "[TO BE CONFIRMED]",
  requiredDocuments: [
    "[TO BE CONFIRMED]",
    "[TO BE CONFIRMED]",
    "[TO BE CONFIRMED]",
  ],
  incomeRequirements: "[TO BE CONFIRMED]",
  repaymentMethods: "[TO BE CONFIRMED]",
  earlyRepayment: "[TO BE CONFIRMED]",
  latePayment: "[TO BE CONFIRMED]",
  otherCharges: "[TO BE CONFIRMED]",
};

export const eligibilityRequirements = [
  "Meet the required minimum age",
  "Have valid identification",
  "Provide accurate and complete information",
  "Meet applicable income requirements",
  "Meet Fortuna Credit's assessment criteria",
];

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Loans", href: "/loans" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Conditions", href: "/conditions" },
  { label: "Locations", href: "/locations" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export type FAQItemData = { question: string; answer: string };

export const faqs: FAQItemData[] = [
  {
    question: "How does the application process work?",
    answer:
      "You complete an application online or at one of our offices, provide the required information, and our team reviews it to determine the terms that apply to you.",
  },
  {
    question: "How much can I borrow?",
    answer:
      "Loan amounts depend on your application and assessment. See the Conditions page for the minimum and maximum amounts once confirmed.",
  },
  {
    question: "What loan terms are available?",
    answer:
      "Available terms vary by product and individual assessment. Exact terms are shown in your offer before you accept.",
  },
  {
    question: "Who can apply?",
    answer:
      "Applicants generally need to meet a minimum age requirement, provide valid identification, and meet our assessment criteria. See the Eligibility section for details.",
  },
  {
    question: "What documents do I need?",
    answer:
      "Typically valid identification and information about your income and financial situation. Exact requirements are confirmed during your application.",
  },
  {
    question: "Can I apply online?",
    answer: "Yes. You can complete the entire application from your phone, tablet, or computer.",
  },
  {
    question: "Can I apply at an office?",
    answer: "Yes. Our team can help you complete your application in person at any Fortuna Credit office.",
  },
  {
    question: "How long does the application process take?",
    answer:
      "Processing times vary based on the completeness of your application and our review process. We aim to keep you informed at every step.",
  },
  {
    question: "How do I receive the funds?",
    answer:
      "If your application is approved and all required steps are completed, funds are provided according to the terms agreed in your offer.",
  },
  {
    question: "How do I repay?",
    answer: "Repayment methods are confirmed as part of your agreement. See the Conditions page for details.",
  },
  {
    question: "Can I repay early?",
    answer: "Early repayment conditions are outlined in your agreement. See the Conditions page for what applies.",
  },
  {
    question: "What happens if I miss a payment?",
    answer:
      "Late payment conditions and any applicable charges are outlined in your agreement. Contact us as soon as possible if you expect to miss a payment.",
  },
  {
    question: "Are there additional fees?",
    answer: "Any applicable fees are disclosed clearly before you accept your loan offer.",
  },
  {
    question: "How is my personal information protected?",
    answer:
      "We take the protection of your personal information seriously. See our Privacy Policy for details on how your data is collected, used, and safeguarded.",
  },
  {
    question: "Where are your offices?",
    answer: "Visit the Locations page for addresses, phone numbers, and hours for every Fortuna Credit office.",
  },
  {
    question: "When does the new office open?",
    answer: `Our newest office opens on ${newOffice.openingDateLabel} in ${newOffice.city}. Visit the Locations page for details.`,
  },
  {
    question: "How can I contact Fortuna Credit?",
    answer:
      "You can call us, email us, request a callback, or visit us in person. See the Contact page for all the ways to reach our team.",
  },
];

export const howItWorksSteps = [
  {
    number: "01",
    title: "Apply",
    description: "Fill out the online application or visit one of our offices.",
  },
  {
    number: "02",
    title: "Provide your information",
    description: "Provide the required personal and financial information.",
  },
  {
    number: "03",
    title: "Application review",
    description: "Our team reviews your application and determines the applicable terms.",
  },
  {
    number: "04",
    title: "Receive your funds",
    description:
      "If approved and all required steps are completed, funds are provided according to the agreed terms.",
  },
];

export const advantages = [
  {
    title: "Fast application",
    description: "A simple application process designed to save you time.",
  },
  {
    title: "Clear conditions",
    description: "Understand the applicable costs and repayment terms before accepting.",
  },
  {
    title: "Personal support",
    description: "Our team is available to answer questions and guide you through the process.",
  },
  {
    title: "Convenient locations",
    description: "Visit a Fortuna Credit office in person.",
  },
  {
    title: "Easy online application",
    description: "Start your application from your phone, tablet, or computer.",
  },
  {
    title: "Transparent information",
    description: "Important loan information is easy to find and understand.",
  },
];
