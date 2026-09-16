# Fortuna Credit

Marketing and application website for Fortuna Credit, a fast/quick consumer loan company. Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

All company-specific and financial data lives in [`src/config/site.ts`](src/config/site.ts):

- `fortuna` — company contact details and working hours
- `newOffice` — the October 1 new-location opening (city, address, phone, hours, opening date)
- `offices` — all office locations, including the new one (`isNew: true`)
- `loanConfig` — loan calculator inputs (min/max amount, term, illustrative rate/fees)
- `loanConditions` — conditions page figures (rates, fees, eligibility, repayment terms)
- `faqs`, `howItWorksSteps`, `advantages`, `eligibilityRequirements`, `navItems`

Fields marked `[TO BE CONFIRMED]` or `[PLACEHOLDER]`-style are intentionally unset — no interest rates, APR, fees, licensing, or regulatory claims have been invented. Replace these values as the business supplies them; UI components read from this file and should not need code changes.

The new-office countdown (`src/components/Countdown.tsx`) is reusable — pass any ISO date as `targetDate` and it counts down automatically, switching to a "We are open" state once the date passes.

## Structure

- `src/app/*` — routes (`/`, `/loans`, `/how-it-works`, `/conditions`, `/locations`, `/faq`, `/contact`, `/apply`, `/application-status`)
- `src/components/ui/*` — design system primitives (Button, Input, Select, Checkbox, Card, Badge, Modal, Accordion, Toast, FormStepper)
- `src/components/sections/*` — homepage/marketing sections
- `src/components/*` — feature components (Header, Footer, LoanCalculator, Countdown, OfficeCard, CallbackForm, ContactForm)

## Notes

- The application status checker (`/application-status`) is a frontend-only placeholder — it is clearly labeled as not connected to a live backend.
- No guarantees of approval, licensing, or regulatory affiliation are made anywhere on the site.
