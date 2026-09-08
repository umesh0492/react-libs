# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2026-09-08

### ⚛️ React 19 Runtime Correctness & Hook Hygiene
- **`Calendar`**:
  - Extracted inline subcomponents (`MonthCaption`, `Weeks`, `Month`, `Chevron`) out of the `Calendar` render function to module scope, maintaining 100% referential stability across renders.
  - Implemented `CalendarContext` to pass dynamic navigation state without recreating subcomponent identities inside `components={{...}}`, completely eliminating unmount/remount churn and dropdown collapse on date selection.
  - Replaced render-time ref access with safe state management and filtered out non-DOM props.
- **`use-toast.ts`**:
  - Fixed SSR infinite render loop by returning a static singleton `SERVER_SNAPSHOT = { toasts: [] }` in `getServerSnapshot()`.
  - Fixed toast unmount leak by reducing `TOAST_REMOVE_DELAY` from `1000000` ms to standard `1000` ms.
  - Added `"use client"` directive.
- **`AnalyticsProvider`**:
  - Removed side-effectful `initAnalytics(config)` from lazy `useState` initializer and moved engine creation into `useEffect` with proper cleanup restoring monkey-patched history methods on unmount.
- **`use-local-storage.ts`**:
  - Moved `localStorage.setItem` and `window.dispatchEvent` outside the `setStoredValue` functional state updater callback, preventing "Cannot update a component while rendering a different component" warnings.
- **`use-mobile.tsx` & `use-debounce.ts`**:
  - Added `"use client"` directive to all custom hooks.
  - Refactored `useIsMobile` to use `React.useSyncExternalStore` with defensive SSR snapshot and window guards.
- **`Chart`**:
  - Completely eliminated `// @ts-nocheck` and fully typed `ChartConfig`, `ChartContainerProps`, `ChartTooltipContentProps`, and `ChartLegendContentProps`.
  - Guarded React key generation against Recharts functional `dataKey` values.
- **Micro No-ops & Typos**:
  - Fixed `data-[side=side=right]` typo in `tooltip.tsx`.
  - Fixed `bg-primary/8` invalid Tailwind step in `language-toggle.tsx`.
  - Fixed `ImageViewer` hanging in `isLoading: true` forever on cached images by checking `imgRef.current?.complete` on mount.

### 📦 Packaging, Dependencies & RSC Pure `/utils`
- **CSP Compliance in `export-utils.ts`**:
  - Completely purged `new Function('m', 'return import(m)')` dynamic eval indirection which violated strict Content Security Policies.
  - Switched to native browser Blob/URL downloads for CSV and native dynamic imports with graceful peer-dependency error messaging for optional `xlsx`, `jspdf`, and `jspdf-autotable`.
- **Pure RSC `@umesh0492/react-libs/utils`**:
  - Removed browser-dependent `export-utils.ts` from `/utils` entrypoint. The `/utils` subpath now exports *only* pure functions (`cn`, formatters, validators, masking) with zero DOM/window/Blob access, 100% safe in Node.js and Edge workers.
  - Kept export utilities accessible from the main root entry (`@umesh0492/react-libs`).
- **Package Size Optimization**:
  - Excluded sourcemaps (`dist/**/*.map`) from npm packaging via `.npmignore` and `package.json` `files`, reducing unpacked size by >50% (3.3 MB → 1.6 MB) and tarball size to ~300 kB.
- **Cleaned Stale Files**:
  - Removed leftover tracked files (`lint-output.txt`, `lint_results.txt`, `test_output.txt`).

### ♿ Accessibility (a11y) & Automated axe-core Verification
- **`MultiSelect`**:
  - Replaced hardcoded static id with `React.useId()`-generated IDs.
  - Full ARIA combobox pattern (`aria-expanded`, `aria-controls`, `aria-activedescendant`).
  - Full keyboard navigation (ArrowDown, ArrowUp, Enter, Space, Escape focus restoration).
  - Extended HTML attributes with ref forwarding and uncontrolled mode support.
- **`FileUpload`**:
  - Added `aria-live="polite"` live announcements for upload status and errors.
  - Resolved WCAG nested interactive controls by decoupling `<input type="file">` from the clickable dropzone.
- **Custom SVG Gauges**:
  - `MatchScoreGauge`: Added `role="meter"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `<title>`.
  - `ProgressRing`: Added `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `<title>`.
  - `RadarSweep`: Added `role="img"` with accessible status label.
