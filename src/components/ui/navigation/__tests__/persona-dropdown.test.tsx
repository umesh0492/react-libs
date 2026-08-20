import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonaDropdown } from "../persona-dropdown";

describe("PersonaDropdown", () => {
  const personas = [
    { id: "buyer_admin", title: "Buyer Admin", subtitle: "Full procurement authority" },
    { id: "seller_admin", title: "Seller Admin", subtitle: "Order fulfillment & catalog" },
  ];

  it("renders trigger label with active persona", () => {
    const handleSelect = vi.fn();
    render(
      <PersonaDropdown
        personas={personas}
        activePersonaId="buyer_admin"
        onSelectPersona={handleSelect}
      />
    );

    expect(screen.getByText("Buyer Admin")).toBeInTheDocument();
  });
});
