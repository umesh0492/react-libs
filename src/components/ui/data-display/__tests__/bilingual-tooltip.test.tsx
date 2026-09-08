import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BilingualTooltip } from "../bilingual-tooltip";

describe("BilingualTooltip", () => {
  it("renders with clean neutral defaults and standard currency", () => {
    render(
      <BilingualTooltip
        active={true}
        label="Month"
        formatCurrency={true}
        payload={[{ name: "amount", value: 150000, color: "#6366f1" }]}
      />
    );

    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("amount")).toBeInTheDocument();
    expect(screen.getByText("$150,000")).toBeInTheDocument();
  });

  it("renders translated label and custom currency via configurable dictionary and locale", () => {
    render(
      <BilingualTooltip
        active={true}
        label="Month"
        language="es"
        dictionary={{
          es: { Month: "Mes", amount: "Cantidad" },
        }}
        currencySymbol="€"
        formatCurrency={true}
        payload={[{ name: "amount", value: 150000, color: "#6366f1" }]}
      />
    );

    expect(screen.getByText("Mes")).toBeInTheDocument();
    expect(screen.getByText("Cantidad")).toBeInTheDocument();
    expect(screen.getByText("€150,000")).toBeInTheDocument();
  });

  it("renders with direct translations / labelMap prop", () => {
    render(
      <BilingualTooltip
        active={true}
        label="Period"
        labelMap={{ Period: "Trimestre", revenue: "Revenus" }}
        payload={[{ name: "revenue", value: 25000 }]}
      />
    );

    expect(screen.getByText("Trimestre")).toBeInTheDocument();
    expect(screen.getByText("Revenus")).toBeInTheDocument();
  });

  it("renders percentage and custom formatter", () => {
    render(
      <BilingualTooltip
        active={true}
        formatPercent={true}
        payload={[{ name: "conversion", value: 12.5 }]}
      />
    );

    expect(screen.getByText("12.5%")).toBeInTheDocument();
  });

  it("returns null when inactive or payload is empty", () => {
    const { container } = render(
      <BilingualTooltip active={false} payload={[{ name: "metric", value: 10 }]} />
    );
    expect(container.firstChild).toBeNull();
  });
});
