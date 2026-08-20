import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OnboardingPanel } from "../onboarding-panel";

describe("OnboardingPanel", () => {
  const steps = [
    { title: "Entity Details" },
    { title: "Tax & Bank" },
    { title: "Review" },
  ];

  it("renders stepper, title, children and back/continue actions", () => {
    const handleContinue = vi.fn();
    const handleBack = vi.fn();

    render(
      <OnboardingPanel
        activeStep={1}
        steps={steps}
        title="Tax & Bank Verification"
        subtitle="Fill your verified banking details"
        onContinue={handleContinue}
        onBack={handleBack}
      >
        <div>Step 2 Content Form</div>
      </OnboardingPanel>
    );

    expect(screen.getByText("Tax & Bank Verification")).toBeInTheDocument();
    expect(screen.getByText("Fill your verified banking details")).toBeInTheDocument();
    expect(screen.getByText("Step 2 Content Form")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Save & Continue/i));
    expect(handleContinue).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/Back/i));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});
