import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InfoList } from "../info-list";

describe("InfoList", () => {
  it("renders key-value items with hints", () => {
    const items = [
      { label: "Entity Legal Name", value: "Acme Global Solutions Inc", hint: "Verified via Registry" },
      { label: "Tax Identification", value: "US-8492019" },
    ];

    render(<InfoList items={items} />);

    expect(screen.getByText("Entity Legal Name")).toBeInTheDocument();
    expect(screen.getByText("Acme Global Solutions Inc")).toBeInTheDocument();
    expect(screen.getByText("Verified via Registry")).toBeInTheDocument();
    expect(screen.getByText("Tax Identification")).toBeInTheDocument();
  });
});
