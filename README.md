# @umesh0492/react-libs

> **Production-grade React 19 component library with Tailwind CSS v4 & Radix UI primitives.**  
> Single source of truth for visual components, design tokens, hooks, formatters, and behavioral analytics across web applications.

[![Version](https://img.shields.io/npm/v/@umesh0492/react-libs)](https://www.npmjs.com/package/@umesh0492/react-libs)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](#testing)
[![Coverage](https://img.shields.io/badge/coverage-%E2%89%A598%25-blue)](#testing)
[![React](https://img.shields.io/badge/react-19-blue)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/tailwind-v4-38bdf8)](https://tailwindcss.com)
[![Storybook](https://img.shields.io/badge/storybook-10.x-ff4785)](https://umesh0492.github.io/react-libs)

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start & Imports](#quick-start--imports)
   - [Subpath Reference Table](#subpath-reference-table)
   - [100% SSR Safety](#100-ssr-safety-in-nextjs-app-router-remix--node)
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

The library exposes dedicated entry points for UI components, server-safe utilities, client-only features, analytics, hooks, and stylesheets:

| Subpath / Export | Module Formats | SSR / RSC Safe | Purpose & Contents |
|---|---|---|---|
| `@umesh0492/react-libs` | ESM (`import`), CJS (`require`) | **100% SSR-Safe** (`'use client'`) | Primary UI component library (70+ components, primitives, forms, dialogs, charts, and hooks). |
| `@umesh0492/react-libs/utils` | ESM (`import`), CJS (`require`) | **100% RSC / Server-Safe** | Pure utilities, formatters, validators, masking, and `cn`. Zero DOM/React dependencies, safe in Next.js Server Components, Actions, and Edge workers. |
| `@umesh0492/react-libs/analytics` | ESM (`import`), CJS (`require`) | **100% SSR-Safe** | Pluggable behavioral analytics tracking engine, DOM auto-tracking, batching pipeline, and adapters. |
| `@umesh0492/react-libs/pdf` | ESM (`import`), CJS (`require`) | **Client-Only** (`'use client'`) | Dedicated client subpath for `PdfViewer`. Isolated from root to prevent Node SSR from executing browser-only PDF workers (`pdfjs-dist`). |
| `@umesh0492/react-libs/hooks/use-toast` | ESM (`import`), CJS (`require`) | **100% SSR-Safe** | Standalone imperative toast notification hook (`useToast`, `toast`). |
| `@umesh0492/react-libs/styles/theme.css` | CSS | N/A | Design system theme variables and color tokens for Tailwind CSS v4 projects (`@import`). |
| `@umesh0492/react-libs/dist/style.css` | CSS | N/A | Standalone pre-compiled stylesheet with all Tailwind utility classes and design tokens (for Tailwind v3, Vite, Webpack, or plain CSS). |

### 100% SSR Safety in Next.js App Router, Remix & Node

The primary package entry point (`@umesh0492/react-libs`) is engineered to be **100% SSR-safe**:
- **Zero Module-Level DOM Access**: No browser globals (`window`, `document`, `navigator`, `localStorage`) are evaluated during module evaluation or import.
- **Full Framework Compatibility**: Fully verified and compatible with **Next.js App Router** (React Server Components / RSC), Next.js Pages Router, **Remix**, **Gatsby**, **Astro**, and headless **Node.js** SSR environments.
- **Client Effects Isolation**: All interactive browser logic is securely scoped inside `useEffect` or client-side event handlers.

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
> **100% SSR-Safe**: Root `@umesh0492/react-libs` components and formatters are 100% SSR-safe in Next.js App Router (React Server Components), Remix, and Node.js server environments. Browser-only components such as `PdfViewer` are exported through dedicated client subpaths (`@umesh0492/react-libs/pdf`) to prevent server runtime issues.

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

> **Isolation Note**: `PdfViewer` is exported from `@umesh0492/react-libs/pdf` to keep the root `@umesh0492/react-libs` bundle 100% SSR-safe for Node.js, Next.js App Router, and Remix server runtimes.

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
| `formatCurrency` | `123456.78` | `₹1,23,456.78` |
| `formatDate` | `"2026-03-27"` | `27 Mar 2026` |
| `formatDateTime` | `"2026-03-27T14:32:00"` | `27 Mar 2026, 14:32` |
| `formatRelativeTime` | `yesterday` | `1d ago` |
| `formatWeight` | `12.5` | `12.5 kg` |
| `formatQuantity` | `150, "boxes"` | `150 boxes` |
| `formatFileSize` | `1234567` | `1.2 MB` |
| `formatPercent` | `0.856` | `85.6%` |
| `formatNumber` | `1234567` | `12,34,567` |

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

- **Radix UI Primitives**: Built upon headless, fully accessible primitives managing focus traps, ARIA attributes, and keyboard navigation according to WCAG 2.1 AA specifications.
- **100% SSR Safety**: The root package contains zero browser-global evaluation during module initialization, making it fully safe for Next.js App Router (React Server Components), Remix, and Node.js SSR environments. Browser-only components like `PdfViewer` reside in isolated client subpaths.
- **Dual ESM & CommonJS**: Full dual module support (`import` and `require`) with pre-configured TypeScript declaration maps (`.d.ts`).
- **Static Zero-Runtime CSS Delivery**: CSS tokens and component styles compile into static stylesheets (`theme.css` and `dist/style.css`), eliminating runtime `<style>` injection and satisfying strict Content Security Policies (`CSP`).
- **Tree-Shaking**: Pure ES modules allow modern bundlers (Vite, Rollup, Webpack, Turbopack) to eliminate unused components and utilities from consumer bundles.

---

## Community & Contributing

- **[Code of Conduct](./CODE_OF_CONDUCT.md)**: We are committed to providing a friendly, safe, and welcoming environment for all contributors.
- **[Security Policy](./SECURITY.md)**: Guidelines for reporting security vulnerabilities responsibly.
- **[Contributing Guide](./CONTRIBUTING.md)**: Step-by-step instructions for adding components, writing tests, and filing pull requests.

## License

[MIT](./LICENSE) © Umesh Gupta
