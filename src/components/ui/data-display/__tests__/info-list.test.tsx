import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InfoList } from "../info-list";

describe("InfoList", () => {
  it("renders key-value items with hints", () => {
    const items = [
      { label: "Entity Legal Name", value: "Mahavir Packaging Pvt Ltd", hint: "Verified via GSTN" },
      { label: "PAN Number", value: "AAACM1234F" },
    ];

    render(<InfoList items={items} />);

    expect(screen.getByText("Entity Legal Name")).toBeInTheDocument();
    expect(screen.getByText("Mahavir Packaging Pvt Ltd")).toBeInTheDocument();
    expect(screen.getByText("Verified via GSTN")).toBeInTheDocument();
    expect(screen.getByText("PAN Number")).toBeInTheDocument();
  });
});
