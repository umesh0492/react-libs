# ADR 0006: Domain Subpath Isolation Architecture (`@umesh0492/react-libs/india`)

## Status
Accepted

## Context
Early iterations of `@umesh0492/react-libs` bundled regional Indian business logic directly into root exports and generic utility files:
- `src/lib/validators.ts` exported `validateGSTIN`, `validatePAN`, `validateIFSC`, `validateFSSAI`, `validatePincode`.
- `src/lib/formatters.ts` defaulted currency formatting to Indian Rupee (`₹`, `en-IN`) and lakh/crore scale.
- Components like `SalaryRangeDisplay` hardcoded `minLakhs` and `esopsLakhs`.
- `BilingualTooltip` contained hardcoded Hindi dictionary lookups.
- `AmountSummaryCard` had static Indian GST breakdown fields (`CGST`, `SGST`, `IGST`).

While valuable for Indian enterprise applications, baking regional assumptions into the root package caused domain leakage, broke internationalization for global consumers, and violated generic open-source library standards. However, completely purging working, battle-tested code would result in valuable business capability loss.

## Decision
We adopted **Option 1: Subpath Module Isolation** with a two-tier subpath structure:
1. **Pure Domain Subpath (`@umesh0492/react-libs/india`)**:
   - 100% pure TypeScript/JavaScript containing India compliance, taxation calculations, statutory validators, and regional datasets.
   - Built with zero directive/banner into `dist/india/index.js` (and CJS/DTS).
   - Zero React, DOM, or browser dependencies — 100% safe for React Server Components (RSC), Node.js, and Edge runtimes.
   - Preserved assets: `validators.ts`, `tax.ts`, `constants.ts`, `locations.ts`.
2. **Interactive UI Subpath (`@umesh0492/react-libs/india/react`)**:
   - Dedicated entry point for interactive React UI components targeting Indian finance workflows (`AmountSummaryCardIndia`).
   - Built with `'use client';` directive banner into `dist/india/react/index.js` (and CJS/DTS).
   - Safe for Next.js App Router client components while preventing server runtime leakage.
3. **Neutralization of Core Library**:
   - Root (`.`) and `/utils` subpaths remain 100% domain-neutral:
     - Generic validators: `validateTaxId`, `validatePostalCode`, `validatePhone`, `validateBankAccount`, `validateRoutingCode`.
     - Generic currency: defaults to standard ISO/locale or user-provided currency code/symbol (default `$`).
     - `AmountSummaryCard`: accepts configurable `taxes?: { label: string; amount: number; rate?: number }[]`.
     - `SalaryRangeDisplay`: uses generic `min`, `max`, `equity`, `currency` props.
     - `BilingualTooltip`: accepts custom `dictionary` and `targetLanguage` props without hardcoded Hindi terms.
4. **Zero Domain Leakage**:
   - Automated check: `grep -riE 'india|lakh|₹|hindi|en-IN|GST' src/ --exclude-dir=india --exclude-dir=stories` guarantees zero domain bleed in core library code.

## Consequences
- **Positive**:
  - Global users get a clean, domain-neutral component library with zero unexpected regional defaults.
  - Indian enterprise consumers retain complete, first-class access to GST/PAN/IFSC validation and tax splitting via `@umesh0492/react-libs/india`.
  - Full RSC purity: `@umesh0492/react-libs/india` can be safely imported into Server Components and backend Node/Edge services without dragging in React or client directives.
  - Interactive UI (`AmountSummaryCardIndia`) lives in `@umesh0492/react-libs/india/react` with clear `'use client'` demarcation.
  - Zero bundle bloat: consumers importing `@umesh0492/react-libs` or `@umesh0492/react-libs/utils` never bundle Indian regional logic.
- **Negative**:
  - Consumers using `AmountSummaryCardIndia` import from `@umesh0492/react-libs/india/react` instead of `@umesh0492/react-libs/india`.
