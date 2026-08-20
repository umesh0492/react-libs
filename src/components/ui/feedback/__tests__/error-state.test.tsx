import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState } from "../error-state";

describe("ErrorState", () => {
  it("renders title, description and triggers action on click", () => {
    const handleRetry = vi.fn();
    render(
      <ErrorState
        title="Failed to load ledger"
        description="Could not connect to ERP gateway."
        actionLabel="Retry Connection"
        onAction={handleRetry}
      />
    );

    expect(screen.getByText("Failed to load ledger")).toBeInTheDocument();
    expect(screen.getByText("Could not connect to ERP gateway.")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Retry Connection"));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
