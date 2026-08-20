import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressRing } from "../progress-ring";

describe("ProgressRing", () => {
  it("renders with percentage label", () => {
    render(<ProgressRing percentage={85} showLabel={true} />);
    expect(screen.getByText("85%")).toBeInTheDocument();
  });
});
