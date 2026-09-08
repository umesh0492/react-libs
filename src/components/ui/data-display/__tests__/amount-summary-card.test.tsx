import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AmountSummaryCard } from "../amount-summary-card";

describe("AmountSummaryCard", () => {
  it("calculates totals and renders individual tax items", () => {
    render(
      <AmountSummaryCard
        baseAmount={10000}
        taxes={[
          { label: "Sales Tax", amount: 800 },
          { label: "Municipal Surcharge", amount: 150 },
        ]}
        withholdingPercentage={2}
        shippingCost={250}
      />
    );

    expect(screen.getByText("Amount Summary")).toBeInTheDocument();
    expect(screen.getByText("Base Cost")).toBeInTheDocument();
    expect(screen.getByText("Sales Tax")).toBeInTheDocument();
    expect(screen.getByText("Municipal Surcharge")).toBeInTheDocument();
    expect(screen.getByText("Withholding (2%)")).toBeInTheDocument();
    expect(screen.getByText("Logistics & Shipping")).toBeInTheDocument();
  });

  it("renders single tax amount with custom label", () => {
    render(
      <AmountSummaryCard
        baseAmount={5000}
        taxAmount={500}
        taxLabel="VAT (10%)"
      />
    );

    expect(screen.getByText("VAT (10%)")).toBeInTheDocument();
  });
});
