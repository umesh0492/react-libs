# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.0.1] - 2026-08-19

### 🚀 Initial Open-Source Release

Official initial release of **`@umesh0492/react-libs`** — a production-grade React 19 component library engineered with Tailwind CSS v4 design tokens and Radix UI headless primitives.

- **📖 Interactive Storybook**: [https://umesh0492.github.io/react-libs/](https://umesh0492.github.io/react-libs/)
- **📦 NPM Package**: `@umesh0492/react-libs@0.0.1`
- **📂 GitHub Repository**: [https://github.com/umesh0492/react-libs](https://github.com/umesh0492/react-libs)

---

### ✨ Included Components (70+ Components)

#### 1. Forms & Inputs
- `Button`, `ButtonGroup`, `Field`, `Form`, `Input`, `InputGroup`, `InputOTP`, `Label`
- `Select`, `AsyncSelect`, `FilterSelect`, `Checkbox`, `RadioGroup`, `Slider`, `Switch`, `Textarea`, `Toggle`, `ToggleGroup`

#### 2. Navigation
- `NavigationMenu`, `Sidebar`, `Menubar`, `Breadcrumb`, `Pagination`, `Tabs`

#### 3. Data Display
- `DataTable` (Sorting, filtering, pagination, custom cells)
- `Table`, `StatusBadge`, `Badge`, `Avatar`, `AspectRatio`, `Carousel`, `Collapsible`, `Chart` (Recharts integration)

#### 4. Layout
- `Card`, `PageHeader`, `Resizable`, `ScrollArea`, `Separator`

#### 5. Overlays
- `Dialog`, `AlertDialog`, `ConfirmDialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `HoverCard`, `ContextMenu`, `DropdownMenu`, `Command`

#### 6. Feedback & Indicators
- `Alert`, `Toast` (Sonner & custom Toaster), `Progress`, `Skeleton`, `SkeletonList`, `Spinner`, `EmptyState`, `RoleEmptyState`, `SuccessMicroInteraction`

---

### 🎨 Design Tokens & Theming
- Native **Tailwind CSS v4** `@theme` configuration with CSS variables.
- Zero runtime CSS-in-JS overhead.
- Built-in Dark Mode and High-Contrast token support.

---

### 📦 Quick Start

```bash
npm install @umesh0492/react-libs
```

```tsx
import "@umesh0492/react-libs/styles/theme.css";
import { Button, Card, DataTable } from "@umesh0492/react-libs";
```
