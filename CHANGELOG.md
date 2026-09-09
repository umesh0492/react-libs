# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
