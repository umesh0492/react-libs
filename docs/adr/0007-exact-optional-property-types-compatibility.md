# ADR 0007: TypeScript `exactOptionalPropertyTypes` Compatibility Status

## Status
Evaluated / Documented (Set to `false` for Ecosystem Compatibility)

## Context
TypeScript 4.4 introduced the `exactOptionalPropertyTypes` compiler flag. When enabled, TypeScript strictly differentiates between an optional property being absent from an object vs. present with the value `undefined`:
- Without `exactOptionalPropertyTypes`: `{ foo?: string }` permits `{ foo: "bar" }`, `{}`, and `{ foo: undefined }`.
- With `exactOptionalPropertyTypes: true`: `{ foo?: string }` permits `{ foo: "bar" }` and `{}`, but raises error `TS2375` on `{ foo: undefined }`. To allow `undefined`, the type must be explicitly written as `{ foo?: string | undefined }`.

As part of quality gate hardening, we inspected enabling `exactOptionalPropertyTypes: true` in `tsconfig.json`.

## Technical Findings

Enabling `exactOptionalPropertyTypes: true` across `@umesh0492/react-libs` produced 28 type errors across four primary domains:

1. **Upstream Headless UI Primitives (@radix-ui/*)**:
   - Radix UI type definitions define optional props as `prop?: Type` rather than `prop?: Type | undefined`.
   - Examples:
     - `@radix-ui/react-popover`: `PopoverContentProps.side?: "left" | "right" | "bottom" | "top"`
     - `@radix-ui/react-slider`: `SliderProps.value?: number[]`
     - `@radix-ui/react-menubar`, `@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`: `checked?: CheckedState`
   - In React component wrappers, forwarding optional props (e.g. `<PopoverContent side={side} />` where `side` is typed as `"left" | ... | undefined`) causes TS2375 type incompatibility.

2. **TypeScript Standard DOM Library (`lib.dom.d.ts`)**:
   - `RequestInit` in `lib.dom.d.ts` specifies:
     - `signal?: AbortSignal | null;` (omits `undefined`)
     - `credentials?: RequestCredentials;` (omits `undefined`)
   - Standard fetch wrappers passing options like `{ signal, credentials }` where `signal` is `AbortSignal | undefined` trigger TS2769 overload resolution failures.

3. **Ecosystem & Peer Dependencies (`sonner`, `react-day-picker`)**:
   - `ToasterProps` in `sonner`: `theme?: "dark" | "light" | "system"` (triggering errors when passing next-themes `theme`).
   - `CalendarProps` in `react-day-picker`: `className?: string`.

4. **Idiomatic React Prop Spreading**:
   - In idiomatic React, parent components frequently pass optional properties to children:
     ```tsx
     <Component prop={parentProp} />
     ```
   - When `parentProp` is not supplied, it evaluates at runtime to `undefined`. Requiring every call site or component wrapper to dynamically prune keys via object restructuring or conditional keys adds substantial runtime overhead and reduces code readability for minimal type-safety benefit.

## Decision
We retain `exactOptionalPropertyTypes: false` in `tsconfig.json`, while maintaining the following strict flags:
- `"strict": true` (all strict mode family flags enabled)
- `"noUncheckedIndexedAccess": true` (guards array and record lookups against out-of-bounds `undefined`)
- `"noUnusedLocals": true`
- `"noUnusedParameters": true`
- `"noFallthroughCasesInSwitch": true`

This represents the optimal configuration: maximal compiler rigor on project code without breaking interoperability with Radix UI, React 19, and standard DOM library definitions.

## Consequences
- **Positive**:
  - Full compatibility with Radix UI headless components, React 19 JSX typing, Sonner, and React Day Picker.
  - Zero runtime overhead from synthetic object restructuring or conditional property deletion.
  - Uncompromised type safety via `"strict": true` and `"noUncheckedIndexedAccess": true`.
- **Future Considerations**:
  - Re-evaluate if and when `@radix-ui` and standard TypeScript DOM typings adopt explicit `| undefined` union syntax on all optional interface properties.
