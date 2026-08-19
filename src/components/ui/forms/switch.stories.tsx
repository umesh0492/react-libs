// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "storybook/test";
import { Switch } from "./switch";

/**
 * A toggle switch for boolean on/off settings. Built on Radix UI Switch.
 * For lists of independent toggles, use multiple `Switch` components.
 * Pair with `<label>` for accessibility.
 */
const meta = {
  title: "UI/Forms/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible toggle switch built on Radix UI Switch primitive. " +
          "Fires `onCheckedChange` with a boolean value. " +
          "Always link a visible `<label>` via `htmlFor` / `id` for screen reader support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled checked state.",
      table: { category: "State", defaultValue: { summary: "undefined" } },
    },
    defaultChecked: {
      control: "boolean",
      description: "Initial checked state for uncontrolled usage.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction and applies muted opacity.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    required: {
      control: "boolean",
      description: "Marks the switch as required in a form context.",
      table: { category: "Validation" },
    },
    onCheckedChange: {
      action: "onCheckedChange",
      description:
        "Fires with the new boolean value when the switch is toggled.",
      table: { category: "Events" },
    },
    name: {
      control: "text",
      description: "HTML name attribute for form submission.",
      table: { category: "HTML" },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the root switch element.",
      table: { category: "Styling" },
    },
  },
  args: { disabled: false },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default off state — click to enable. */
export const Default: Story = {
  render: (args) => (
    <div className="p-4 flex items-center gap-3">
      <Switch id="switch-default" {...args} />
      <label
        htmlFor="switch-default"
        className="text-sm font-medium cursor-pointer select-none"
      >
        Enable notifications
      </label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('[role="switch"]') as HTMLElement;
    expect(toggle).toHaveAttribute("data-state", "unchecked");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "checked");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "unchecked");
  },
};

/** Pre-enabled switch via `defaultChecked`. */
export const DefaultChecked: Story = {
  args: { defaultChecked: true },
  render: (args) => (
    <div className="p-4 flex items-center gap-3">
      <Switch id="switch-on" {...args} />
      <label
        htmlFor="switch-on"
        className="text-sm font-medium cursor-pointer select-none"
      >
        Dark mode (enabled by default)
      </label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('[role="switch"]') as HTMLElement;
    expect(toggle).toHaveAttribute("data-state", "checked");
  },
};

/** Disabled switch — cannot be toggled. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="p-4 flex items-center gap-3">
      <Switch id="switch-disabled" {...args} />
      <label
        htmlFor="switch-disabled"
        className="text-sm font-medium text-muted-foreground cursor-not-allowed select-none"
      >
        Beta feature (unavailable)
      </label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('[role="switch"]') as HTMLElement;
    expect(toggle).toBeDisabled();
  },
};

/** A settings panel with multiple independent switches. */
export const SettingsPanel: Story = {
  render: () => {
    const settings = [
      { id: "sw-email", label: "Email notifications", defaultChecked: true },
      { id: "sw-sms", label: "SMS alerts", defaultChecked: false },
      { id: "sw-push", label: "Push notifications", defaultChecked: true },
      { id: "sw-marketing", label: "Marketing emails", defaultChecked: false },
    ];
    return (
      <div className="w-72 border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold">Notification Preferences</h3>
        {settings.map(({ id, label, defaultChecked }) => (
          <div key={id} className="flex items-center justify-between">
            <label htmlFor={id} className="text-sm cursor-pointer select-none">
              {label}
            </label>
            <Switch id={id} defaultChecked={defaultChecked} />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Typical settings panel with multiple independent toggles.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const switches = canvasElement.querySelectorAll('[role="switch"]');
    expect(switches).toHaveLength(4);
    // Toggle first switch off, second switch on
    await userEvent.click(switches[0]);
    await userEvent.click(switches[1]);
    expect(switches[0]).toHaveAttribute("data-state", "unchecked");
    expect(switches[1]).toHaveAttribute("data-state", "checked");
  },
};
