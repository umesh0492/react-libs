import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KPICard } from "../kpi-card";

describe("KPICard", () => {
  it("renders metric title, value, and prefix/suffix", () => {
    render(
      <KPICard
        title="Monthly Sales"
        value="52,400"
        prefix="$"
        suffix="USD"
      />
    );
    expect(screen.getByText("Monthly Sales")).toBeInTheDocument();
    expect(screen.getByText("52,400")).toBeInTheDocument();
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renders positive trend badge", () => {
    render(
      <KPICard
        title="Revenue"
        value="10,000"
        change={15.4}
        changePeriod="vs last month"
      />
    );
    expect(screen.getByText("+15.4%")).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("renders negative trend badge", () => {
    render(
      <KPICard
        title="Churn"
        value="3.2"
        change={-1.5}
        changePeriod="vs last week"
      />
    );
    expect(screen.getByText("-1.5%")).toBeInTheDocument();
  });
});
