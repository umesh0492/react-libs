# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- **Tarball Optimization**: Excluded `__tests__`, `.stories.tsx`, test fixtures, and scripts from distributed npm tarball, reducing package size from 281 kB to 117 kB (~60% reduction).

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
