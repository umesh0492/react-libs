import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImpersonationBanner } from "../impersonation-banner";

describe("ImpersonationBanner", () => {
  it("renders impersonated user information and exits impersonation", () => {
    const handleExit = vi.fn();
    render(
      <ImpersonationBanner
        impersonatedUser={{
          name: "Rajesh Sharma",
          email: "rajesh@mahavir.com",
          role: "Seller Admin",
          orgName: "Mahavir Packaging",
        }}
        onEndImpersonation={handleExit}
      />
    );

    expect(screen.getByText(/Rajesh Sharma/)).toBeInTheDocument();
    expect(screen.getByText(/Seller Admin/)).toBeInTheDocument();
    expect(screen.getByText(/Mahavir Packaging/)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Exit Impersonation/i));
    expect(handleExit).toHaveBeenCalledTimes(1);
  });
});
