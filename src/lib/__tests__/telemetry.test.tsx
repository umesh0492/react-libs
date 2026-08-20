import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { withAuditTrail, setGlobalAuditLogger } from "../telemetry";

describe("withAuditTrail Telemetry HOC", () => {
  it("triggers custom auditLogger and onClick when clicked", () => {
    const mockLogger = vi.fn();
    const mockClick = vi.fn();

    const TestButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>Click Me</button>
    );

    const AuditedButton = withAuditTrail(TestButton);

    render(
      <AuditedButton
        actionName="DOWNLOAD_REPORT"
        entityId="REP-001"
        entityType="Report"
        auditLogger={mockLogger}
        onClick={mockClick}
      />
    );

    fireEvent.click(screen.getByText("Click Me"));

    expect(mockClick).toHaveBeenCalledTimes(1);
    expect(mockLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        actionName: "DOWNLOAD_REPORT",
        entityId: "REP-001",
        entityType: "Report",
      })
    );
  });

  it("uses global audit logger when component-level logger is not provided", () => {
    const globalLogger = vi.fn();
    setGlobalAuditLogger(globalLogger);

    const TestBtn = (props: any) => <button {...props}>Global Click</button>;
    const AuditedBtn = withAuditTrail(TestBtn);

    render(<AuditedBtn actionName="USER_LOGOUT" />);
    fireEvent.click(screen.getByText("Global Click"));

    expect(globalLogger).toHaveBeenCalledWith(
      expect.objectContaining({ actionName: "USER_LOGOUT" })
    );

    setGlobalAuditLogger(null);
  });
});
