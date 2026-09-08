import type { Meta, StoryObj } from "@storybook/react";
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
    taxes: [
      { label: "State Tax", amount: 13050 },
      { label: "Local Tax", amount: 13050 },
    ],
    withholdingPercentage: 2,
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
    taxAmount: 57600,
    taxLabel: "VAT (18%)",
    withholdingPercentage: 2,
    isUrgent: true,
  },
  render: (args) => (
    <div className="w-[380px]">
      <AmountSummaryCard {...args} />
    </div>
  ),
};
