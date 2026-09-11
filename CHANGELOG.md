# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dedicated client subpath `@umesh0492/react-libs/analytics/react` (`AnalyticsProvider`, `useAnalytics`, `TrackArea`, `PageViewTracker`) with explicit `'use client'` directive boundary.
- Pure headless domain isolation for `@umesh0492/react-libs/analytics` with zero React hooks, zero client directives, and full server runtime safety.

### Fixed
- Stabilized `AnalyticsProvider` configuration equality: adapter comparison by name and stable `onError` callback reference to eliminate recreation churn.
- Eliminated state updates during render in `AnalyticsProvider` to prevent React render loops and cascading updates.

### Changed
- Configured Storybook a11y parameters to `a11y: { test: 'error' }` in `.storybook/preview.ts` to block on accessibility violations.
- Documented `src/components/ui/__tests__/accessibility.test.tsx` (automated `axe-core` suite) as the blocking CI gate for accessibility compliance.
- Expanded `src/__tests__/ssr-smoke.test.tsx` to systematically verify server-side rendering and module directive boundaries across all 8 `package.json` `exports` entries.
- Streamlined Vitest runner concurrency (`pool: 'forks'`, `maxWorkers: 2`) and removed redundant `prestorybook` test execution.

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
