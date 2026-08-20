import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { MatchScoreGauge } from "./match-score-gauge";

const meta: Meta<typeof MatchScoreGauge> = {
  title: "Data Display/MatchScoreGauge",
  component: MatchScoreGauge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof MatchScoreGauge>;

export const Default: Story = {
  args: {
    score: 94,
    label: "ATS Match Score",
    sublabel: "Target Score: 90%+",
  },
};

export const ProgressionList: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <MatchScoreGauge score={95} label="High Match" />
      <MatchScoreGauge score={74} label="Moderate Match" />
      <MatchScoreGauge score={42} label="Low Match" />
    </div>
  ),
};
