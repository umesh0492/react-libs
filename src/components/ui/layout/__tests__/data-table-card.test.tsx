import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTableCard } from "../data-table-card";

describe("DataTableCard", () => {
  it("renders card title, description and actions", () => {
    render(
      <DataTableCard
        title="Purchase Orders"
        description="All orders placed within last 30 days"
        actions={<button>Create Order</button>}
      >
        <table>
          <tbody>
            <tr>
              <td>PO-2026-001</td>
            </tr>
          </tbody>
        </table>
      </DataTableCard>
    );

    expect(screen.getByText("Purchase Orders")).toBeInTheDocument();
    expect(screen.getByText("All orders placed within last 30 days")).toBeInTheDocument();
    expect(screen.getByText("Create Order")).toBeInTheDocument();
    expect(screen.getByText("PO-2026-001")).toBeInTheDocument();
  });
});
