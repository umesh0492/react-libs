import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateEntityPanel } from "../create-entity-panel";

describe("CreateEntityPanel", () => {
  it("renders slide-over sheet when open is true", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <CreateEntityPanel
        open={true}
        onOpenChange={handleClose}
        title="Add Vendor Organization"
        description="Fill organization details"
        onSave={handleSave}
        saveLabel="Create Org"
      >
        <div>Form Body Inputs</div>
      </CreateEntityPanel>
    );

    expect(screen.getByText("Add Vendor Organization")).toBeInTheDocument();
    expect(screen.getByText("Fill organization details")).toBeInTheDocument();
    expect(screen.getByText("Form Body Inputs")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Create Org"));
    expect(handleSave).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalledWith(false);
  });
});
