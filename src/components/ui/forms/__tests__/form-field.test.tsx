import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "../form-field";

describe("Simple FormField", () => {
  it("renders label, required indicator, description and error", () => {
    render(
      <FormField
        label="GSTIN Number"
        required={true}
        description="Enter 15-digit GSTIN"
        error="Invalid GSTIN format"
      >
        <input placeholder="GSTIN" />
      </FormField>
    );

    expect(screen.getByText("GSTIN Number")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("Enter 15-digit GSTIN")).toBeInTheDocument();
    expect(screen.getByText("Invalid GSTIN format")).toBeInTheDocument();
  });
});
