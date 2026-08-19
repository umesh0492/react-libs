import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { CopyButton } from "./copy-button";

const meta: Meta<typeof CopyButton> = {
  title: "Feedback/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const DefaultIcon: Story = {
  args: {
    value: "npm install @umesh0492/react-libs",
  },
  render: (args) => (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-md border border-border">
      <code className="text-sm font-mono">{args.value}</code>
      <CopyButton {...args} />
    </div>
  ),
};

export const WithTextLabel: Story = {
  args: {
    value: "https://umesh0492.github.io/react-libs/",
    showText: true,
    variant: "outline",
  },
  render: (args) => <CopyButton {...args} />,
};
