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
We adopted **Option 1: Subpath Module Isolation**:
1. **Dedicated Subpath Entry Point**:
   - All Indian compliance, taxation, and geographic domain logic is moved into `src/india/` and compiled to `@umesh0492/react-libs/india`.
   - Dedicated build entry `india/index` configured in `tsup.config.ts`.
   - Exported in `package.json` under `"./india"` with full dual ESM/CJS and TypeScript type definitions.
2. **Preserved Domain Assets**:
   - `src/india/validators.ts`: `validateGSTIN`, `validatePAN`, `validatePhoneIN`, `validateIFSC`, `validateFSSAI`, `validatePincode` (plus regex constants).
   - `src/india/tax.ts`: `calculateGSTSplit`, `AmountSummaryCardIndia` regional wrapper.
   - `src/india/constants.ts`: `INDIA_STATES`, `INDIA_CITIES`, regional language configurations.
   - Preserved unit tests in `src/india/__tests__/india.test.ts`.
3. **Neutralization of Core Library**:
   - Root (`.`) and `/utils` subpaths are 100% domain-neutral:
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
  - Zero bundle bloat: consumers importing `@umesh0492/react-libs` or `@umesh0492/react-libs/utils` never bundle Indian regional logic.
- **Negative**:
  - Existing consumers using GST/PAN validators directly from root must update their import to `@umesh0492/react-libs/india` (detailed in `MIGRATION.md`).
