import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DetailGrid } from "../detail-grid";

describe("DetailGrid", () => {
  it("renders with specified column configuration", () => {
    render(
      <DetailGrid columns={3}>
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </DetailGrid>
    );

    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
    expect(screen.getByText("Card 3")).toBeInTheDocument();
  });
});
