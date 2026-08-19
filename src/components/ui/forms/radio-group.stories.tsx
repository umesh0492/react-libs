// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent, fn } from "storybook/test";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

/**
 * A group of mutually exclusive radio buttons built on Radix UI RadioGroup.
 * Only one option can be selected at a time. Use `defaultValue` for uncontrolled
 * or `value` + `onValueChange` for controlled usage.
 */
const meta = {
  title: "UI/Forms/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible radio group from Radix UI. Renders a set of mutually exclusive options. " +
          "Supports keyboard navigation (arrow keys) and is ARIA-compliant by default. " +
          "Always provide a visible label for each `RadioGroupItem`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "text",
      description:
        "The value of the initially selected radio item (uncontrolled).",
      table: { category: "State" },
    },
    value: {
      control: "text",
      description: "Controlled selected value.",
      table: { category: "State" },
    },
    disabled: {
      control: "boolean",
      description: "Disables all items in the group.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Layout direction for the radio items.",
      table: { category: "Layout", defaultValue: { summary: "vertical" } },
    },
    required: {
      control: "boolean",
      description: "Marks the radio group as required for form validation.",
      table: { category: "Validation" },
    },
    onValueChange: {
      action: "onValueChange",
      description: "Fired with the newly selected value string.",
      table: { category: "Events" },
    },
    name: {
      control: "text",
      description: "HTML name attribute for form submission.",
      table: { category: "HTML" },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the group container.",
      table: { category: "Styling" },
    },
  },
  args: { disabled: false, defaultValue: "comfortable" },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three density options — "Comfortable" is pre-selected. */
export const Default: Story = {
  args: {
    defaultValue: "comfortable",
    orientation: "vertical",
  },
  render: (args) => (
    <div className="p-4">
      <p className="text-sm font-semibold mb-3">Display density</p>
      <RadioGroup
        className="space-y-2"
        disabled={args.disabled}
        defaultValue={args.defaultValue}
        onValueChange={args.onValueChange}
        aria-labelledby="Display Density"
        orientation={args.orientation}
      >
        {[
          { value: "default", label: "Default", hint: "Standard spacing" },
          {
            value: "comfortable",
            label: "Comfortable",
            hint: "Extra breathing room",
          },
          {
            value: "compact",
            label: "Compact",
            hint: "Tight layout for data-heavy views",
          },
        ].map(({ value, label, hint }) => (
          <div key={value} className="flex items-start gap-2.5">
            <RadioGroupItem
              value={value}
              id={`density-${value}`}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor={`density-${value}`} className="cursor-pointer">
                {label}
              </Label>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const radios = canvasElement.querySelectorAll('[role="radio"]');
    expect(radios[1]).toHaveAttribute("data-state", "checked");
  },
};

/** Horizontal layout for short option lists. */
export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: "pro",
  },
  render: (args) => (
    <div className="p-4">
      <p className="text-sm font-semibold mb-3">Subscription plan</p>
      <RadioGroup
        defaultValue={args.defaultValue}
        orientation="horizontal"
        className="flex gap-6"
        onValueChange={args.onValueChange}
        aria-labelledby="plans"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="free" id="plan-free" />
          <Label htmlFor="plan-free" className="cursor-pointer">
            Free
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="pro" id="plan-pro" />
          <Label htmlFor="plan-pro" className="cursor-pointer">
            Pro
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="enterprise" id="plan-ent" />
          <Label htmlFor="plan-ent" className="cursor-pointer">
            Enterprise
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const radios = canvasElement.querySelectorAll('[role="radio"]');
    expect(radios[1]).toHaveAttribute("data-state", "checked");
    await userEvent.click(radios[2]);
    expect(radios[2]).toHaveAttribute("data-state", "checked");
  },
};

/** Fully disabled — no item can be selected. */
export const Disabled: Story = {
  render: () => (
    <div className="p-4">
      <RadioGroup disabled className="space-y-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="dis-a" />
          <Label htmlFor="dis-a" className="text-muted-foreground">
            Option A
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="dis-b" />
          <Label htmlFor="dis-b" className="text-muted-foreground">
            Option B
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const radios = canvasElement.querySelectorAll('[role="radio"]');
    radios.forEach((r) => expect(r).toBeDisabled());
  },
};
