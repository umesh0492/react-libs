import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilterBar } from "../filter-bar";

describe("FilterBar", () => {
  it("renders filter bar with child filters", () => {
    render(
      <FilterBar>
        <input placeholder="Search orders..." />
        <button>Apply</button>
      </FilterBar>
    );

    expect(screen.getByPlaceholderText("Search orders...")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });
});
