import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaymentLedger, LedgerEntry } from "../payment-ledger";

describe("PaymentLedger", () => {
  it("renders empty state when no entries are passed", () => {
    render(<PaymentLedger ledgerEntries={[]} />);
    expect(screen.getByText("Ledger is empty")).toBeInTheDocument();
  });

  it("renders debit and credit rows with running totals", () => {
    const entries: LedgerEntry[] = [
      {
        key: "1",
        date: "2026-08-01",
        description: "PO-2026-001 Goods Received",
        type: "DR",
        amount: 50000,
        status: "BILLED",
      },
      {
        key: "2",
        date: "2026-08-05",
        description: "Debit Note DN-001",
        type: "CR",
        amount: 5000,
        status: "SETTLED",
      },
    ];

    render(
      <PaymentLedger
        ledgerEntries={entries}
        totalDR={50000}
        totalCR={5000}
        netLabel="Net Outstanding"
      />
    );

    expect(screen.getByText("PO-2026-001 Goods Received")).toBeInTheDocument();
    expect(screen.getByText("Debit Note DN-001")).toBeInTheDocument();
    expect(screen.getByText("Net Outstanding")).toBeInTheDocument();
  });
});
