# @umesh0492/react-lib

> **The shared UI component library for enterprise procurement portals.**  
> Single source of truth for all visual components, design tokens, hooks, and formatters across web portals.

[![Version](https://img.shields.io/badge/version-1.0.42-green)](./package.json)
[![Tests](https://img.shields.io/badge/tests-828%20passing-brightgreen)](#testing)
[![Coverage](https://img.shields.io/badge/coverage-99%25-blue)](#test-coverage)
[![React](https://img.shields.io/badge/react-19-blue)](https://react.dev)
[![Storybook](https://img.shields.io/badge/storybook-10.x-ff4785)](http://localhost:6006)

---

## Table of Contents

1. [Installation](#installation)
2. [Setup & Aliases](#setup--aliases)
3. [Design Tokens (Theme)](#design-tokens-theme)
4. [Component Reference](#component-reference)
5. [Composite Components](#composite-components)
6. [Hooks](#hooks)
7. [Formatters](#formatters)
8. [Responsive Design](#responsive-design)
9. [Testing](#testing)
10. [Performance](#performance)
11. [Publishing](#publishing)
12. [Architecture Notes](#architecture-notes)

---

## Installation

This package is published privately to **GitHub Packages**.

**`.npmrc`** (required in every consuming project):
```ini
@umesh0492:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GH_PACKAGE_TOKEN}
```

> **Note:** Use `GH_PACKAGE_TOKEN` — not `GITHUB_TOKEN`. Set it as a repo secret in GitHub Actions and as a local env var for manual publishing.

```bash
npm install @umesh0492/react-lib@latest
```

**Local development** (symlink):
```json
// package.json of consuming app
"@umesh0492/react-libs": "../react-lib"
```

---

## Setup & Aliases

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@ui/*": ["./node_modules/@umesh0492/react-libs/src/components/ui/*"]
    }
  }
}
```

### `vite.config.ts`
```typescript
import path from "path"
export default defineConfig({
  resolve: {
    alias: {
      "@ui": path.resolve(import.meta.dirname,
        "node_modules/@umesh0492/react-libs/src/components/ui"),
    }
  }
})
```

---

## Design Tokens (Theme)

All color, spacing, font, and radius tokens live in **one canonical file**:

```
react-lib/src/styles/theme.css
```

Each consuming app imports it — no duplication:

```css
/* src/index.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "../node_modules/@umesh0492/react-libs/src/styles/theme.css";
```

### Brand Colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `hsl(142 76% 36%)` | `hsl(142 71% 45%)` | Brand green — buttons, links, active states |
| `--destructive` | `hsl(0 84% 60%)` | `hsl(0 63% 31%)` | Danger/delete actions |
| `--muted` | `hsl(210 40% 96%)` | `hsl(217 33% 18%)` | Backgrounds, disabled states |
| `--border` | `hsl(214 32% 91%)` | `hsl(217 33% 18%)` | Component borders |
| `--accent` | `hsl(210 40% 96%)` | `hsl(217 33% 18%)` | Hover highlights |

### Multi-Brand Theming

Apply `.theme-orange` to switch to orange branding for accent surfaces:
```tsx
<div className="theme-orange">
  <Button>Accent Action</Button>   {/* renders in orange */}
</div>
```

---

## Component Reference

> Full visual examples: [WIKI.md](./WIKI.md) · Live playground: http://localhost:6006

Import from the package root or directly via alias:
```tsx
import { Button, Badge, Card, Dialog } from "@umesh0492/react-libs"
// OR via alias:
import { Button } from "@ui/forms/button"
```

### All Components (70+)

| Domain | Component | Import Path | Notes |
|---|---|---|---|
| **Forms** | `Button` | `@ui/forms/button` | `isLoading`, `loadingText`, all variants |
| | `Input` | `@ui/forms/input` | Controlled, uncontrolled |
| | `FileUpload` | `@ui/forms/file-upload` | Drag-and-drop, previews, multi-file validation |
| | `MultiSelect` | `@ui/forms/multi-select` | Searchable tag picker with chip badges |
| | `Textarea` | `@ui/forms/textarea` | Auto-resize support |
| | `Select` | `@ui/forms/select` | `SelectTrigger`, `SelectContent`, `SelectItem` |
| | `AsyncSelect` | `@ui/forms/async-select` | Debounced async search select |
| | `FilterSelect` | `@ui/forms/filter-select` | Searchable select for filter bars |
| | `Checkbox` | `@ui/forms/checkbox` | Accessible, indeterminate state |
| | `RadioGroup` | `@ui/forms/radio-group` | `RadioGroupItem` |
| | `Switch` | `@ui/forms/switch` | Toggle with label |
| | `Toggle` | `@ui/forms/toggle` | Single pressed state |
| | `ToggleGroup` | `@ui/forms/toggle-group` | Single / multi select |
| | `Slider` | `@ui/forms/slider` | Range input |
| | `Form` | `@ui/forms/form` | react-hook-form integration |
| | `Label` | `@ui/forms/label` | Accessible form label |
| | `InputGroup` | `@ui/forms/input-group` | Left/right adornment input |
| | `ButtonGroup` | `@ui/forms/button-group` | Grouped button row |
| **Data Display** | `Badge` | `@ui/data-display/badge` | `default`, `secondary`, `destructive`, `outline` |
| | `KPICard` | `@ui/data-display/kpi-card` | Metric card with trend percentage indicator |
| | `Timeline` | `@ui/data-display/timeline` | Vertical activity and audit log feed |
| | `StatusBadge` | `@ui/data-display/status-badge` | 30+ procurement statuses |
| | `ActiveFilterBadge` | `@ui/data-display/active-filter-badge` | Dismissable filter chip |
| | `Avatar` | `@ui/data-display/avatar` | Image + fallback initials |
| | `Card` | `@ui/data-display/card` | `CardHeader`, `CardContent`, `CardFooter` |
| | `DataTable` | `@ui/data-display/data-table` | Sort, skeleton, pagination, empty state |
| | `Table` | `@ui/data-display/table` | Primitive table parts |
| | `Chart` | `@ui/data-display/chart` | Recharts wrapper with theming |
| | `Accordion` | `@ui/data-display/accordion` | Collapsible sections |
| | `Collapsible` | `@ui/data-display/collapsible` | Simple show/hide |
| | `Carousel` | `@ui/data-display/carousel` | Embla-based slider |
| **Layout** | `PageHeader` | `@ui/layout/page-header` | Consistent page title + actions |
| | `Card` | `@ui/layout/card` | Surface container |
| | `Separator` | `@ui/layout/separator` | HR divider |
| | `ScrollArea` | `@ui/layout/scroll-area` | Custom scrollbar container |
| | `AspectRatio` | `@ui/layout/aspect-ratio` | Fixed ratio wrapper |
| | `ResizablePanelGroup` | `@ui/layout/resizable` | Drag-to-resize panels |
| **Overlays** | `Dialog` | `@ui/overlays/dialog` | Modal — always use this, no custom modals |
| | `AlertDialog` | `@ui/overlays/alert-dialog` | Destructive confirmation |
| | `ConfirmDialog` | `@ui/overlays/confirm-dialog` | Reusable confirm with loading |
| | `Sheet` | `@ui/overlays/sheet` | Slide-in panel drawer |
| | `Popover` | `@ui/core/popover` | Floating content |
| | `HoverCard` | `@ui/overlays/hover-card` | Hover preview |
| | `Tooltip` | `@ui/overlays/tooltip` | Hover label |
| | `DropdownMenu` | `@ui/overlays/dropdown-menu` | Contextual menu |
| | `ContextMenu` | `@ui/overlays/context-menu` | Right-click menu |
| | `Command` | `@ui/overlays/command` | Command palette (cmdk) |
| | `Drawer` | `@ui/overlays/drawer` | Bottom sheet (vaul) |
| **Navigation** | `Sidebar` | `@ui/navigation/sidebar` | App sidebar with collapse |
| | `Stepper` | `@ui/navigation/stepper` | Horizontal & vertical progress workflow |
| | `NavigationMenu` | `@ui/navigation/navigation-menu` | Top nav with dropdowns |
| | `Breadcrumb` | `@ui/navigation/breadcrumb` | Page hierarchy trail |
| | `Tabs` | `@ui/navigation/tabs` | Tab navigation |
| | `Menubar` | `@ui/navigation/menubar` | App menubar (File/Edit style) |
| | `Pagination` | `@ui/navigation/pagination` | Page navigation |
| **Feedback** | `Banner` | `@ui/feedback/banner` | System announcement banner with CTA & dismiss |
| | `CopyButton` | `@ui/feedback/copy-button` | 1-click copy with checkmark feedback |
| | `Toast/Toaster` | `@ui/feedback/toast` | Notification system |
| | `Sonner` | `@ui/feedback/sonner` | Sonner toast alternative |
| | `Skeleton` | `@ui/feedback/skeleton` | Loading placeholder |
| | `SkeletonList` | `@ui/feedback/skeleton-list` | Multi-row skeleton |
| | `Progress` | `@ui/feedback/progress` | Linear progress bar |
| | `Spinner` | `@ui/feedback/spinner` | Loading spinner |
| | `Alert` | `@ui/feedback/alert` | Inline alert message |
| | `EmptyState` | `@ui/feedback/empty-state` | Zero-results placeholder |
| | `RoleEmptyState` | `@ui/feedback/role-empty-state` | Permission-aware empty state |
| **Core** | `Calendar` | `@ui/core/calendar` | Date picker calendar |
| | `DateRangePicker` | `@ui/core/date-range-picker` | From/to date selection |
| | `LanguageToggle` | `@ui/core/language-toggle` | EN/HI switcher |
| | `Kbd` | `@ui/core/kbd` | Keyboard shortcut display |

---

## Composite Components

### Button — Loading State

```tsx
import { Button } from "@ui/forms/button"

<Button isLoading={isSubmitting} loadingText="Saving...">Save Changes</Button>
<Button variant="destructive" isLoading={isDeleting}>Delete</Button>
<Button variant="outline" isLoading={isFetching} size="sm">Refresh</Button>
```

**Props:** `variant` (`default` | `destructive` | `outline` | `ghost` | `secondary` | `link`), `size` (`sm` | `default` | `lg` | `icon`), `isLoading`, `loadingText`, `asChild`, all native button attrs.

---

### ConfirmDialog

```tsx
import { ConfirmDialog } from "@ui/overlays/confirm-dialog"

<ConfirmDialog
  open={showDelete}
  onOpenChange={setShowDelete}
  title="Delete Purchase Order?"
  description="This will permanently remove PO-2024-001. This cannot be undone."
  variant="destructive"
  confirmLabel="Delete PO"
  isLoading={isDeleting}
  onConfirm={handleDelete}
/>
```

**Props:** `open`, `onOpenChange`, `title`, `description?`, `confirmLabel?` (default: `"Confirm"`), `cancelLabel?`, `variant?`, `isLoading?`, `onConfirm`.

---

### StatusBadge

```tsx
import { StatusBadge } from "@ui/data-display/status-badge"

<StatusBadge status="pending" />           // → 🟡 Pending
<StatusBadge status="confirmed" />         // → 🔵 Confirmed
<StatusBadge status="delivered" />         // → 🟢 Delivered
<StatusBadge status="overdue_payment" />   // → 🔴 Overdue
<StatusBadge status="under_review" />      // → 🟣 Under Review
<StatusBadge status="rejected" size="sm" label="PO Rejected" />
```

**30+ statuses:** `pending`, `active`, `inactive`, `draft`, `completed`, `cancelled`, `rejected`, `approved`, `in_progress`, `overdue`, `on_hold`, `confirmed`, `dispatched`, `delivered`, `partially_delivered`, `returned`, `paid`, `unpaid`, `overdue_payment`, `partially_paid`, `accepted`, `partially_accepted`, `grn_pending`, `open`, `closed`, `awarded`, `expired`, `under_review`, `resolved`, `escalated`, `uploaded`, `verified`, `expired_doc`

---

### PageHeader

```tsx
import { PageHeader } from "@ui/layout/page-header"

<PageHeader
  title="Purchase Orders"
  description="Manage and track all active purchase orders"
  badge={<StatusBadge status="active" size="sm" />}
  breadcrumbs={<Breadcrumb>...</Breadcrumb>}
  actions={
    <>
      <Button variant="outline" size="sm"><Download /> Export</Button>
      <Button><Plus /> Create PO</Button>
    </>
  }
/>
```

---

### DataTable

```tsx
import { DataTable } from "@ui/data-display/data-table"

const columns = [
  { key: "poNumber", header: "PO #", sortable: true },
  { key: "partner",   header: "Partner", cell: (row) => row.partner.name },
  { key: "amount",   header: "Amount", cell: (row) => formatCurrency(row.amount) },
  { key: "status",   header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
]

<DataTable
  columns={columns}
  data={orders}
  rowKey={(row) => row.id}
  isLoading={isLoading}
  emptyMessage="No purchase orders found."
  sortKey={sortKey}
  sortDirection={sortDir}
  onSort={(key, dir) => { setSortKey(key); setSortDir(dir) }}
  onRowClick={(row) => navigate(`/orders/${row.id}`)}
  pagination={{ page, pageSize: 20, total, onPageChange: setPage }}
/>
```

---

## Hooks

```tsx
import { useDebounce, useLocalStorage, useIsMobile } from "@umesh0492/react-libs"
```

| Hook | Usage |
|---|---|
| `useDebounce(value, delay)` | Debounce search input before API call |
| `useLocalStorage<T>(key, default)` | Persist state across page reloads, syncs across tabs |
| `useIsMobile()` | Returns `true` when viewport < 768px |

---

## Formatters

```tsx
import {
  formatCurrency, formatNumber,
  formatDate, formatDateTime, formatRelativeTime,
  formatWeight, formatQuantity, formatFileSize, formatPercent,
  formatLocalizedDate, formatLocalizedDateTime, formatLocalizedNumber,
} from "@umesh0492/react-libs"
```

| Function | Example Output |
|---|---|
| `formatCurrency(123456.78)` | `₹1,23,456.78` |
| `formatDate("2026-03-27")` | `27 Mar 2026` |
| `formatDateTime("2026-03-27T14:32:00")` | `27 Mar 2026, 14:32` |
| `formatRelativeTime(yesterday)` | `1d ago` |
| `formatWeight(12.5)` | `12.5 kg` |
| `formatQuantity(150, "boxes")` | `150 boxes` |
| `formatFileSize(1234567)` | `1.2 MB` |
| `formatPercent(0.856)` | `85.6%` |
| `formatNumber(1234567)` | `12,34,567` |

All formatters return `"—"` for `null` / `undefined` / `NaN` — safe to use directly in JSX.

### Localized Formatters (i18n — EN/HI)

```tsx
const { language } = useLanguage() // "en" | "hi"

formatLocalizedDate("2026-03-27", language)
// en → "27 Mar 2026" · hi → "२७ मार्च २०२६"

formatLocalizedDateTime("2026-03-27T14:32:00Z", language)
// en → "27 Mar 2026, 2:32 PM" · hi → "२७ मार्च २०२६, 2:32 pm"

formatLocalizedNumber(1234567, language)
// en → "12,34,567" · hi → "१२,३४,५६७"
```

---

## Responsive Design

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| `PageHeader` | Title wraps, actions stack below | Side-by-side | Full layout |
| `DataTable` | Horizontal scroll, "Page X/N" | Page buttons visible | Full pagination row |
| `ConfirmDialog` | Full-width, buttons stack | Centered modal | Centered modal |
| `Button` | 44px min touch target | Standard | Standard |
| `Sidebar` | Collapses to Sheet overlay | Icon-only | Full labels |

---

## Testing

```bash
npm run test          # Vitest unit tests + Storybook interaction tests (Chromium)
npm run storybook     # Visual playground at localhost:6006 (runs tests first)
npm run build-storybook  # Production static Storybook build
npm run perf          # Generate docs/performance-report.md + Storybook dashboard data
```

### Coverage (as of v1.0.25)

| Domain | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| **All files** | ≥98.7% ✅ | ≥98.2% ✅ | ≥98.7% ✅ | ≥98.7% ✅ |
| `navigation` | 100% | 100% | 100% | 100% |
| `overlays` | 100% | 100% | 100% | 100% |
| `layout` | 100% | 100% | 100% | 100% |
| `lib` | 100% | 100% | 100% | 100% |
| `data-display` | 98.7% | 98.7% | 98.7% | 98.7% |

> Full patterns documented in [test.md](./test.md).

---

## Performance

```bash
npm run perf          # Run benchmarks — outputs docs/performance-report.md
npm run perf:open     # Run + open report in system viewer
```

View the live dashboard in Storybook: **Docs → Performance Dashboard**.

| Metric | Value (v1.0.25) |
|---|---|
| P50 (median) | ~6.3ms |
| P95 | ~305.8ms |
| P99 | ~893.6ms |
| Total suite wall time | ~18.8s |

---

## Publishing

CI auto-publishes on tag push (`v*`):

```bash
# Bump version:
npm version patch   # 1.0.19 → 1.0.20
git add package.json package-lock.json
git commit -m "chore: bump react-lib to 1.0.20"
git tag v1.0.20
git push && git push --tags

# Manual publish (requires GH_PACKAGE_TOKEN):
export GH_PACKAGE_TOKEN=ghp_xxxx
npm publish
```

After publishing, update consuming apps:
```bash
npm install @umesh0492/react-lib@1.0.42
```

---

## Architecture Notes

### Why no custom modals?
`@ui/overlays/dialog` manages its own background overlay, animations, portal, and focus trap via Radix. Building custom modals bypasses all of this and breaks accessibility.

### Why hardcoded bg colors in overlays?
CSS custom properties (`--popover`, `--background`) resolve from `@theme inline` blocks — these aren't processed in consumers' contexts. We hardcode explicit background colors to guarantee opacity in all environments.

### Dialog / Overlay Rule
**Always use `@ui/overlays/dialog`** — never build custom modals.

### Storybook Interaction Tests
All story `play()` functions are run against real Chromium via `@storybook/addon-vitest`. Portal-rendered components (Tooltip, Popover, Sheet, etc.) must be queried via `within(document.body)` — see [test.md](./test.md) for full patterns.
