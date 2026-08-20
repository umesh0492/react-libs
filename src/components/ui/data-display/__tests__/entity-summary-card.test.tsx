import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EntitySummaryCard } from "../entity-summary-card";

describe("EntitySummaryCard", () => {
  it("renders title, description, metadata chips and actions", () => {
    render(
      <EntitySummaryCard
        title="Apex Polymers & Resins"
        description="Tier-1 Industrial Plastic Raw Material Supplier"
        meta={<span>GSTIN: 24AAACA1234F1Z9</span>}
        actions={<button>Edit Supplier</button>}
      />
    );

    expect(screen.getByText("Apex Polymers & Resins")).toBeInTheDocument();
    expect(screen.getByText("Tier-1 Industrial Plastic Raw Material Supplier")).toBeInTheDocument();
    expect(screen.getByText("GSTIN: 24AAACA1234F1Z9")).toBeInTheDocument();
    expect(screen.getByText("Edit Supplier")).toBeInTheDocument();
  });
});
