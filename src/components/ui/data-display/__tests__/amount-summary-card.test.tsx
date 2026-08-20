import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AmountSummaryCard } from "../amount-summary-card";

describe("AmountSummaryCard", () => {
  it("calculates totals and renders tax breakdown", () => {
    render(
      <AmountSummaryCard
        baseAmount={10000}
        gstAmount={1800}
        tdsPercentage={2}
        isIntraState={true}
      />
    );

    expect(screen.getByText("Amount Summary")).toBeInTheDocument();
    expect(screen.getByText("Base Cost")).toBeInTheDocument();
    expect(screen.getByText("CGST")).toBeInTheDocument();
    expect(screen.getByText("SGST")).toBeInTheDocument();
    expect(screen.getByText("TDS (2%)")).toBeInTheDocument();
  });
});
