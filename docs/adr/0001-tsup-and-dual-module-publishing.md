# ADR 0001: tsup and Dual Module (ESM/CJS) Publishing Architecture

## Status
Accepted

## Context
`@umesh0492/react-libs` is consumed by diverse frontend ecosystems including:
- Modern Next.js 14/15 App Router applications using React Server Components (RSC) and standard ECMAScript Modules (ESM).
- Vite, Bun, and Remix build systems.
- Legacy Jest test harnesses, Node.js scripts, and SSR pipelines operating in CommonJS (CJS).

Publishing an ESM-only package breaks CJS `require()` consumers, whereas publishing CJS-only degrades bundle size and tree-shaking capabilities in modern bundlers. Furthermore, naive dual publishing often causes the "Dual Package Hazard" where two separate instances of singletons or React context providers coexist at runtime.

## Decision
We adopt `tsup` (esbuild-based packaging engine) to compile and emit dual-module artifacts:
1. **Target Formats**:
   - ESM: emitted as `.js` with `type: "module"` in `package.json`.
   - CJS: emitted as `.cjs`.
2. **Type Declarations**:
   - Emits `.d.ts` for ESM consumers and `.d.cts` for TypeScript CommonJS resolution.
3. **Subpath Exports Map**:
   - Configured in `package.json` under `exports` using explicit condition order:
     ```json
     "exports": {
       ".": {
         "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
         "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
       },
       "./utils": {
         "import": { "types": "./dist/utils.d.ts", "default": "./dist/utils.js" },
         "require": { "types": "./dist/utils.d.cts", "default": "./dist/utils.cjs" }
       },
       "./india": {
         "import": { "types": "./dist/india/index.d.ts", "default": "./dist/india/index.js" },
         "require": { "types": "./dist/india/index.d.cts", "default": "./dist/india/index.cjs" }
       }
     }
     ```
4. **`typesVersions` Fallback**:
   - Provide legacy TypeScript resolution support for consumers not yet on `moduleResolution: "bundler" | "node16" | "nodenext"`.
5. **Code Splitting & Externalization**:
   - Core external dependencies (`react`, `react-dom`, heavy optional peers) are marked external to prevent bundling redundant runtime code.

## Consequences
- **Positive**:
  - Full compatibility with Next.js, Vite, Jest, and Node.js without bundler plugins.
  - Passes `@arethetypeswrong/cli` (`attw`) across all module resolution matrices with zero warnings.
  - Clean tree-shaking for all subpath imports.
- **Negative**:
  - Requires maintaining matching `.d.ts` and `.d.cts` mappings during entry point modifications.
