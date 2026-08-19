// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "storybook/test";
import { Toggle } from "./toggle";
import { Bold, Italic, Underline } from "lucide-react";

const meta = {
  title: "UI/Forms/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A two-state pressed toggle built on Radix UI Toggle. Use it for formatting actions, view switches, or other on/off commands where the control itself reflects the current pressed state.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "outline"],
      description: "Visual style of the toggle trigger.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    size: {
      control: "radio",
      options: ["default", "sm", "lg"],
      description: "Size of the toggle trigger.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    defaultPressed: {
      control: "boolean",
      description: "Initial pressed state for uncontrolled usage.",
      table: { category: "State" },
    },
    pressed: {
      control: "boolean",
      description: "Controlled pressed state.",
      table: { category: "State" },
    },
    disabled: {
      control: "boolean",
      description: "Disables toggle interaction.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    asChild: {
      control: "boolean",
      description: "Composes the toggle behavior onto a child element.",
      table: { category: "Composition", defaultValue: { summary: "false" } },
    },
    "aria-label": {
      control: "text",
      description:
        "Accessible name for icon-only toggles or when visible text does not fully describe the action.",
      table: { category: "Accessibility" },
    },
    className: {
      control: "text",
      description: "Additional classes applied to the toggle root.",
      table: { category: "Styling" },
    },
    onPressedChange: {
      action: "onPressedChange",
      description: "Called when the pressed state changes.",
      table: { category: "Events" },
    },
  },
  args: {
    variant: "default",
    size: "default",
    defaultPressed: false,
    disabled: false,
    "aria-label": "Toggle bold",
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="p-4 flex items-center gap-3">
      <Toggle
        aria-label="Toggle bold"
        id="toggle-bold"
        variant={args.variant}
        size={args.size}
        disabled={args.disabled}
        onPressedChange={args.onPressedChange}
      >
        <Bold className="h-4 w-4" />
        <span className="ml-1 text-sm">Bold</span>
      </Toggle>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('button') as HTMLElement;

    // Initially off
    expect(toggle).toHaveAttribute("data-state", "off");

    // Toggle on
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "on");

    // Toggle off again
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "off");
  },
};

export const FormattingToolbar: Story = {
  args: {
    variant: "outline",
    size: "sm",
    defaultPressed: false,
    disabled: false,
  },
  render: (args) => (
    <div className="p-4 flex items-center border rounded-md gap-1 w-fit">
      <Toggle aria-label="Toggle bold" variant={args.variant} size={args.size}>
        <Bold className="h-3.5 w-3.5" />
      </Toggle>
      <Toggle
        aria-label="Toggle italic"
        variant={args.variant}
        size={args.size}
      >
        <Italic className="h-3.5 w-3.5" />
      </Toggle>
      <Toggle
        aria-label="Toggle underline"
        variant={args.variant}
        size={args.size}
        defaultPressed
      >
        <Underline className="h-3.5 w-3.5" />
      </Toggle>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('button');
    const boldBtn = buttons[0];
    const italicBtn = buttons[1];

    await userEvent.click(boldBtn);
    await userEvent.click(italicBtn);

    expect(boldBtn).toHaveAttribute("data-state", "on");
    expect(italicBtn).toHaveAttribute("data-state", "on");
  },
};

export const Outline: Story = {
  render: () => (
    <div className="p-4 flex items-center gap-3">
      <Toggle variant="outline" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
        <span className="ml-1 text-sm">Italic</span>
      </Toggle>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="p-4 flex items-center gap-3">
      <Toggle aria-label="Toggle disabled" disabled>
        <Bold className="h-4 w-4" />
        <span className="ml-1 text-sm">Disabled</span>
      </Toggle>
    </div>
  ),
};
