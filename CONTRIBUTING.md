# Contributing to @umesh0492/react-libs 🧱

> This library powers all frontend portals (admin, partner, catalog) across the enterprise platform. It is the **single source of truth** for visual components, design tokens, hooks, and formatters.

---

## 1. Local Setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | `v22.x` |
| Package manager | `npm` |
| Browser (interaction tests) | Chromium — auto-installed via Playwright |

### Installation

```bash
cd Partner-Portal-Design/react-lib
npm ci
```

> **Token required:** `npm ci` reads `@umesh0492` packages from GitHub Packages. Set `GH_PACKAGE_TOKEN` in your environment:
> ```bash
> export GH_PACKAGE_TOKEN=ghp_xxxx
> ```

### Verifying Setup

```bash
npm run test            # All 584 tests should pass
npm run storybook       # Opens http://localhost:6006
npx tsc --noEmit        # Should produce zero errors
```

---

## 2. Directory Structure & Semantic Domains

Components are organized by **semantic domain** — not by feature or page. This prevents bloated flat lists and makes the component tree predictable.

```
src/
  components/
    ui/
      forms/            ← Interactive input logic
      data-display/     ← Read-only visualization
      layout/           ← Spatial boundaries & containers
      navigation/       ← Routing & wayfinding
      overlays/         ← Popups, modals, drawers
      feedback/         ← Non-blocking context (toasts, skeletons)
  stories/              ← Storybook entries (one per component)
  lib/                  ← Utilities & formatters
    __tests__/
  hooks/                ← Shared React hooks
  styles/               ← Design tokens (theme.css)
  test/
    setup.ts            ← Global JSDOM mocks
```

### Domain Rules

| Domain | Contains | Does NOT contain |
|---|---|---|
| `forms/` | `button`, `input`, `select`, `checkbox`, `switch`, `slider` | Read-only display |
| `data-display/` | `badge`, `table`, `chart`, `avatar`, `accordion` | Interactive inputs |
| `layout/` | `card`, `separator`, `page-header`, `scroll-area` | Navigation logic |
| `navigation/` | `sidebar`, `tabs`, `breadcrumb`, `pagination`, `menubar` | Content display |
| `overlays/` | `dialog`, `tooltip`, `popover`, `sheet`, `dropdown-menu` | Inline content |
| `feedback/` | `toast`, `skeleton`, `spinner`, `progress`, `empty-state` | Structural layout |

---

## 3. How to Add a New Component

Follow these steps **in order**:

### Step A — Create the File

Place the component in its semantic domain:

```bash
# Example: adding a Gauge visualization
touch src/components/ui/data-display/gauge.tsx
```

### Step B — Build with Radix + CVA

- Use **Radix UI headless primitives** (`@radix-ui/*`) for accessibility whenever available
- Use **`cva`** (class-variance-authority) for variant props
- Use **`cn`** utility for class merging — never use string template literals for classes

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../lib/utils"

const gaugeVariants = cva("relative flex items-center justify-center rounded-full", {
  variants: {
    size: {
      sm: "h-12 w-12",
      default: "h-20 w-20",
      lg: "h-32 w-32",
    },
  },
  defaultVariants: { size: "default" },
})

export interface GaugeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gaugeVariants> {
  value: number
  max?: number
}

const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(
  ({ className, size, value, max = 100, ...props }, ref) => (
    <div ref={ref} className={cn(gaugeVariants({ size }), className)} {...props}>
      {/* implementation */}
    </div>
  )
)
Gauge.displayName = "Gauge"

export { Gauge }
```

### Step C — Export from Barrel

Add the named export to `src/index.ts`:

```typescript
export * from "./components/ui/data-display/gauge"
```

### Step D — Write the Storybook Story

Create `src/stories/gauge.stories.tsx` covering **every variant** and the primary `play()` interaction:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Gauge } from '@ui/data-display/gauge';

const meta = {
  title: 'Data Display/Gauge',
  component: Gauge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Gauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 75 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Assert the component rendered
    expect(canvas.getByRole('presentation')).toBeInTheDocument();
  },
};

export const Small: Story = { args: { value: 40, size: 'sm' } };
export const Large: Story = { args: { value: 92, size: 'lg' } };
```

### Step E — Write Unit Tests

Create `src/components/ui/data-display/__tests__/gauge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Gauge } from '../gauge';

describe('Gauge', () => {
  it('renders without crashing', () => {
    const { container } = render(<Gauge value={75} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies size variant', () => {
    const { container } = render(<Gauge value={50} size="lg" />);
    expect(container.firstChild).toHaveClass('h-32');
  });
});
```

### Step F — Verify

```bash
npm run test                # All tests including new ones pass
npx tsc --noEmit           # Zero TypeScript errors
npm run storybook           # Component visible in Storybook
```

---

## 4. Pull Requests & CI

All PRs against `main` trigger **`ci.yml`** automatically:

| CI Step | Failure means |
|---|---|
| `npx tsc --noEmit` | TypeScript error introduced |
| `npm run test` | Unit test or interaction test failed, or coverage dropped below threshold |
| `npm run build-storybook` | JSX parse error or broken story import |

### PR Requirements

- All CI checks green
- Coverage thresholds maintained (see [test.md](./test.md))
- New components have both a story and a `__tests__/` file
- New exports added to `src/index.ts`

---

## 5. Code Style

### Imports in Stories

```tsx
// ✅ Always use storybook/test — never @testing-library directly
import { expect, within, userEvent, waitFor } from 'storybook/test';
```

### Component Aliases

Consumers use `@ui/...` aliases. Within the library itself, use relative paths:

```tsx
// Inside the library
import { Button } from "../../forms/button"

// In stories (alias available via vite.config)
import { Button } from "@ui/forms/button"
```

### Dialog Rule

**Never build custom modals.** Always use `@ui/overlays/dialog` — it manages portal, overlay, animation, and focus trap via Radix.

### Portal Testing Rule

When testing components that use portals (`Tooltip`, `Popover`, `Sheet`, `Dialog`, etc.), always query via `within(document.body)` — never via `within(canvasElement)`. See [test.md §7](./test.md#7-portal-rendered-components-critical) for full patterns.

---

## 6. Publishing

Publishing is triggered automatically by pushing a version tag. **Do not run `npm publish` manually** unless it's an emergency fix.

### Normal Release Flow

```bash
# 1. Ensure all tests pass
npm run test

# 2. Bump version (patch | minor | major)
npm version patch    # e.g. 1.0.19 → 1.0.20

# 3. Commit & tag
git add package.json package-lock.json
git commit -m "chore: bump react-lib to 1.0.20"
git tag v1.0.20

# 4. Push — CI runs + auto-publishes
git push && git push --tags
```

### What publish.yml Does

1. Verifies tag version matches `package.json`
2. Installs dependencies + Playwright
3. Runs full type check + test suite + Storybook build
4. Configures npm auth with `GH_PACKAGE_TOKEN`
5. Verifies auth via `npm whoami`
6. Publishes to GitHub Packages

### After Publishing

Update the version in consuming apps:

```bash
# In consuming web portals
npm install @umesh0492/react-lib@1.0.42
```
