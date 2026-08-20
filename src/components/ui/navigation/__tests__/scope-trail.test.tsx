import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScopeTrail } from "../scope-trail";

describe("ScopeTrail", () => {
  it("renders breadcrumb trail with active item and clickable ancestor", () => {
    const handleClick = vi.fn();
    const items = [
      { label: "Organisation", value: "Mahavir Group", onClick: handleClick },
      { label: "Business Unit", value: "West Division", active: true },
    ];

    render(<ScopeTrail items={items} />);

    expect(screen.getByText("Organisation")).toBeInTheDocument();
    expect(screen.getByText(/Mahavir Group/)).toBeInTheDocument();
    expect(screen.getByText("Business Unit")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Organisation"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
