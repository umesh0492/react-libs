import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OnboardingNotice } from "../onboarding-notice";

describe("OnboardingNotice", () => {
  it("renders messages with different tones", () => {
    const { rerender } = render(
      <OnboardingNotice tone="warning" message="Tax ID verification pending." />
    );
    expect(screen.getByText("Tax ID verification pending.")).toBeInTheDocument();

    rerender(
      <OnboardingNotice tone="success" message="Bank Account Verified Successfully." />
    );
    expect(screen.getByText("Bank Account Verified Successfully.")).toBeInTheDocument();
  });
});
