# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2026-09-11

### Added
- Dedicated client subpaths `@umesh0492/react-libs/button`, `@umesh0492/react-libs/dialog`, `@umesh0492/react-libs/card`, `@umesh0492/react-libs/badge`, `@umesh0492/react-libs/input` (`Button`, `Dialog`, `Card`, `Badge`, `Input`) for fine-grained per-component tree-shaking with dual ESM/CJS exports and TypeScript definitions.
- Automated per-entry bundle size verification budgets in `scripts/check-bundle-size.mjs` ensuring component subpaths remain under strict budgets (`dist/button.js` <= 15 KB raw, measured 2.55 KB raw).
- Dedicated client subpath `@umesh0492/react-libs/analytics/react` (`AnalyticsProvider`, `useAnalytics`, `TrackArea`, `PageViewTracker`) with explicit `'use client'` directive boundary.
- Pure headless domain isolation for `@umesh0492/react-libs/analytics` with zero React hooks, zero client directives, and full server runtime safety.

### Changed
- Isolated `window.history.pushState` and `window.history.replaceState` monkey-patching in `AnalyticsEngine` behind explicit opt-in (`patchHistory: true`, defaults to `false`) with full method restoration and event listener cleanup upon `destroy()`.
- Configured Storybook a11y parameters to `a11y: { test: 'error' }` in `.storybook/preview.ts` to block on accessibility violations.
- Documented `src/components/ui/__tests__/accessibility.test.tsx` (automated `axe-core` suite) as the blocking CI gate for accessibility compliance.
- Expanded `src/__tests__/ssr-smoke.test.tsx` to systematically verify server-side rendering and module directive boundaries across all `package.json` `exports` entries.
- Streamlined Vitest runner concurrency (`maxWorkers: 2`) and removed redundant `prestorybook` test execution.

### Fixed
- Migrated all hardcoded slate and indigo color classes in `AmountSummaryCard` to semantic design tokens (`text-muted-foreground`, `text-primary`, `border-border`, `bg-card`, `bg-destructive`).
- Stabilized `AnalyticsProvider` configuration equality: adapter comparison by name and stable `onError` callback reference to eliminate recreation churn.
- Eliminated state updates during render in `AnalyticsProvider` to prevent React render loops and cascading updates.
- Documented `SidebarProvider` SSR hydration contract requiring `defaultOpen` to read server cookies to prevent client hydration mismatch.

## [0.1.0] - 2026-09-09
Initial public release.

### Added
- 50+ accessible Tailwind UI components (buttons, dialogs, dropdowns, forms, layout, data display)
- Modern DataTable built on TanStack Table with filtering, pagination, and column controls
- Dual packaging: ESM and CJS builds with TypeScript .d.ts declarations
- Dedicated pure subpath `@umesh0492/react-libs/utils` for domain-neutral utilities
- Dedicated subpaths for `@umesh0492/react-libs/india` (pure domain tax/compliance/locations) and `@umesh0492/react-libs/india/react` (interactive AmountSummaryCardIndia component)
- Pluggable client analytics library (`@umesh0492/react-libs/analytics`) with console, Google Analytics, HTTP, and Mixpanel adapters
- Standalone Tailwind CSS stylesheet exported via `./style.css`
- PDF viewer component (`@umesh0492/react-libs/pdf`) with optional peer dependencies
- Toast notification system (`@umesh0492/react-libs/hooks/use-toast`)

### Known limitations
- Root index bundle is ~425 KB raw due to complete UI primitive inclusion; subpath imports should be preferred for lean bundles
- PDF viewer requires optional peer dependencies (react-pdf, pdfjs-dist) to be installed separately by consumers
- Analytics engine persists offline events in browser localStorage which is limited by browser storage quotas
