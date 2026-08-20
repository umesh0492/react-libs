import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard, MetricGrid } from "../metric-card";

describe("MetricCard & MetricGrid", () => {
  it("renders metric label, value and warning indicator", () => {
    render(
      <MetricCard
        label="Pending Disputes"
        value="12"
        tone="warning"
        warning="Requires immediate review"
        change={-5.2}
      />
    );

    expect(screen.getByText("Pending Disputes")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Requires immediate review")).toBeInTheDocument();
    expect(screen.getByText("-5.2%")).toBeInTheDocument();
  });

  it("renders grid container with children", () => {
    render(
      <MetricGrid columns={2}>
        <MetricCard label="A" value="1" />
        <MetricCard label="B" value="2" />
      </MetricGrid>
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
