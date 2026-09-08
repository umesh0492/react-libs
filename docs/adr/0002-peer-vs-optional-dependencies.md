# ADR 0002: Peer vs Optional Dependencies and Dependency Surface Minimization

## Status
Accepted

## Context
A major criticism of enterprise component libraries is "dependency bloat" — forcing consumers to install dozens of heavy third-party packages (e.g., `xlsx`, `jspdf`, `recharts`, `react-pdf`, `canvas-confetti`) even if they only need core UI primitives such as buttons, dialogs, badges, and form fields. Bundling these unconditionally in `dependencies` leads to:
1. Massive `node_modules` installations (>100MB).
2. Risk of version conflicts (e.g., conflicting versions of `recharts` or `jspdf` between host app and library).
3. Inability of bundlers to tree-shake unused native/binary dependencies.

## Decision
We establish a 3-tier dependency architecture:
1. **Core Direct Dependencies**:
   - Only lightweight, universally required primitives belong in `dependencies`:
     - `clsx`, `tailwind-merge` (class utility)
     - `class-variance-authority` (component variants)
     - `@radix-ui/*` headless primitives
     - `lucide-react` (icon set)
2. **Standard Peer Dependencies**:
   - `react` (`>=18.0.0 || >=19.0.0`)
   - `react-dom` (`>=18.0.0 || >=19.0.0`)
3. **Optional Peer Dependencies**:
   - Heavy, specialized feature libraries are declared as optional peers under `peerDependencies` and marked in `peerDependenciesMeta`:
     - `recharts` (for `ChartContainer`, `ChartTooltip`, `ChartLegend`)
     - `canvas-confetti` (for confetti micro-interactions)
     - `embla-carousel-react` (for `Carousel`)
     - `cmdk` (for `Command` dialog)
     - `vaul` (for `Drawer`)
     - `react-hook-form` (for `Form`)
     - `react-day-picker` (for `Calendar`)
     - `next-themes` (for `ThemeProvider`)
     - `react-pdf` (isolated under `./pdf` subpath)
     - `xlsx`, `jspdf`, `jspdf-autotable` (for export utilities)
4. **Subpath & Dynamic Boundary Isolation**:
   - Features requiring optional peers are either isolated in dedicated subpaths (e.g., `@umesh0492/react-libs/pdf`) or gracefully degrade / warn if the peer is missing at runtime.

## Consequences
- **Positive**:
  - Core package installation footprint is minimized.
  - Consumers install only the heavy libraries they actually use in their application.
  - No peer dependency installation warnings in npm 7+ for optional tools.
- **Negative**:
  - Developers using `Chart` or `PdfViewer` must explicitly install the corresponding peer package in their application. Documented in `README.md` and `MIGRATION.md`.
