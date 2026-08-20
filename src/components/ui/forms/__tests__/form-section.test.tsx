import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormSection } from "../form-section";

describe("FormSection", () => {
  it("renders title, description, actions and children", () => {
    render(
      <FormSection
        title="Bank Account Details"
        description="Provide validated IFSC and account numbers."
        actions={<button>Validate</button>}
      >
        <div>Form Content Inside</div>
      </FormSection>
    );

    expect(screen.getByText("Bank Account Details")).toBeInTheDocument();
    expect(screen.getByText("Provide validated IFSC and account numbers.")).toBeInTheDocument();
    expect(screen.getByText("Validate")).toBeInTheDocument();
    expect(screen.getByText("Form Content Inside")).toBeInTheDocument();
  });
});
