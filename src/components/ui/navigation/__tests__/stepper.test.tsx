import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Stepper, StepItem } from "../stepper";

const steps: StepItem[] = [
  { title: "Step 1", description: "First Step" },
  { title: "Step 2", description: "Second Step" },
  { title: "Step 3", description: "Final Step" },
];

describe("Stepper", () => {
  it("renders all step titles and descriptions", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("First Step")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("handles onStepClick when clickable", () => {
    const handleStepClick = vi.fn();
    render(
      <Stepper
        steps={steps}
        activeStep={0}
        clickable
        onStepClick={handleStepClick}
      />
    );

    const stepButtons = screen.getAllByRole("button");
    fireEvent.click(stepButtons[2]);
    expect(handleStepClick).toHaveBeenCalledWith(2);
  });

  it("renders vertical orientation class", () => {
    const { container } = render(
      <Stepper
        steps={steps}
        activeStep={1}
        orientation="vertical"
      />
    );
    expect(container.firstChild).toHaveClass("flex-col");
  });
});
