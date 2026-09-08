import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressRing } from "../progress-ring";

describe("ProgressRing", () => {
  it("renders with percentage label", () => {
    render(<ProgressRing percentage={85} showLabel={true} />);
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("supports arbitrary hex color as stroke attribute", () => {
    const { container } = render(
      <ProgressRing percentage={60} color="#6366f1" aria-label="Test Meter" />
    );
    const meter = screen.getByRole("progressbar", { name: "Test Meter" });
    expect(meter).toHaveAttribute("aria-valuenow", "60");
    const circles = container.querySelectorAll("circle");
    expect(circles[1]).toHaveAttribute("stroke", "#6366f1");
  });
});
