# Migration Guide: Upgrading to v0.1.0

This guide details architectural evolutions and migration steps for upgrading to `@umesh0492/react-libs` v0.1.0.

---

## Overview of Architectural Changes

In v0.1.0, `@umesh0492/react-libs` achieves full domain neutralization, minimal bundle footprint, and strict React Server Components (RSC) purity:
1. **Dedicated Domain Subpath**: Indian regional and compliance logic has been moved from root and `/utils` into a dedicated subpath: `@umesh0492/react-libs/india`.
2. **Pure RSC `/utils`**: The `@umesh0492/react-libs/utils` entry point exports pure utilities with zero DOM, browser, or React dependencies.
3. **Optional Peer Dependencies**: Heavy libraries (`recharts`, `react-pdf`, `xlsx`, `jspdf`, `canvas-confetti`, etc.) are declared as optional peer dependencies.

---

## 1. Indian Domain & Compliance Logic Migration

All Indian-specific validators, tax calculations, and regional constants are isolated in `@umesh0492/react-libs/india`.

### Before (pre-0.1.0):
```tsx
// Deprecated: imports from root or /utils
import { 
  validateGSTIN, 
  validatePAN, 
  validateIFSC, 
  validateFSSAI, 
  validatePincode, 
  INDIA_STATES, 
  INDIA_CITIES 
} from '@umesh0492/react-libs';
// or
import { validateGSTIN } from '@umesh0492/react-libs/utils';
```

### After (v0.1.0):
```tsx
// 1. Pure domain validators, tax calculations, and datasets (Server-safe, Edge-safe, Node-safe):
import { 
  validateGSTIN, 
  validatePAN, 
  validateIFSC, 
  validateFSSAI, 
  validatePincode, 
  calculateGSTSplit, 
  calculateTDS,
  INDIA_STATES, 
  INDIA_CITIES,
  INDIAN_LANGUAGES,
  formatLakhs,
  formatCrores
} from '@umesh0492/react-libs/india';

// 2. Interactive React UI components ('use client' bounded):
import { AmountSummaryCardIndia } from '@umesh0492/react-libs/india/react';
```

---

## 2. Purity of `@umesh0492/react-libs/utils`

`@umesh0492/react-libs/utils` is now strictly server-safe and contains zero browser DOM references (`window`, `document`, `Blob`).

- If your application imported `downloadFileSecurely` or `exportData` from `@umesh0492/react-libs/utils`, update the import to root `@umesh0492/react-libs`:

```tsx
// Before (pre-0.1.0)
import { downloadFileSecurely, exportData } from '@umesh0492/react-libs/utils';

// After (v0.1.0)
import { downloadFileSecurely, exportData } from '@umesh0492/react-libs';
```

---

## 3. Optional Peer Dependencies

To keep the core bundle lightweight and eliminate dependency bloat, heavy visualization and specialized packages are now declared as **optional peer dependencies**.

If you use any of the following features, ensure the corresponding peer package is installed in your project:

| Feature / Component | Required Peer Dependency | Installation Command |
|---|---|---|
| `ChartContainer`, `ChartTooltip`, `ChartLegend` | `recharts` | `npm i recharts` |
| `PdfViewer` (`@umesh0492/react-libs/pdf`) | `react-pdf` | `npm i react-pdf` |
| Export to Excel (`exportData({ format: 'xlsx' })`) | `xlsx` | `npm i xlsx` |
| Export to PDF (`exportData({ format: 'pdf' })`) | `jspdf`, `jspdf-autotable` | `npm i jspdf jspdf-autotable` |
| Confetti interactions (`SuccessMicroInteraction`) | `canvas-confetti` | `npm i canvas-confetti @types/canvas-confetti` |
| `Carousel` | `embla-carousel-react` | `npm i embla-carousel-react` |
| `Command` (command palette dialog) | `cmdk` | `npm i cmdk` |
| `Drawer` | `vaul` | `npm i vaul` |
| `Calendar`, `DateRangePicker` | `react-day-picker` | `npm i react-day-picker` |

---

## 4. Component API Updates

### `AmountSummaryCard`
The card now accepts dynamic, configurable tax breakdowns rather than hardcoded Indian GST categories (`CGST`, `SGST`, `IGST`).

```tsx
// Before (pre-0.1.0)
<AmountSummaryCard
  subtotal={10000}
  cgst={900}
  sgst={900}
  total={11800}
/>

// After (v0.1.0)
<AmountSummaryCard
  subtotal={10000}
  taxes={[
    { label: 'State Tax', amount: 900, rate: 9 },
    { label: 'City Tax', amount: 900, rate: 9 }
  ]}
  total={11800}
/>
```

> **Tip for India GST apps**: Use `AmountSummaryCardIndia` from `@umesh0492/react-libs/india` which automatically formats GST splits:
> ```tsx
> import { AmountSummaryCardIndia } from '@umesh0492/react-libs/india';
> ```

### `SalaryRangeDisplay`
Deprecated `minLakhs`, `fixedLakhs`, and `esopsLakhs` props have been replaced with standard numeric props and configurable currency:

```tsx
// Before (pre-0.1.0)
<SalaryRangeDisplay minLakhs={20} fixedLakhs={35} esopsLakhs={10} />

// After (v0.1.0)
<SalaryRangeDisplay min={2000000} max={3500000} equity={1000000} currency="$" />
```

### `BilingualTooltip`
`BilingualTooltip` no longer bundles a hardcoded Hindi translation dictionary. Provide your translation map and target language code via props:

```tsx
// After (v0.1.0)
<BilingualTooltip
  term="Gross Revenue"
  dictionary={{ "Gross Revenue": "Ingresos Brutos" }}
  targetLanguage="es"
>
  <span>Hover me</span>
</BilingualTooltip>
```
