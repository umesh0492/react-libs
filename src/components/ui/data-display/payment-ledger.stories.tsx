import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { PaymentLedger } from "./payment-ledger";

const meta: Meta<typeof PaymentLedger> = {
  title: "Data Display/PaymentLedger",
  component: PaymentLedger,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof PaymentLedger>;

export const Default: Story = {
  args: {
    totalDR: 245000,
    totalCR: 15000,
    netLabel: "Net Balance Due",
    ledgerEntries: [
      {
        key: "1",
        date: "2026-08-01",
        description: "GRN-2026-00412 Received in Full",
        type: "DR",
        amount: 120000,
        status: "BILLED",
      },
      {
        key: "2",
        date: "2026-08-04",
        description: "GRN-2026-00418 Partial Delivery",
        type: "DR",
        amount: 125000,
        status: "PARTIALLY_BILLED",
      },
      {
        key: "3",
        date: "2026-08-08",
        description: "Debit Note DN-8802 Damaged Items",
        type: "CR",
        amount: 15000,
        status: "SETTLED",
      },
    ],
  },
  render: (args) => (
    <div className="w-[850px]">
      <PaymentLedger {...args} />
    </div>
  ),
};
