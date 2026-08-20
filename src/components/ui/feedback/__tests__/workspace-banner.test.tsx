import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkspaceBanner } from "../workspace-banner";

describe("WorkspaceBanner", () => {
  it("renders title and subtitle", () => {
    render(
      <WorkspaceBanner
        title="Admin Control Tower"
        subtitle="Manage cross-organization policies and KYC approvals."
      />
    );

    expect(screen.getByText("Admin Control Tower")).toBeInTheDocument();
    expect(screen.getByText("Manage cross-organization policies and KYC approvals.")).toBeInTheDocument();
  });
});
