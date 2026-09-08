import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "../loading-state";

describe("LoadingState", () => {
  it("renders spinner and custom label", () => {
    render(<LoadingState label="Fetching invoices..." />);
    expect(screen.getByText("Fetching invoices...")).toBeInTheDocument();
  });
});
