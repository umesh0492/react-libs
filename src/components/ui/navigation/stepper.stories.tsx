import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Stepper, StepItem } from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const sampleSteps: StepItem[] = [
  { title: "Account Details", description: "Email and password setup" },
  { title: "Profile Info", description: "Company and domain details" },
  { title: "Plan Selection", description: "Choose a subscription plan" },
  { title: "Verification", description: "Confirm and launch" },
];

export const Horizontal: Story = {
  render: () => {
    const [active, setActive] = React.useState(1);
    return (
      <div className="w-[600px] p-6 bg-card border border-border rounded-lg">
        <Stepper
          steps={sampleSteps}
          activeStep={active}
          clickable
          onStepClick={setActive}
        />
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setActive((prev) => Math.max(0, prev - 1))}
            disabled={active === 0}
            className="px-3 py-1.5 border rounded text-xs disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setActive((prev) => Math.min(sampleSteps.length - 1, prev + 1))}
            disabled={active === sampleSteps.length - 1}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => (
    <div className="w-[320px] p-6 bg-card border border-border rounded-lg">
      <Stepper
        steps={sampleSteps}
        activeStep={2}
        orientation="vertical"
      />
    </div>
  ),
};
