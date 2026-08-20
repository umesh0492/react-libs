import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AmountSummaryCard } from "./amount-summary-card";

const meta: Meta<typeof AmountSummaryCard> = {
  title: "Data Display/AmountSummaryCard",
  component: AmountSummaryCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof AmountSummaryCard>;

export const Default: Story = {
  args: {
    baseAmount: 145000,
    gstAmount: 26100,
    tdsPercentage: 2,
    isIntraState: true,
    transportCost: 3500,
  },
  render: (args) => (
    <div className="w-[380px]">
      <AmountSummaryCard {...args} />
    </div>
  ),
};

export const UrgentPriority: Story = {
  args: {
    baseAmount: 320000,
    gstAmount: 57600,
    tdsPercentage: 2,
    isIntraState: false,
    isUrgent: true,
  },
  render: (args) => (
    <div className="w-[380px]">
      <AmountSummaryCard {...args} />
    </div>
  ),
};
