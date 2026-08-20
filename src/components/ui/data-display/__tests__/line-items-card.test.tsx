import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineItemsCard, LineItem } from "../line-items-card";

describe("LineItemsCard", () => {
  const items: LineItem[] = [
    {
      name: "High Density Polyethylene Granules",
      hsn_code: "39011010",
      ordered_qty: 100,
      unit: "KG",
      base_price: 150,
      total_amount: 15000,
      bill_status: "BILLED",
    },
  ];

  it("renders line items with HSN, quantity, and total amount", () => {
    render(<LineItemsCard items={items} showBillStatus={true} />);

    expect(screen.getByText("High Density Polyethylene Granules")).toBeInTheDocument();
    expect(screen.getByText("39011010")).toBeInTheDocument();
    expect(screen.getByText("100 KG")).toBeInTheDocument();
    expect(screen.getByText("BILLED")).toBeInTheDocument();
  });
});
