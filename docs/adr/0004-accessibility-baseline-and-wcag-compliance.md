# ADR 0004: Accessibility Baseline and Automated WCAG Compliance

## Status
Accepted

## Context
Accessibility (a11y) cannot be an afterthought or a superficial marketing claim. Enterprise design systems must guarantee compliance with WCAG 2.1 Level AA to ensure usability by assistive technology (screen readers, braille displays, keyboard-only navigation). Previous versions of `@umesh0492/react-libs` had:
1. Hardcoded static DOM IDs (e.g. `multiselect-listbox`), causing duplicate ID violations when multiple instances appeared on the same page.
2. Missing semantic roles and ARIA values on custom SVG data visualizations (`ProgressRing`, `MatchScoreGauge`, `RadarSweep`).
3. Sortable table headers that were non-interactive `div`s without keyboard triggers or `aria-sort` indicators.
4. Lack of automated CI-backed accessibility regression testing.

## Decision
1. **Automated `axe-core` Testing**:
   - We integrate `axe-core` directly into Vitest (`src/components/ui/__tests__/accessibility.test.tsx`).
   - Every interactive primitive and data visualization must pass `axe(container)` with zero violations:
     - Forms: `MultiSelect`, `Combobox`, `FileUpload`, `InputOTP`, `Switch`, `Slider`.
     - Data Display: `DataTable`, `ProgressRing`, `MatchScoreGauge`, `RadarSweep`.
     - Navigation & Feedback: `Stepper`, `CopyButton`.
2. **Deterministic ID Generation**:
   - All internal label/input bindings and ARIA controls use `React.useId()` instead of static strings.
3. **Semantic ARIA Enhancements**:
   - `ProgressRing`: Implements `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
   - `MatchScoreGauge`: Implements `role="meter"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and accessible title.
   - `RadarSweep`: Implements `role="img"` with descriptive label.
   - `DataTable`: Wraps sort triggers in semantic `<button type="button">`, adds `aria-sort="ascending" | "descending" | "none"`, and sets `aria-busy={isLoading}`.
   - `FileUpload` & `CopyButton`: Include `aria-live="polite"` notifications for asynchronous status feedback.
4. **Reduced Motion Respect**:
   - Any animated micro-interaction (`MetricTicker`, confetti bursts) checks `@media (prefers-reduced-motion: reduce)` and disables or simplifies motion for sensitive users.

## Consequences
- **Positive**:
  - Verifiable WCAG 2.1 AA conformance verified in CI on every commit.
  - Zero accessibility violations on interactive widgets.
  - Robust screen reader and keyboard navigation experience out of the box.
- **Negative**:
  - Slightly more verbose JSX markup required to support full ARIA state machines.