- **Table & Motion Accessibility**:
  - `DataTable`: Wrapped sortable column headers in accessible `<button type="button">`, added `aria-sort`, `aria-busy`, optional `caption`, and `forwardRef`.
  - `MetricTicker`: Added `@media (prefers-reduced-motion: reduce)` support and pause-on-hover / pause-on-focus.
  - `Stepper`: Added `aria-current="step"`.
  - `CopyButton`: Added `aria-live="polite"` screen reader announcements.
- **Automated Accessibility Testing**:
  - Created `accessibility.test.tsx` using `axe-core` to assert 0 accessibility violations across key components.

### 🏗️ Component Architecture, `forwardRef` & Error Boundaries
- **`ErrorBoundary` Component**:
  - Added production-grade `ErrorBoundary` component with fallback UI, error reporting (`onError`), reset callbacks (`onReset`), `resetKeys`, and `withErrorBoundary` HOC.
  - Integrated `ErrorBoundary` directly into `PdfViewer` and `ChartContainer`.
- **Systematic `forwardRef` Support**:
  - Added `React.forwardRef` to composite components: `DataTable`, `Field` (all 10 subcomponents), `Combobox`, `Sidebar` (all subcomponents), `Stepper`, and `DatePickerWithRange`.
  - Updated `withAuditTrail` telemetry HOC to forward refs instead of dropping them.
- **Controlled & Uncontrolled Flexibility**:
  - Added uncontrolled state support with `defaultValue` to `Combobox`, `MultiSelect`, and `FileUpload`.
- **`DatePickerWithRange` Identity Fix**:
  - Implemented value-based date range comparison to prevent active date selections from being wiped when parent re-renders pass a new `defaultDate` reference.

### 🌐 Domain Neutralization & Genericization
- **`BilingualTooltip`**:
  - Completely purged hardcoded Hindi dictionary and domain-specific acronyms (`Actual DPO`, `GMV`, `Awarded Price`, `Share of Spend`).
  - Removed hardcoded ₹ Crore / Lakh currency formatting.
  - Introduced configurable `dictionary`, `translations`, `labelMap`, `locale` (default: `"en-US"`), and `currencySymbol` (default: `"$"`), enabling universal bilingual chart tooltips without domain lock-in.
- **`indiaLocations.ts`**:
  - Genericized regional data structures with new reusable interfaces (`RegionState`, `RegionCity`, `RegionOption`).
  - Added generic helper functions (`filterCitiesByState`, `toStateOptions`, `toCityOptions`) to build cascade dropdowns for any administrative division.
  - Documented as an optional regional reference dataset for Indian geographies, preserving 100% backwards compatibility for `INDIA_STATES` and `INDIA_CITIES`.
- **Composite Cards Genericization**:
  - **`ProofOfWorkCard`**: Removed dead `onOpen` prop. Added support for custom `metricLabel`, `maxScore`, `linkLabel`, and custom `icon`. Exported universal `MetricVerificationCard` alias for general credential, compliance, and metric verification cards.
  - **`PipelineKanban`**: Fixed invalid arbitrary Tailwind classes (`py-0.2` → `py-0.5`, `border-l-3` → `border-l-[3px]`). Properly honored explicit `col.count` with fallback to `col.items.length`. Added customizable card `scoreLabel` and empty state messaging.
  - **`QuotaCard`**: Replaced hardcoded `"Unlocks"` default with generic `"units"`. Added customizable `formatPercentage` callback, custom `description` node, and custom action button icon.
  - **`SalaryRangeDisplay`**: Replaced hardcoded `"₹"` and Lakhs `"L"` formatting with configurable `currencySymbol` (default `"$"`), customizable `unit`, and `period` (default `"yr"`). Added generic `MetricRangeBreakdownItem` support and exported universal `MetricRangeDisplay` alias.

### ⚡ Code Quality & Refactoring
- **`success-micro-interaction.tsx`**:
  - Deduplicated repeated interval timers across `triggerSuccessConfetti`, `triggerEmeraldConfetti`, and `triggerGovernanceConfetti` into a clean, unified `runConfettiAnimation` engine.

### 📚 Truthful Documentation & Quality Gates
- **`README.md`**:
  - Replaced fabricated static badge (`coverage-≥98%`) with truthful coverage threshold (`coverage-≥75%`).
  - Replaced "100% SSR-Safe" marketing overstatements with accurate descriptions of client components, hydration guards, and isolated browser-only subpaths.
  - Corrected false declaration map claims to accurately reflect TypeScript `.d.ts` and `.d.cts` output.
  - Clarified that `@umesh0492/react-libs/utils` provides pure helper functions with zero DOM and zero React dependencies.
