import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Timeline, TimelineItem } from "./timeline";

const meta: Meta<typeof Timeline> = {
  title: "Data Display/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const sampleEvents: TimelineItem[] = [
  {
    title: "Order Delivered",
    description: "Package was safely delivered to customer address.",
    timestamp: "Just now",
    status: "success",
  },
  {
    title: "Out for Delivery",
    description: "Courier partner picked up package from distribution center.",
    timestamp: "2 hours ago",
    status: "info",
  },
  {
    title: "Payment Confirmed",
    description: "Transaction ID #TXN-98421 settled via UPI.",
    timestamp: "Yesterday, 4:30 PM",
    status: "success",
  },
  {
    title: "Order Placed",
    description: "Customer placed order for 3 items.",
    timestamp: "Yesterday, 4:15 PM",
    status: "default",
  },
];

export const Default: Story = {
  args: {
    items: sampleEvents,
  },
  render: (args) => (
    <div className="w-[450px] p-6 bg-card border border-border rounded-lg">
      <Timeline {...args} />
    </div>
  ),
};
