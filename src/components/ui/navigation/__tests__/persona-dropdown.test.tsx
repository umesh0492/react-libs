import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonaDropdown } from "../persona-dropdown";

describe("PersonaDropdown", () => {
  const personas = [
    { id: "workspace_admin", title: "Workspace Admin", subtitle: "Full administration authority" },
    { id: "project_member", title: "Project Member", subtitle: "Standard project access" },
  ];

  it("renders trigger label with active persona", () => {
    const handleSelect = vi.fn();
    render(
      <PersonaDropdown
        personas={personas}
        activePersonaId="workspace_admin"
        onSelectPersona={handleSelect}
      />
    );

    expect(screen.getByText("Workspace Admin")).toBeInTheDocument();
  });
});