- **`CHANGELOG.md`**:
  - Corrected false package size claims with verified `npm pack --dry-run` measurements (300.2 kB tarball / 1.6 MB unpacked across 31 files).
- **`test.md`**:
  - Overhauled test counts and coverage statistics to reflect the verified suite: 123 test files, 779 passing tests, zero failures, and realistic coverage thresholds.

---

## [0.4.0] - 2026-09-08

### 🚀 React Server Components (RSC) Architecture & Dedicated Subpaths
- **Dedicated `@umesh0492/react-libs/utils` Subpath**: Introduced pure utility entrypoint exporting `cn`, formatters (`formatCurrency`, `formatDate`, etc.), validators (`isValidEmail`, `isValidPhone`, etc.), and masking utilities. Zero DOM or React hook dependencies.
- **RSC Dual-Bundle Isolation**: Configured dual `tsup` compilation pipelines. Client UI components are tagged with the `'use client';` directive, while `@umesh0492/react-libs/utils` and `@umesh0492/react-libs/analytics` are compiled without directives, allowing pure functions to execute safely inside Next.js Server Components, Server Actions, Route Handlers, and Edge runtimes.
- **Full TypeScript Export Matrix**: Added `./utils` to `package.json` `"exports"` and `"typesVersions"`. Fully verified with `@arethetypeswrong/cli` with zero errors across `node10`, `node16 (cjs)`, `node16 (esm)`, and `bundler`.

### 🌐 Open-Source Domain & Brand Neutralization
- **Repository-Wide Brand Neutrality**: Completely eliminated all references and dependencies to proprietary projects (`Vendor Portal`, `Inventory`, `DeliverIT`, `Momentum`, `UrbanHarvest`).
- **Agnostic SaaS Mock Data**: Neutralized all fixtures and storybook examples across 15+ stories (`DataTable`, `Table`, `Card`, `ScrollArea`, `Sheet`, `Drawer`, `ContextMenu`, `AlertDialog`, `Dialog`, `Breadcrumb`, `Sonner`, `Chart`, `Carousel`, `PaymentLedger`) with universal enterprise fixtures (`Acme Corporation`, `Globex Industries`, `INV-*`, `REC-*`).
- **Internal Alias Eradication**: Replaced legacy internal monorepo aliases (`@ui/...`) in `WIKI.md`, `CONTRIBUTING.md`, and `Introduction.stories.tsx` with standard package imports (`@umesh0492/react-libs`).
- **Storage Sanitization**: Cleaned proprietary storage credential keys in `blob-storage.ts` (`dit_base_url` → generic storage config) and added SSR guards to `downloadFileFromStorage`.
- **PaymentLedger Compatibility**: Added generic `reference_id`, `reference_number`, and `onReferenceClick` props alongside legacy `grn_*` properties for complete backwards compatibility.

### 🛡️ CI/CD & Supply Chain Provenance Hardening
- **SLSA Provenance Attestation**: Enabled `--provenance` in `.github/workflows/publish.yml` and configured `"publishConfig": { "access": "public", "provenance": true }` in `package.json` for cryptographic build and package attestations on npm.
- **Automated Type Matrix Gate**: Added `@arethetypeswrong/cli` check to `.github/workflows/ci.yml` to prevent type resolution regressions across modern module loaders.
- **Comprehensive Test Gate**: Upgraded CI to execute the full Vitest test suite with strict coverage enforcement on every push.

### 📚 Documentation
- **React 18 & 19 Peer Dependencies**: Documented dual compatibility with React 18.2+ and React 19.x in `README.md`.
- **Server Components Guide**: Added RSC and Server Action usage documentation for `@umesh0492/react-libs/utils`.
- **Complete Wiki Recipes**: Standardized all component cookbook examples in `WIKI.md` to public package imports.

---

## [0.3.0] - 2026-09-07

