import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContextChip } from "../context-chip";

describe("ContextChip", () => {
  it("renders label and value with tone styling", () => {
    render(<ContextChip label="Status" value="Approved" tone="emerald" />);
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });
});
