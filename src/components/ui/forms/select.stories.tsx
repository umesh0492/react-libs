// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent, waitFor } from "storybook/test";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

/**
 * A fully accessible dropdown select built on Radix UI Select.
 * Supports keyboard navigation, grouped options, and controlled/uncontrolled usage.
 * Always pair with a visible label for accessibility.
 */
const meta = {
  title: "UI/Forms/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible select dropdown from Radix UI. Supports grouped options, " +
          "placeholder text, and controlled/uncontrolled usage. " +
          "Opens with keyboard (Space/Enter) and navigates with arrow keys.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "text",
      description: "The initial selected value (uncontrolled).",
      table: { category: "State" },
    },
    value: {
      control: "text",
      description: "Controlled selected value.",
      table: { category: "State" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire select.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    onValueChange: {
      action: "onValueChange",
      description: "Fired with the newly selected value string.",
      table: { category: "Events" },
    },
  },
  args: { disabled: false },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default empty select — click to open the dropdown. */
export const Default: Story = {
  render: (args) => (
    <div className="p-8 w-[240px]">
      <Select {...args}>
        <SelectTrigger id="select-default" aria-label="Select button">
          <SelectValue placeholder="Select a fruit…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"]');
    expect(trigger).toHaveAttribute("data-state", "closed");
    await userEvent.click(trigger as Element);
    await waitFor(() => expect(trigger).toHaveAttribute("data-state", "open"));
    // Close with Escape
    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => expect(trigger).toHaveAttribute("data-state", "closed"),
    );
  },
};

/** Pre-selected value via `defaultValue`. */
export const WithDefaultValue: Story = {
  render: (args) => (
    <div className="p-8 w-[240px]">
      <Select defaultValue="banana" {...args}>
        <SelectTrigger id="select-preselected" aria-label="Select button">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain("Banana");
  },
};

/** Disabled select — cannot be opened. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="p-8 w-[240px]">
      <Select {...args}>
        <SelectTrigger id="select-disabled" aria-label="Disabled select">
          <SelectValue placeholder="Not available" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"]');
    expect(trigger).toBeDisabled();
  },
};
/** Disabled select with pre existing value — cannot be changed. */
export const DisabledWithPreExistingValue: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="p-8 w-[240px]">
      <Select {...args} defaultValue="banana">
        <SelectTrigger id="select-disabled" aria-label="banana">
          <SelectValue placeholder="Banana" value="banana" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"]');
    expect(trigger).toBeDisabled();
  },
};

/** Grouped options with labels and a separator. */
export const WithGroups: Story = {
  render: () => (
    <div className="p-8 w-[260px]">
      <Select>
        <SelectTrigger id="select-groups" aria-label="Select timezone">
          <SelectValue placeholder="Select timezone…" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern (EST)</SelectItem>
            <SelectItem value="cst">Central (CST)</SelectItem>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia Pacific</SelectLabel>
            <SelectItem value="ist">India (IST)</SelectItem>
            <SelectItem value="sgt">Singapore (SGT)</SelectItem>
            <SelectItem value="jst">Japan (JST)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[role="combobox"]');
    await userEvent.click(trigger as Element);
    await waitFor(
      () => expect(document.body.querySelector('[role="option"]')).toBeTruthy(),
    );
    await userEvent.keyboard("{Escape}");
  },
};

/** Scrollable list with many items to show scroll affordance. */
export const ManyOptions: Story = {
  render: () => (
    <div className="p-8 w-[240px]">
      <Select>
        <SelectTrigger id="select-many" aria-label="Pick a country">
          <SelectValue placeholder="Pick a country…" />
        </SelectTrigger>
        <SelectContent>
          {[
            "India",
            "United States",
            "United Kingdom",
            "Germany",
            "France",
            "Japan",
            "China",
            "Australia",
            "Canada",
            "Brazil",
            "Singapore",
            "UAE",
            "South Africa",
            "Mexico",
            "Italy",
          ].map((country) => (
            <SelectItem
              key={country}
              value={country.toLowerCase().replace(/\s/g, "-")}
            >
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};
