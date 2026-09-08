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

  it("renders badge variant with custom currency symbol and period", () => {
    render(
      <SalaryRangeDisplay
        min={45}
        max={65}
        currencySymbol="€"
        unit="k"
        period="yr"
        variant="badge"
      />
    );
    expect(screen.getByText("€45k - €65k")).toBeInTheDocument();
    expect(screen.getByText("yr")).toBeInTheDocument();
  });

  it("renders card variant with generic fixed, variable, and equity breakdown", () => {
    render(
      <SalaryRangeDisplay
        min={150}
        max={200}
        unit="k"
        currencySymbol="$"
        period="yr"
        variant="card"
        breakdown={{ fixed: 140, variable: 30, equity: 35 }}
      />
    );

    expect(screen.getByText("$150k - $200k yr")).toBeInTheDocument();
    expect(screen.getByText("$140k")).toBeInTheDocument();
    expect(screen.getByText("$30k")).toBeInTheDocument();
    expect(screen.getByText("$35k")).toBeInTheDocument();
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
