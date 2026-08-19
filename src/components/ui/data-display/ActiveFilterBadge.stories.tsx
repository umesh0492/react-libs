// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent, fn } from "storybook/test";
import { ActiveFilterBadge } from "./ActiveFilterBadge";

/**
 * A dismissible filter indicator shown above tables when a filter is active.
 * Shows the current filter label and provides a clear button.
 */
const meta = {
  title: "UI/Data-display/ActiveFilterBadge",
  component: ActiveFilterBadge,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Appears above data tables when an active filter is applied. " +
          "Displays the filter label and an `×` button to clear it. " +
          "Renders `null` when `label` is empty.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Human-readable description of the active filter.",
      table: { category: "Content" },
    },
    onClear: {
      action: "onClear",
      control: true,
      description: "Called when the user clicks the clear button.",
      table: { category: "Events" },
    },
    className: {
      control: "text",
      description: "Additional CSS classes.",
      table: { category: "Styling" },
    },
  },
  args: { label: "Status: Active", onClear: fn() },
} satisfies Meta<typeof ActiveFilterBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

function StatefulActiveFilterBadge(
  args: React.ComponentProps<typeof ActiveFilterBadge>,
) {
  const [label, setLabel] = React.useState(args.label);

  React.useEffect(() => {
    setLabel(args.label);
  }, [args.label]);

  if (!label) {
    return <p className="text-sm text-muted-foreground">Filter cleared.</p>;
  }

  return (
    <ActiveFilterBadge
      {...args}
      label={label}
      onClear={() => {
        args.onClear();
        setLabel("");
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => (
    <div className="w-[480px]">
      <StatefulActiveFilterBadge {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Status: Active/i)).toBeInTheDocument();
    // Clear button should be present
    expect(canvas.getByRole("button")).toBeInTheDocument();
  },
};

/** Click the ✕ button to clear the filter. */
export const WithInteraction: Story = {
  render: (args) => {
    return (
      <div className="w-[480px]">
        <StatefulActiveFilterBadge {...args} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    expect(canvas.getByText("Filter cleared.")).toBeInTheDocument();
  },
};

/** Renders nothing when label is empty. */
export const Empty: Story = {
  args: { label: "" },
  render: (args) => (
    <div className="w-[480px] p-4 border rounded text-sm text-muted-foreground">
      <ActiveFilterBadge {...args} />
      <span>No badge rendered (label is empty)</span>
    </div>
  ),
};
