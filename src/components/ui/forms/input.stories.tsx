// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "storybook/test";
import { Input } from "./input";

/**
 * A styled HTML `<input>` element with consistent border, focus ring, and disabled states.
 * Works with any valid `<input>` type. Pair with `<Label>` and `<Field>` for form layouts.
 *
 * **Phase 1 fix:** `readOnly` fields now display with a muted background and
 * suppress the focus ring on click — they look and behave as read-only, not active.
 */
const meta = {
  title: "UI/Forms/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A styled `<input>` wrapper that forwards all standard HTML input attributes. " +
          'Use with `type="text"`, `"email"`, `"password"`, `"number"`, `"search"`, etc. ' +
          "Pair with `<Label>` for accessible form fields.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "search",
        "tel",
        "url",
        "date",
      ],
      description: "HTML input type attribute.",
      table: { category: "HTML", defaultValue: { summary: "text" } },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the field is empty.",
      table: { category: "Content" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the input and applies muted styling.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    readOnly: {
      control: "boolean",
      description:
        "Makes the input read-only (value visible but not editable).",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    required: {
      control: "boolean",
      description: "Marks the field as required for form validation.",
      table: { category: "Validation", defaultValue: { summary: "false" } },
    },
    defaultValue: {
      control: "text",
      description: "Initial value for uncontrolled usage.",
      table: { category: "State" },
    },
    className: {
      control: "text",
      description: "Additional CSS classes to merge with the input element.",
      table: { category: "Styling" },
    },
    onChange: {
      action: "changed",
      description: "Change event handler — receives the `React.ChangeEvent`.",
      table: { category: "Events" },
    },
  },
  args: {
    type: "text",
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A basic text input — click and start typing. */
export const Default: Story = {
  render: (args) => (
    <div className="p-4 w-72">
      <Input {...args} id="input-default" placeholder="Enter text here..." />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.type(input, "Hello, World!", { delay: null });
    expect(input).toHaveValue("Hello, World!");
    await userEvent.clear(input);
    expect(input).toHaveValue("");
  },
};

/** Email input with validation pattern. */
export const Email: Story = {
  args: { type: "email" },
  render: (args) => (
    <div className="p-4 w-72 space-y-1">
      <label htmlFor="email-field" className="text-sm font-medium">
        Email address
      </label>
      <Input {...args} id="email-field" placeholder="you@company.com" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, "user@example.com", { delay: null });
    expect(input).toHaveValue("user@example.com");
  },
};

/** Password input — value is masked. */
export const Password: Story = {
  args: { type: "password" },
  render: (args) => (
    <div className="p-4 w-72 space-y-1">
      <label htmlFor="pwd-field" className="text-sm font-medium">
        Password
      </label>
      <Input {...args} id="pwd-field" placeholder="••••••••" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, "SecurePass123!", { delay: null });
    expect(input).toHaveValue("SecurePass123!");
    expect(input).toHaveAttribute("type", "password");
  },
};

/** Disabled input — grayed out, not interactable. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Cannot be changed" },
  render: (args) => (
    <div className="p-4 w-72">
      <label htmlFor="input-disabled" className="text-sm font-medium">
        Disabled
      </label>
      <Input {...args} id="input-disabled" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    expect(input).toBeDisabled();
  },
};

/**
 * Read-only — displays a value that cannot be edited but CAN be copied.
 * Fix: clicking the field no longer shows a focus ring or activates the input.
 * Muted background (`bg-muted/40`) distinguishes it from a live editable field.
 */
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "INV-2026-001234" },
  render: (args) => (
    <div className="p-4 w-72 space-y-1">
      <label htmlFor="readonly-field" className="text-sm font-medium">
        Invoice ID (read-only)
      </label>
      <Input {...args} id="readonly-field" />
      <p className="text-xs text-muted-foreground">
        Click the field — no focus ring should appear.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    // Clicking a read-only field should NOT trigger the focus ring style
    await userEvent.click(input);
    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveValue("INV-2026-001234");
  },
};

/** Search input with type="search". */
export const Search: Story = {
  args: { type: "search" },
  render: (args) => (
    <div className="p-4 w-72">
      <Input {...args} id="search-field" placeholder="Search products..." />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, "apple", { delay: null });
    expect(input).toHaveValue("apple");
  },
};
