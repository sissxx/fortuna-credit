# Fortuna Credit

Marketing and application website for Fortuna Credit, a fast/quick consumer loan company. Built with Next.js (App Router), TypeScript, and Tailwind CSS v4. Bilingual: Bulgarian (default) and English.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/bg` (or `/en` if that was previously selected).

## Internationalization

- `src/i18n/config.ts` — locales (`bg` default, `en`), and the route-slug map used to build locale-aware URLs (e.g. `/bg/krediti` vs `/en/loans`).
- `src/i18n/dictionaries/bg.ts` / `en.ts` — the centralized translation dictionaries. Every UI string lives here, typed against a single `Dictionary` shape (`en.ts` is the source of truth for the shape; `bg.ts` is typechecked against it so the two can never drift out of sync).
- `src/i18n/getDictionary.ts` — server-only loader used by pages/layouts.
- `src/i18n/format.ts` — locale-aware currency/date formatting via `Intl`.
- `src/i18n/renderTemplate.tsx` — renders `{token}` placeholders inside translated strings as rich elements (links, badges) instead of plain text.
- `src/proxy.ts` — the request proxy (Next's successor to `middleware.ts`) that redirects unprefixed paths to the visitor's remembered or default locale and persists the choice in a `NEXT_LOCALE` cookie.
- `next.config.ts` — rewrites/redirects that serve Bulgarian pages at localized slugs (`/bg/krediti`) while the underlying route folders stay named in English, so there is exactly one canonical indexable URL per locale (checked via `alternates.languages` hreflang tags on every page).

Routes live under `src/app/[locale]/*`; `src/app/[locale]/layout.tsx` is the effective root layout (contains `<html lang>`), since locale must be known before the document is written.

All company-specific and financial data lives in [`src/config/site.ts`](src/config/site.ts) — real contact values, loan calculator numbers (`loanConfig`), and office/date identifiers that the dictionaries key into. Translatable copy (including bracket placeholders like `[TO BE CONFIRMED]` / `[ПРЕДСТОИ ПОТВЪРЖДЕНИЕ]`) lives in the dictionaries, not in config. No interest rates, APR, fees, licensing, or regulatory claims have been invented in either language.

The new-office countdown (`src/components/Countdown.tsx`) is reusable — pass any ISO date as `targetDate` and it counts down automatically, switching to a localized "we are open" state once the date passes.

## Structure

- `src/app/[locale]/*` — routes (`/`, `/loans`, `/how-it-works`, `/conditions`, `/locations`, `/faq`, `/contact`, `/apply`, `/application-status`), each with `generateMetadata` producing localized titles/descriptions and hreflang alternates
- `src/components/ui/*` — design system primitives (Button, Input, Select, Checkbox, Card, Badge, Modal, Accordion, Toast, FormStepper)
- `src/components/sections/*` — homepage/marketing sections
- `src/components/*` — feature components (Header, Footer, LanguageSwitcher, LoanCalculator, Countdown, OfficeCard, CallbackForm, ContactForm)

## Notes

- The application status checker (`/application-status`) is a frontend-only placeholder — it is clearly labeled as not connected to a live backend.
- No guarantees of approval, licensing, or regulatory affiliation are made anywhere on the site, in either language.
- The mobile bottom "Apply Now" bar is hidden on the apply page itself (redundant there, and would otherwise cover form content while scrolling).
