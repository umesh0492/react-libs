import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";
import { KPICard } from "./kpi-card";

const meta: Meta<typeof KPICard> = {
  title: "Data Display/KPICard",
  component: KPICard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof KPICard>;

export const Default: Story = {
  args: {
    title: "Total Revenue",
    value: "45,231.89",
    prefix: "$",
    change: 20.1,
    changePeriod: "vs last month",
    icon: <DollarSign className="h-4 w-4" />,
  },
  render: (args) => (
    <div className="w-[300px]">
      <KPICard {...args} />
    </div>
  ),
};

export const NegativeTrend: Story = {
  args: {
    title: "Active Subscriptions",
    value: "2,350",
    change: -4.5,
    changePeriod: "vs last week",
    icon: <Users className="h-4 w-4" />,
  },
  render: (args) => (
    <div className="w-[300px]">
      <KPICard {...args} />
    </div>
  ),
};

export const GridMetrics: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-[800px]">
      <KPICard
        title="Total Revenue"
        value="124,500"
        prefix="₹"
        change={18.2}
        changePeriod="vs last quarter"
        icon={<DollarSign className="h-4 w-4" />}
      />
      <KPICard
        title="Active Orders"
        value="1,429"
        change={-2.4}
        changePeriod="vs yesterday"
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      <KPICard
        title="System Uptime"
        value="99.98"
        suffix="%"
        change={0}
        changePeriod="past 30 days"
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  ),
};
