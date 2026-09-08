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

  it("renders clean neutral defaults without explicit unitLabel", () => {
    render(<QuotaCard title="API Credits" used={200} total={1000} />);

    expect(screen.getByText("API Credits")).toBeInTheDocument();
    expect(screen.getByText("800 of 1000 units remaining")).toBeInTheDocument();
    expect(screen.getByText("20% used")).toBeInTheDocument();
  });

  it("supports custom description and formatPercentage", () => {
    render(
      <QuotaCard
        title="Storage Consumption"
        used={80}
        total={100}
        description="20 GB remaining until limit"
        formatPercentage={(pct) => `${pct}% consumed`}
      />
    );

    expect(screen.getByText("20 GB remaining until limit")).toBeInTheDocument();
    expect(screen.getByText("80% consumed")).toBeInTheDocument();
  });
});
