import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TableToolbar } from "../table-toolbar";

describe("TableToolbar", () => {
  it("renders toolbar children properly", () => {
    render(
      <TableToolbar>
        <span>12 items selected</span>
        <button>Export Selected</button>
      </TableToolbar>
    );

    expect(screen.getByText("12 items selected")).toBeInTheDocument();
    expect(screen.getByText("Export Selected")).toBeInTheDocument();
  });
});
