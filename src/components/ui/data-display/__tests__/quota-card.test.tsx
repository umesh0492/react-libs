import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuotaCard } from "../quota-card";

describe("QuotaCard", () => {
  it("renders quota metrics and upgrade action", () => {
    const handleUpgrade = vi.fn();
    render(
      <QuotaCard
        title="Candidate Contact Unlocks"
        used={15}
        total={20}
        unitLabel="unlocks"
        actionLabel="Upgrade Plan"
        onAction={handleUpgrade}
      />
    );

    expect(screen.getByText("Candidate Contact Unlocks")).toBeInTheDocument();
    expect(screen.getByText("5 of 20 unlocks remaining")).toBeInTheDocument();
    expect(screen.getByText("75% used")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Upgrade Plan"));
    expect(handleUpgrade).toHaveBeenCalledTimes(1);
  });
});
