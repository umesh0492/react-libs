import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { RadarSweep } from "./radar-sweep";

const meta: Meta<typeof RadarSweep> = {
  title: "Data Display/RadarSweep",
  component: RadarSweep,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof RadarSweep>;

export const Default: Story = {
  args: {
    size: 340,
    statusText: "AI Job Radar: Sweeping 10,000+ Verified Roles",
    blips: [
      { id: "1", x: 35, y: 25, label: "Staff Distributed Systems Engineer (₹45L)", tone: "emerald" },
      { id: "2", x: 65, y: 40, label: "VP of Engineering (₹85L)", tone: "purple" as any },
      { id: "3", x: 45, y: 70, label: "Senior Fullstack Engineer (₹32L)", tone: "indigo" },
      { id: "4", x: 80, y: 65, label: "Lead AI Architect (₹60L)", tone: "amber" },
    ],
  },
};
