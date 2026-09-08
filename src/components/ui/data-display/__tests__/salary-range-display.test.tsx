import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  SalaryRangeDisplay,
  MetricRangeDisplay,
} from "../salary-range-display";

describe("SalaryRangeDisplay", () => {
  it("renders badge variant with default dollar currency and period", () => {
    render(<SalaryRangeDisplay min={80} max={120} unit="k" variant="badge" />);
    expect(screen.getByText("$80k - $120k")).toBeInTheDocument();
    expect(screen.getByText("yr")).toBeInTheDocument();
  });

  it("renders badge variant with custom currency symbol and backwards-compatible lakhs", () => {
    render(
      <SalaryRangeDisplay
        minLakhs={24}
        maxLakhs={36}
        currencySymbol="₹"
        period="PA"
        variant="badge"
      />
    );
    expect(screen.getByText("₹24L - ₹36L")).toBeInTheDocument();
    expect(screen.getByText("PA")).toBeInTheDocument();
  });

  it("renders card variant with fixed, variable, and equity components", () => {
    render(
      <SalaryRangeDisplay
        minLakhs={40}
        maxLakhs={55}
        currencySymbol="₹"
        period="PA"
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

  it("renders generic MetricRangeDisplay with custom title and generic items", () => {
    render(
      <MetricRangeDisplay
        min={10}
        max={25}
        unit="ms"
        currencySymbol=""
        period=""
        label="Latency SLA"
        variant="card"
        items={[
          { label: "P50", value: "10ms" },
          { label: "P95", value: "18ms" },
          { label: "P99", value: "24ms" },
        ]}
      />
    );

    expect(screen.getByText("Latency SLA")).toBeInTheDocument();
    expect(screen.getByText("10ms - 25ms")).toBeInTheDocument();
    expect(screen.getByText("P50")).toBeInTheDocument();
    expect(screen.getByText("10ms")).toBeInTheDocument();
    expect(screen.getByText("P99")).toBeInTheDocument();
    expect(screen.getByText("24ms")).toBeInTheDocument();
  });
});
