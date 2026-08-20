import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { StageProgression } from "./stage-progression";

const meta: Meta<typeof StageProgression> = {
  title: "Navigation/StageProgression",
  component: StageProgression,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof StageProgression>;

const careerStages = [
  { id: 1, name: "Intern (0y)" },
  { id: 2, name: "Fresher (0-1y)" },
  { id: 3, name: "Junior (1-3y)" },
  { id: 4, name: "Mid (3-5y)", target: "90% ATS" },
  { id: 5, name: "Senior (5-8y)" },
  { id: 6, name: "Lead (8-10y)" },
  { id: 7, name: "Head (10-12y)" },
  { id: 8, name: "Director (15+y)" },
];

export const Horizontal: Story = {
  render: () => {
    const [active, setActive] = React.useState<number | string>(4);
    return (
      <div className="w-[750px]">
        <StageProgression
          stages={careerStages}
          activeStage={active}
          onSelectStage={setActive}
        />
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [active, setActive] = React.useState<number | string>(4);
    return (
      <div className="w-[380px]">
        <StageProgression
          stages={careerStages.slice(0, 4)}
          activeStage={active}
          onSelectStage={setActive}
          orientation="vertical"
        />
      </div>
    );
  },
};
