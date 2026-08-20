import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BilingualTooltip } from "../bilingual-tooltip";

describe("BilingualTooltip", () => {
  it("renders translated label and currency values", () => {
    render(
      <BilingualTooltip
        active={true}
        label="Month"
        language="hi"
        formatCurrency={true}
        payload={[{ name: "amount", value: 150000, color: "#6366f1" }]}
      />
    );

    expect(screen.getByText("महीना")).toBeInTheDocument();
    expect(screen.getByText("राशि")).toBeInTheDocument();
    expect(screen.getByText("₹1.50 L")).toBeInTheDocument();
  });
});
