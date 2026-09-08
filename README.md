# @umesh0492/react-libs

> **Production-grade React 19 component library with Tailwind CSS v4 & Radix UI primitives.**  
> Single source of truth for visual components, design tokens, hooks, formatters, and behavioral analytics across web applications.

[![Version](https://img.shields.io/npm/v/@umesh0492/react-libs)](https://www.npmjs.com/package/@umesh0492/react-libs)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](#testing)
[![Coverage](https://img.shields.io/badge/coverage-%E2%89%A580%25-brightgreen)](#testing)
[![React](https://img.shields.io/badge/react-19-blue)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/tailwind-v4-38bdf8)](https://tailwindcss.com)
[![Storybook](https://img.shields.io/badge/storybook-10.x-ff4785)](https://umesh0492.github.io/react-libs)

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start & Imports](#quick-start--imports)
   - [Subpath Reference Table](#subpath-reference-table)
   - [SSR Compatibility & Hydration Architecture](#ssr-compatibility--hydration-architecture)
   - [Dedicated Client Subpath for PdfViewer](#dedicated-client-subpath-for-pdfviewer)
   - [Dual ESM & CommonJS Support](#dual-esm--commonjs-support)
3. [Styling & CSS Delivery](#styling--css-delivery)
4. [Component Reference](#component-reference)
5. [Composite Components](#composite-components)
   - [PdfViewer (Client Subpath)](#pdfviewer-client-subpath)
6. [Pluggable Behavioral Analytics](#pluggable-behavioral-analytics)
7. [Hooks](#hooks)
8. [Formatters](#formatters)
9. [Responsive Design](#responsive-design)
10. [Testing](#testing)
11. [Publishing](#publishing)
12. [Architecture & Accessibility](#architecture--accessibility)

---

## Installation

Install `@umesh0492/react-libs` directly from [npm](https://www.npmjs.com/package/@umesh0492/react-libs):

```bash
npm install @umesh0492/react-libs
```

### Peer Dependencies
Ensure your project has React 18 or 19 installed:

```bash
npm install react@^19.0.0 react-dom@^19.0.0
# Or for React 18 projects:
# npm install react@^18.2.0 react-dom@^18.2.0
```

---

## Quick Start & Imports

No complex path mapping or bundler alias configurations are required in your application. All components, utilities, and formatters are accessible through standard, tree-shakable package entry points.

### Subpath Reference Table

The library exposes dedicated entry points for UI components, server-safe utilities, client-only features, domain compliance, analytics, hooks, and stylesheets:

| Subpath / Export | Module Formats | SSR / RSC Compatibility | Purpose & Contents |
|---|---|---|---|
| `@umesh0492/react-libs` | ESM (`import`), CJS (`require`) | **Client Components** (`'use client'`) | Primary UI component library (70+ components, primitives, forms, dialogs, charts, error boundaries, and hooks). SSR-compatible with browser APIs guarded inside lifecycle hooks. |
| `@umesh0492/react-libs/utils` | ESM (`import`), CJS (`require`) | **RSC & Server-Safe** | Pure utility helpers, formatters, universal validators, masking, and `cn`. Zero DOM and zero React dependencies; safe in Next.js Server Components, Server Actions, Route Handlers, and Edge runtimes. |
| `@umesh0492/react-libs/india` | ESM (`import`), CJS (`require`) | **RSC & Server-Safe** | Dedicated domain subpath containing India compliance logic: GSTIN, PAN, IFSC, FSSAI, and Pincode validators, GST tax calculation splits, regional constants (`INDIA_STATES`, `INDIA_CITIES`), and regional cards. |
| `@umesh0492/react-libs/analytics` | ESM (`import`), CJS (`require`) | **Client & SSR-Safe** | Pluggable behavioral analytics tracking engine, DOM auto-tracking, batching pipeline, and destination adapters. |
| `@umesh0492/react-libs/pdf` | ESM (`import`), CJS (`require`) | **Client-Only** (`'use client'`) | Dedicated client subpath for `PdfViewer`. Isolated from root to prevent Node SSR from executing browser-only PDF workers (`pdfjs-dist`). |
| `@umesh0492/react-libs/hooks/use-toast` | ESM (`import`), CJS (`require`) | **Client Hook** (`'use client'`) | Standalone imperative toast notification hook (`useToast`, `toast`). |
| `@umesh0492/react-libs/style.css` | CSS | N/A | Standalone pre-compiled stylesheet with all Tailwind utility classes and design tokens. |
| `@umesh0492/react-libs/styles/theme.css` | CSS | N/A | Design system theme variables and color tokens for Tailwind CSS v4 projects (`@import`). |

### SSR Compatibility & Hydration Architecture

The primary package entry point (`@umesh0492/react-libs`) is engineered for broad SSR and RSC compatibility:
- **Zero Module-Level DOM Access**: No browser globals (`window`, `document`, `navigator`, `localStorage`) are evaluated during module evaluation or import, preventing Node.js SSR crashes.
- **SSR & RSC Architecture**: Interactive components carry explicit `'use client'` boundaries for React Server Component frameworks (such as Next.js App Router). Zero-DOM pure utilities reside in `@umesh0492/react-libs/utils` and run safely in Server Components, Server Actions, and Edge runtimes.
- **Client Effects Isolation**: All interactive browser logic (event listeners, DOM measurements, post-mount fallbacks) is scoped inside `useEffect` or client event handlers to prevent hydration mismatches. For zero-flash SSR with components like `Sidebar`, pass server cookie values directly to `defaultOpen`.

### Dedicated Client Subpath for PdfViewer

Components with browser-only dependencies—specifically `PdfViewer`, which relies on `pdfjs-dist` and web workers—are isolated into a dedicated client subpath:

```tsx
"use client"; // Next.js App Router client component directive

import { PdfViewer } from "@umesh0492/react-libs/pdf";

export function ContractViewer() {
  return (
    <PdfViewer
      url="/agreements/sample-agreement.pdf"
      title="Sample Agreement & Terms"
    />
  );
}
```

> [!IMPORTANT]
> **Why is `PdfViewer` isolated?**  
> PDF rendering engines require browser APIs (`DOMMatrix`, Canvas rendering context, `window.URL.createObjectURL`) and web workers (`pdf.worker.mjs`). Isolating `PdfViewer` under `@umesh0492/react-libs/pdf` prevents Node.js SSR environments from executing browser-only PDF workers or encountering `DOMMatrix is not defined` errors during server compilation.

### Dual ESM & CommonJS Support

The package ships with first-class dual build support for modern ECMAScript Modules (`import`) and legacy CommonJS (`require`):

```tsx
// Modern ESM (Vite, Next.js, Remix, Webpack 5, tsx)
import { Button, Card } from "@umesh0492/react-libs";
import { cn, formatCurrency } from "@umesh0492/react-libs/utils";
import { PdfViewer } from "@umesh0492/react-libs/pdf";
import { initAnalytics } from "@umesh0492/react-libs/analytics";
```

```javascript
// CommonJS (Node.js runtime, legacy tooling, Jest)
const { Button, Card } = require("@umesh0492/react-libs");
const { cn, formatCurrency } = require("@umesh0492/react-libs/utils");
const { PdfViewer } = require("@umesh0492/react-libs/pdf");
const { initAnalytics } = require("@umesh0492/react-libs/analytics");
```

### Server-Safe Pure Utilities Subpath (`/utils`)

`@umesh0492/react-libs/utils` provides pure helper functions with **zero DOM and zero React dependencies**. It is guaranteed to execute safely inside React Server Components, Server Actions, Route Handlers, Node.js scripts, and Edge workers:

```tsx
import { cn, formatCurrency, formatDate, isValidEmail, maskEmail } from "@umesh0492/react-libs/utils";

// Pure functions safe in React Server Components, Server Actions, and Node.js
export async function ServerSummaryCard({ user, balance }: { user: { email: string }, balance: number }) {
  return (
    <div className={cn("p-4 rounded-lg border", "bg-muted/50")}>
      <p>{maskEmail(user.email)}</p>
      <p>{formatCurrency(balance)}</p>
    </div>
  );
}
```

### Standard UI Component Imports

```tsx
import { Button, Dialog, Card } from "@umesh0492/react-libs";

export function App() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold">Hello World</h2>
      <Button variant="default" className="mt-4">
        Click Me
      </Button>
    </Card>
  );
}
```

### Analytics Subpath Import

```tsx
import { initAnalytics } from "@umesh0492/react-libs/analytics";

initAnalytics({
  autoTrackDom: true,
});
```

---

## Styling & CSS Delivery

The library provides two delivery strategies for styling and design tokens depending on your build system and Tailwind version:

### 1. For Tailwind CSS v4 Applications
Import the design system theme directly into your global CSS stylesheet (e.g. `src/index.css` or `src/globals.css`):

```css
@import "tailwindcss";
@import "@umesh0492/react-libs/styles/theme.css";
```

This registers all semantic design tokens (`--primary`, `--muted`, `--border`, etc.) directly with Tailwind v4's `@theme` directive, giving you instant access to semantic utility classes like `bg-primary`, `text-muted`, and `border-border`.

### 2. For Standard CSS / Tailwind CSS v3 / Vite Applications
If your project uses Tailwind CSS v3, Vite, Webpack, Create React App, or standard plain CSS without Tailwind v4, import the pre-compiled distribution stylesheet at your application's root entry point (e.g. `main.tsx`, `App.tsx`, or `_app.tsx`):

```tsx
import "@umesh0492/react-libs/dist/style.css";
```

> [!NOTE]
> `@umesh0492/react-libs/dist/style.css` contains all pre-compiled Tailwind utility classes and design tokens. It requires zero PostCSS or Tailwind build plugins on the consumer end, making it plug-and-play in any React project.

### Brand Tokens & CSS Variables

All color, spacing, typography, and border-radius tokens are defined via semantic CSS variables:

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `hsl(142 76% 36%)` | `hsl(142 71% 45%)` | Primary brand green — buttons, active states |
| `--destructive` | `hsl(0 84% 60%)` | `hsl(0 63% 31%)` | Danger & destructive actions |
| `--muted` | `hsl(210 40% 96%)` | `hsl(217 33% 18%)` | Backgrounds, neutral subtle fills |
| `--border` | `hsl(214 32% 91%)` | `hsl(217 33% 18%)` | Component outlines & dividers |
| `--accent` | `hsl(210 40% 96%)` | `hsl(217 33% 18%)` | Hover states and badge highlights |

### Multi-Brand Theming

Add `.theme-orange` (or customized brand classes) to switch accent branding seamlessly:

```tsx
<div className="theme-orange">
  <Button>Orange Action Button</Button>
</div>
```

---

## Component Reference

> Interactive documentation & stories: [Storybook Playground](https://umesh0492.github.io/react-libs) · Comprehensive guide: [WIKI.md](./WIKI.md)

> [!NOTE]
> **SSR Compatibility**: Root `@umesh0492/react-libs` UI components are tagged with `'use client'` directives and guard browser APIs to avoid server hydration mismatches in Next.js App Router and Remix. Pure utilities under `@umesh0492/react-libs/utils` run safely in server contexts with zero DOM/React dependencies. Browser-only components such as `PdfViewer` are exported through dedicated client subpaths (`@umesh0492/react-libs/pdf`) to prevent server runtime issues.

All standard UI components are directly importable from `@umesh0492/react-libs` (with client-only subpaths noted):

| Domain | Component | Notes |
|---|---|---|
| **Forms** | `Button` | Accessible button with `isLoading`, `loadingText`, variants (`default`, `destructive`, `outline`, `ghost`, `secondary`, `link`) |
| | `Input` | Controlled/uncontrolled input with label and helper text integration |
| | `FileUpload` | Drag-and-drop file upload with preview, file-type filters, and size validation |
| | `MultiSelect` | Searchable chip/tag selector with keyboard navigation |
| | `Textarea` | Multiline text input with auto-resize and character counts |
| | `Select` | Radix-based custom select (`SelectTrigger`, `SelectContent`, `SelectItem`) |
| | `AsyncSelect` | Debounced remote-search select for dynamic datasets |
| | `FilterSelect` | Searchable filter dropdown for data table headers and toolbars |
| | `Checkbox` | Accessible checkbox supporting indeterminate and disabled states |
| | `RadioGroup` | Accessible radio group (`RadioGroupItem`) with keyboard arrow navigation |
| | `Switch` | Accessible binary toggle switch |
| | `Toggle` | Single-press toggle button |
| | `ToggleGroup` | Single and multi-select button toggle groups |
| | `Slider` | Range and single-value track slider |
| | `Form` | Full `react-hook-form` integration with schema validation |
| | `Label` | Accessible form label with error styling |
| | `InputGroup` | Input with integrated prefix/suffix buttons or icons |
| | `ButtonGroup` | Grouped set of related action buttons |
| **Data Display** | `Badge` | Status and label badges (`default`, `secondary`, `destructive`, `outline`) |
| | `KPICard` | Key Performance Indicator metric card with trend arrow and percentage change |
| | `Timeline` | Chronological activity log and audit trail feed |
| | `StatusBadge` | Pre-configured color and icon badges for common entity and workflow statuses |
| | `ActiveFilterBadge` | Dismissible filter tag for active filter rows |
| | `Avatar` | Profile image with graceful fallback initials |
| | `Card` | Structured surface container (`CardHeader`, `CardContent`, `CardFooter`) |
| | `DataTable` | Feature-rich table with client/server sorting, skeleton loading, pagination, and empty states |
| | `Table` | Primitive semantic table building blocks (`TableHeader`, `TableRow`, `TableCell`) |
| | `PdfViewer` | Multi-page interactive PDF document viewer with zoom, pagination, rotation, and printing. *Imported via `@umesh0492/react-libs/pdf` (client-only subpath).* |
| | `Chart` | Themed Recharts wrapper for responsive analytics visualizations |
| | `Accordion` | Accessible collapsible accordion panels |
| | `Collapsible` | Expandable content section |
| | `Carousel` | Touch-friendly Embla-powered carousel slider |
| **Layout** | `PageHeader` | Standardized header container with title, breadcrumb slot, and action buttons |
| | `Separator` | Semantic horizontal or vertical divider |
| | `ScrollArea` | Cross-browser custom scrollbar container |
| | `AspectRatio` | Fixed aspect ratio wrapper (16:9, 4:3, etc.) |
| | `ResizablePanelGroup` | Split-pane draggable resizable panels |
| **Overlays** | `Dialog` | Accessible modal dialog with focus trap and backdrop animation |
| | `AlertDialog` | High-priority destructive confirmation modal |
| | `ConfirmDialog` | Streamlined confirmation modal with loading feedback |
| | `Sheet` | Sliding drawer panel (left, right, top, bottom) |
| | `Popover` | Floating popover positioned relative to anchor elements |
| | `HoverCard` | Preview card displayed on mouse hover |
| | `Tooltip` | Accessible tooltip with configurable delays |
| | `DropdownMenu` | Contextual action dropdown menu |
| | `ContextMenu` | Right-click contextual menu |
| | `Command` | Fast cmdk-powered search & command palette |
| | `Drawer` | Mobile-first bottom drawer sheet (vaul) |
| **Navigation** | `Sidebar` | Collapsible desktop and mobile application sidebar |
| | `Stepper` | Multi-step wizard and workflow progression indicator |
| | `NavigationMenu` | Top-level dropdown navigation header |
| | `Breadcrumb` | Hierarchy pathway navigation trail |
| | `Tabs` | Tabbed navigation container (`TabsList`, `TabsTrigger`, `TabsContent`) |
| | `Menubar` | Desktop-style menu bar (File / Edit / View) |
| | `Pagination` | Accessible pagination controls with page jumpers |
| **Feedback** | `Banner` | System announcement banner with call-to-action and dismiss controls |
| | `CopyButton` | 1-click clipboard copy button with checkmark feedback animation |
| | `Toast` / `Toaster` | Notification toast system |
| | `Sonner` | Sonner toast provider alternative |
| | `Skeleton` | Content loading placeholder skeleton |
| | `SkeletonList` | Multi-item skeleton loader |
| | `Progress` | Accessible determinate progress bar |
| | `Spinner` | Indeterminate loading spinner |
| | `Alert` | Inline notification message callout |
| | `EmptyState` | Informative empty data state with icon and action button |
| | `RoleEmptyState` | Permission-aware zero state for restricted pages |
| **Core** | `Calendar` | Interactive date and month picker calendar |
| | `DateRangePicker` | Two-date selection picker with presets |
| | `LanguageToggle` | Multi-language switcher toggle |
| | `Kbd` | Keyboard shortcut badge |

---

## Composite Components

### Button — Loading State

```tsx
import { Button } from "@umesh0492/react-libs";

<Button isLoading={isSubmitting} loadingText="Saving...">
  Save Changes
</Button>
<Button variant="destructive" isLoading={isDeleting}>
  Delete Record
</Button>
<Button variant="outline" size="sm">
  Refresh
</Button>
```

---

### ConfirmDialog

```tsx
import { useState } from "react";
import { ConfirmDialog } from "@umesh0492/react-libs";

export function DeleteDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await api.deleteItem();
    setLoading(false);
    setOpen(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title="Delete Item?"
      description="This action is permanent and cannot be undone."
      variant="destructive"
      confirmLabel="Delete"
      isLoading={loading}
      onConfirm={handleDelete}
    />
  );
}
```

---

### StatusBadge

```tsx
import { StatusBadge } from "@umesh0492/react-libs";

<StatusBadge status="pending" />
<StatusBadge status="confirmed" />
<StatusBadge status="delivered" />
<StatusBadge status="overdue_payment" />
<StatusBadge status="under_review" />
<StatusBadge status="rejected" size="sm" label="Rejected" />
```

---

### DataTable

```tsx
import { DataTable, StatusBadge, formatCurrency } from "@umesh0492/react-libs";

const columns = [
  { key: "id", header: "Order ID", sortable: true },
  { key: "customer", header: "Customer", cell: (row) => row.customer.name },
  { key: "amount", header: "Amount", cell: (row) => formatCurrency(row.amount) },
  { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
];

<DataTable
  columns={columns}
  data={orders}
  rowKey={(row) => row.id}
  isLoading={isLoading}
  emptyMessage="No orders found."
  pagination={{ page, pageSize: 20, total, onPageChange: setPage }}
/>
```

---

### PdfViewer (Client Subpath)

To prevent server-side rendering (SSR) crashes in Node.js environments caused by browser-only PDF workers (`pdfjs-dist`) or missing canvas/DOM APIs, `PdfViewer` is isolated in a dedicated client subpath:

```tsx
"use client";

import { PdfViewer } from "@umesh0492/react-libs/pdf";

export function InvoiceViewer() {
  return (
    <div className="h-[700px] w-full max-w-4xl border rounded-lg overflow-hidden">
      <PdfViewer
        url="/documents/invoice-1042.pdf"
        title="Invoice #1042"
        onLoadSuccess={({ numPages }) => console.log(`Loaded ${numPages} pages`)}
      />
    </div>
  );
}
```

> **Isolation Note**: `PdfViewer` is exported from `@umesh0492/react-libs/pdf` to keep browser-only PDF workers (`pdfjs-dist`) isolated from root imports, ensuring server-side rendering in Node.js, Next.js, and Remix does not crash on missing canvas or web worker APIs.

---

## Pluggable Behavioral Analytics

The library includes an enterprise behavioral analytics engine with automated DOM tracking, batching, offline resilience, and pluggable destination adapters:

```tsx
import {
  initAnalytics,
  ConsoleAdapter,
  trackEvent,
  AnalyticsProvider,
  useAnalytics,
} from "@umesh0492/react-libs/analytics";

// Initialize analytics globally
initAnalytics({
  autoTrackDom: true,
  batchSize: 10,
  flushIntervalMs: 5000,
  adapters: [new ConsoleAdapter()],
  globalMetadata: {
    environment: process.env.NODE_ENV,
  },
});

// Explicit event tracking
trackEvent("order_submitted", { orderId: "12345", total: 4999 });
```

---

## Hooks

```tsx
import { useDebounce, useLocalStorage, useIsMobile } from "@umesh0492/react-libs";
```

| Hook | Description |
|---|---|
| `useDebounce(value, delay)` | Debounces rapidly changing values before triggering expensive effects or API queries |
| `useLocalStorage<T>(key, default)` | Syncs state with browser `localStorage` and listens to cross-tab updates |
| `useIsMobile(breakpoint?)` | Detects whether the viewport width is below mobile threshold (< 768px by default) |

---

## Formatters

Deterministic formatters that automatically handle `null`, `undefined`, and `NaN` safely with placeholder fallbacks:

```tsx
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatWeight,
  formatQuantity,
  formatFileSize,
  formatPercent,
  formatLocalizedDate,
  formatLocalizedDateTime,
  formatLocalizedNumber,
} from "@umesh0492/react-libs";
```

| Formatter | Example Input | Output |
|---|---|---|
| `formatCurrency` | `123456.78` | `$123,456.78` |
| `formatDate` | `"2026-03-27"` | `27 Mar 2026` |
| `formatDateTime` | `"2026-03-27T14:32:00"` | `27 Mar 2026, 14:32` |
| `formatRelativeTime` | `yesterday` | `1d ago` |
| `formatWeight` | `12.5` | `12.5 kg` |
| `formatQuantity` | `150, "boxes"` | `150 boxes` |
| `formatFileSize` | `1234567` | `1.2 MB` |
| `formatPercent` | `0.856` | `85.6%` |
| `formatNumber` | `1234567` | `1,234,567` |

---

## Responsive Design

Components are designed mobile-first with adaptive layouts:
- Dialogs gracefully transform into bottom sheets (`Drawer`) on touch viewports.
- Data tables support horizontal scrollbars and responsive column hiding.
- Stepper navigations switch between horizontal and vertical layouts based on viewport width.

---

## Testing

The codebase maintains strict automated quality gates:

```bash
npm run test             # Vitest unit & interaction tests with coverage
npm run storybook        # Launch Storybook visual playground
npm run build-storybook  # Compile static Storybook bundle
npm run lint             # ESLint static code analysis
npx tsc --noEmit         # Full TypeScript compiler verification
npm run perf             # Generate performance benchmark report
```

---

## Publishing

Publishing to npm is automated via GitHub Actions on semantic tag pushes:

```bash
# 1. Bump version
npm version patch # or minor / major

# 2. Push commit and tag to trigger CI publish workflow
git push && git push --tags
```

### Manual Publishing
To build and publish manually:

```bash
npm run build
npm publish --access public
```

---

## Architecture & Accessibility

- **Radix UI Primitives**: Built upon headless, fully accessible primitives managing focus traps, ARIA attributes, and keyboard navigation according to WCAG 2.1 AA specifications. Automated regression tests via `axe-core` verify 0 violations across all interactive widgets.
- **SSR Compatibility**: Root UI components avoid top-level browser globals during module evaluation, guarding interactive code within client hooks and event handlers. Pure utilities in `@umesh0492/react-libs/utils` feature zero DOM and zero React dependencies for native Server Component execution. Browser-only components like `PdfViewer` reside in isolated client subpaths.
- **Dual ESM & CommonJS**: Full dual module support (`import` and `require`) with TypeScript declaration files (`.d.ts` and `.d.cts`) and subpath type mappings across modern module loaders, verified 100% clean with `@arethetypeswrong/cli`.
- **Domain Subpath Isolation**: Preserves all Indian compliance logic (`@umesh0492/react-libs/india`) while leaving the root package and `/utils` 100% pure and globally domain-neutral.
- **Static Zero-Runtime CSS Delivery**: CSS tokens and component styles compile into static stylesheets (`theme.css` and `dist/style.css`), eliminating runtime `<style>` injection and satisfying strict Content Security Policies (`CSP`).
- **Tree-Shaking**: Pure ES modules allow modern bundlers (Vite, Rollup, Webpack, Turbopack) to eliminate unused components and utilities from consumer bundles.

### Architecture Decision Records (ADRs)
Explore our formal design decisions in [`docs/adr/`](./docs/adr/):
- [ADR 0001: tsup and Dual Module (ESM/CJS) Publishing Architecture](./docs/adr/0001-tsup-and-dual-module-publishing.md)
- [ADR 0002: Peer vs Optional Dependencies and Dependency Surface Minimization](./docs/adr/0002-peer-vs-optional-dependencies.md)
- [ADR 0003: SSR & React Server Components (RSC) Purity Architecture](./docs/adr/0003-ssr-and-react-server-components-architecture.md)
- [ADR 0004: Accessibility Baseline and Automated WCAG Compliance](./docs/adr/0004-accessibility-baseline-and-wcag-compliance.md)
- [ADR 0005: Controlled vs Uncontrolled State and Ref Forwarding Convention](./docs/adr/0005-controlled-and-uncontrolled-component-convention.md)
- [ADR 0006: Domain Subpath Isolation Architecture (@umesh0492/react-libs/india)](./docs/adr/0006-domain-subpath-isolation-architecture.md)

---

## Community & Contributing

- **[Migration Guide](./MIGRATION.md)**: Upgrading from v0.4.x to v0.5.0.
- **[Code of Conduct](./CODE_OF_CONDUCT.md)**: We are committed to providing a friendly, safe, and welcoming environment for all contributors.
- **[Security Policy](./SECURITY.md)**: Guidelines for reporting security vulnerabilities responsibly.
- **[Contributing Guide](./CONTRIBUTING.md)**: Step-by-step instructions for adding components, writing tests, and filing pull requests.

## License

[MIT](./LICENSE) © Umesh Gupta
