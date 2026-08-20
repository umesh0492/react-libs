import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SalaryRangeDisplay } from "../salary-range-display";

describe("SalaryRangeDisplay", () => {
  it("renders badge variant with currency range", () => {
    render(<SalaryRangeDisplay minLakhs={24} maxLakhs={36} variant="badge" />);
    expect(screen.getByText("₹24L - ₹36L")).toBeInTheDocument();
    expect(screen.getByText("PA")).toBeInTheDocument();
  });

  it("renders card variant with fixed, variable, and ESOP components", () => {
    render(
      <SalaryRangeDisplay
        minLakhs={40}
        maxLakhs={55}
        variant="card"
        breakdown={{ fixedLakhs: 35, variableLakhs: 10, esopsLakhs: 8 }}
      />
    );

    expect(screen.getByText("Compensation Range")).toBeInTheDocument();
    expect(screen.getByText("₹40L - ₹55L PA")).toBeInTheDocument();
    expect(screen.getByText("₹35L")).toBeInTheDocument();
    expect(screen.getByText("₹10L")).toBeInTheDocument();
    expect(screen.getByText("₹8L")).toBeInTheDocument();
  });
});
