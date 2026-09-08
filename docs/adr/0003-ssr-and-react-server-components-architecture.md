# ADR 0003: SSR & React Server Components (RSC) Purity Architecture

## Status
Accepted

## Context
With the proliferation of Next.js App Router, Remix, and React Server Components (RSC), component libraries must adhere to strict runtime boundary constraints:
1. **Server Purity**: Utilities, formatters, and constants must be executable in non-browser Node.js/Edge environments without referencing `window`, `document`, `navigator`, or `localStorage`.
2. **Client Directive Integrity**: Components utilizing React hooks (`useState`, `useEffect`, `useContext`), event listeners, or browser DOM APIs must declare `"use client";` as their top-level directive. Omitting this causes RSC compilation errors in Next.js.
3. **Hydration Determinism**: Components must avoid SSR flash, layout shifts, or non-deterministic DOM IDs during server rendering.

## Decision
1. **Strict RSC Subpath Separation**:
   - The subpath `@umesh0492/react-libs/utils` is verified to be 100% server-safe. It contains zero React dependencies, zero hooks, and zero DOM API access.
   - Browser-dependent file export functions (`downloadFileSecurely`, `exportData`) are exported exclusively from the root entry (`@umesh0492/react-libs`), leaving `/utils` pure for Edge/Node usage.
2. **`"use client";` Banner & Per-File Enforcement**:
   - Every interactive UI component and hook (`use-toast`, `use-mobile`, `use-debounce`, `use-local-storage`) includes `"use client";` at line 1.
   - `tsup.config.ts` preserves directives across emitted ESM and CJS bundles.
3. **Hydration Mismatch Mitigation**:
   - `use-mobile`: Implements safe client hydration or external store synchronization to prevent SSR mismatch warnings.
   - `use-toast`: Uses a stable `SERVER_SNAPSHOT` reference inside `getServerSnapshot` to satisfy React's `useSyncExternalStore` contract without triggering infinite render cycles.
4. **Automated SSR Verification**:
   - A dedicated SSR smoke test suite (`src/__tests__/ssr-smoke.test.tsx`) renders every single visual UI primitive with `ReactDOMServer.renderToString()` during CI to assert zero server-side exceptions.

## Consequences
- **Positive**:
  - Seamless adoption in Next.js App Router (`app/` directory).
  - `/utils` functions can be safely imported inside server-side data loaders and API route handlers.
  - Complete elimination of `useLayoutEffect` and `useSyncExternalStore` console warnings during SSR.