### 🔒 Security & Bug Fixes
- **CSV Formula Injection Sanitization**: Neutralized spreadsheet macro injections (`=`, `+`, `-`, `@`, `\t`, `\r`) in `src/lib/export-utils.ts` by prefixing single-quotes and stripping leading tabs/returns.
- **Object URL Memory Leaks**: Added automatic `URL.revokeObjectURL()` cleanup in `FileUpload` (on file removal & unmount) and `PdfViewer` (print iframe cleanup & blob disposal).
- **React 19 Stale Closures in `useLocalStorage`**: Refactored `setValue` to use functional state updaters (`setStoredValue((prev) => ...)`), decoupling it from `storedValue` and stabilizing callback identities.
- **AsyncSelect Label Coercion**: Prevented JSX label objects from being coerced to `"[object Object]"` in input search query; safely fall back to `getOptionStringValue` or option value.
- **Global Event Listener Hygiene**: Restricted outside-click listener in `AsyncSelect` to attach only while dropdown is open (`open === true`).
- **Form Submission Traps**: Added explicit `type="button"` on all interactive buttons across `DataTablePagination`, `ActiveFilterBadge`, and `MultiSelect` to prevent unintentional form submissions when embedded in forms.

### 🎨 Design Tokens & Theming (Tailwind CSS v4)
- **Design Token Compliance**: Registered `--color-button-outline` and `--color-badge-outline` in `@theme inline` in `theme.css`.
- **Button & Badge Variants**: Replaced invalid CSS arbitrary variable properties (`[border-color:var(--button-outline)]`) with semantic utility classes (`border-button-outline` and `border-badge-outline`).
- **Elevation Utilities**: Added `.hover-elevate` and `.active-elevate-2` utility classes in `theme.css`.
- **CSS Runtime Side-Effects Elimination**: Migrated Radix UI keyframes and state animations into static `theme.css`, eliminating runtime `document.head.appendChild` mutations and complying with strict Content Security Policies (`CSP`).
- **Dark Mode Remediation**: Eliminated hardcoded `bg-white` and `slate-*` palettes across `DataTablePagination`, `AsyncSelect`, `RoleEmptyState`, and `ActiveFilterBadge`, adopting semantic theme tokens (`bg-card`, `bg-popover`, `border-border`, `text-foreground`, `text-muted-foreground`).

### ♿ Accessibility (a11y)
- **DataTable Accessible Sorting**: Added `tabIndex={0}`, keyboard triggering (`Enter` / `Space`), `aria-sort` (`ascending` | `descending` | `none`), and focus-visible rings to table headers.
- **Pagination**: Replaced anchor anti-patterns (`<a href="#">`) with polymorphic `<button type="button">` or valid links, and stabilized map keys.
- **Form Control DescribedBy**: Enabled external `aria-describedby` merging with internal form item IDs.

### 📦 Build & Packaging
- **GitHub Actions CI**: Updated `.github/workflows/ci.yml` from non-existent action versions to stable `actions/checkout@v4` and `actions/setup-node@v4`.
- **Tree-Shaking & Side Effects**: Configured `"sideEffects": ["*.css", "**/*.css"]` in `package.json`.
- **Tarball Optimization**: Excluded `__tests__`, `.stories.tsx`, test fixtures, and scripts from distributed npm package files, producing a clean distribution tarball of ~300 kB (unpacked ~1.6 MB across 36 files).

---

## [0.2.0] - 2026-08-25

### 🚀 Feature Enhancements
- **Enhanced Export Utils**: Added multi-format data export utilities (CSV, Excel, PDF) with typed column mapping.
- **Telemetry Provider**: Integrated lightweight frontend observability and telemetry tracking wrapper.
- **Design System Extensions**: Added additional layout cards (`AmountSummaryCard`, `ProofOfWorkCard`, `LineItemsCard`).

---

## [0.1.0] - 2026-08-19

### 🚀 Enterprise Component Suite Expansion

Added 7 high-impact enterprise UI primitives complete with full TypeScript typings, comprehensive unit tests, Storybook stories, and WCAG accessibility standards:

- **`FileUpload`**: Drag-and-drop dropzone with file size/type validation, thumbnails, and multi-file removal.
- **`MultiSelect`**: Searchable tag selector with removable chip badges and overflow limit count.
- **`Stepper`**: Multi-step process workflow indicator with horizontal and vertical orientations.
- **`KPICard`**: Executive KPI metric card with percentage trend indicator badges and icon slots.
- **`Timeline`**: Vertical activity and audit log feed with connecting lines and status marker variants.
- **`CopyButton`**: Accessible one-click clipboard copy utility with animated checkmark feedback.
- **`Banner`**: System-wide notification announcement bar with action CTA and dismiss controls.

---

## [0.0.2] - 2026-08-19

### 🚀 Initial Open-Source Release

Official initial release of **`@umesh0492/react-libs`** — a production-grade React 19 component library engineered with Tailwind CSS v4 design tokens and Radix UI headless primitives.
