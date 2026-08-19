import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "./banner";

const meta: Meta<typeof Banner> = {
  title: "Feedback/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Informational: Story = {
  args: {
    variant: "info",
    title: "System Update:",
    children: "Scheduled maintenance will occur on Sunday at 02:00 UTC.",
    dismissible: true,
    action: {
      label: "Learn more",
      onClick: () => alert("Learn more clicked"),
    },
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "New Release v0.1.0:",
    children: "Enterprise UI component suite is now live!",
    dismissible: true,
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Action Required:",
    children: "Please verify your account settings before the end of the billing cycle.",
    dismissible: true,
    action: {
      label: "Verify now",
      onClick: () => alert("Verify clicked"),
    },
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    title: "Connection Lost:",
    children: "Unable to reach database service. Retrying in 5 seconds...",
    dismissible: false,
  },
};
