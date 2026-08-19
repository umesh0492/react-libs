import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Banner } from "../banner";

describe("Banner", () => {
  it("renders banner title and content", () => {
    render(
      <Banner title="Notice:" variant="info">
        Scheduled maintenance tomorrow
      </Banner>
    );
    expect(screen.getByText("Notice:")).toBeInTheDocument();
    expect(screen.getByText("Scheduled maintenance tomorrow")).toBeInTheDocument();
  });

  it("handles dismiss button click", () => {
    const handleClose = vi.fn();
    render(
      <Banner dismissible onClose={handleClose}>
        Dismissible message
      </Banner>
    );

    const closeBtn = screen.getByLabelText("Dismiss banner");
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
    expect(screen.queryByText("Dismissible message")).not.toBeInTheDocument();
  });

  it("handles action button click", () => {
    const handleAction = vi.fn();
    render(
      <Banner
        action={{
          label: "View details",
          onClick: handleAction,
        }}
      >
        Alert message
      </Banner>
    );

    const actionBtn = screen.getByRole("button", { name: "View details" });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalled();
  });
});
