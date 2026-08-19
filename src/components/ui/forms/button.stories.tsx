// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "storybook/test";
import { Button } from "./button";

/**
 * A versatile button component with multiple visual variants and sizes.
 *
 * **Phase 1 fixes:**
 * - `link` variant now always shows underline (not just on hover)
 * - `disabled` state now renders in muted grey text (not just opacity)
 * - `secondary` variant uses a low-opacity primary fill instead of generic bg-secondary
 */
const meta = {
  title: "UI/Forms/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A polymorphic button built with `class-variance-authority` variants. " +
          "Accepts all standard `<button>` HTML attributes plus `isLoading` and `loadingText`. " +
          "Use `asChild` to render as a different element (e.g., a link).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    asChild: {
      control: "boolean",
      description: "Replace the button element with its child, merging props.",
      table: { category: "Composition", defaultValue: { summary: "false" } },
    },
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "Controls the visual style and color scheme of the button.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "Controls padding and font size.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    isLoading: {
      control: "boolean",
      description: "When true, renders a spinner and disables the button.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    loadingText: {
      control: "text",
      description: "Text shown next to the spinner when `isLoading` is true.",
      table: { category: "State" },
    },
    disabled: {
      control: "boolean",
      description:
        "Disables all pointer events, applies muted opacity + grey text.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    children: {
      control: "text",
      description: "Content rendered inside the button.",
      table: { category: "Content" },
    },
    onClick: {
      action: "clicked",
      table: { category: "Events" },
    },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    isLoading: false,
    disabled: false,
    asChild: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Primary action button. */
export const Default: Story = {
  args: { children: "Save Changes" },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeEnabled();
    await userEvent.click(btn);
  },
};

/** Destructive variant for dangerous actions. */
export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete Account" },
};

/** Outline for secondary or cancel actions. */
export const Outline: Story = {
  args: { variant: "outline", children: "Cancel" },
};

/**
 * Secondary variant — low-opacity primary fill.
 * Fix: was using plain `bg-secondary`; now uses `bg-primary/10 text-primary` for clear visual hierarchy.
 */
export const Secondary: Story = {
  args: { variant: "secondary", children: "Export" },
};

/** Ghost — minimal chrome for toolbars. */
export const Ghost: Story = {
  args: { variant: "ghost", children: "View Details" },
};

/**
 * Link variant — always underlined (not just on hover).
 * Fix: was `hover:underline`; now always has `underline underline-offset-4`.
 */
export const Link: Story = {
  args: { variant: "link", children: "Read the documentation →" },
};

/** Loading — spinner replaces icon, text preserved. */
export const Loading: Story = {
  args: { isLoading: true, loadingText: "Saving...", children: "Save" },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeDisabled();
    expect(canvasElement.textContent).toContain("Saving...");
  },
};

/**
 * Disabled — pointer events removed, natively inherited muted opacity.
 */
export const Disabled: Story = {
  args: { disabled: true, children: "Unavailable" },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeDisabled();
  },
};

/**
 * All six variants side-by-side — default (normal) state.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All six variants. Secondary now uses primary/10 fill; Link always underlined.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll("button")).toHaveLength(6);
  },
};

/**
 * Disabled states across all variants.
 * All show muted grey text + reduced opacity.
 */
export const AllVariantsDisabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <Button variant="default" disabled>
        Default
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
      <Button variant="link" disabled>
        Link
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All variants in disabled state — grey text + reduced opacity, no pointer events.",
      },
    },
  },
};

/** Three sizes: sm, default, lg. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
