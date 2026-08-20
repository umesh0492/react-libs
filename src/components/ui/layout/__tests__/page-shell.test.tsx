import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageShell } from "../page-shell";
import { PageSection } from "../page-section";
import { PageActions } from "../page-actions";
import { SectionHeader } from "../section-header";

describe("Layout Components (PageShell, PageSection, PageActions, SectionHeader)", () => {
  it("renders page hierarchy properly", () => {
    render(
      <PageShell>
        <SectionHeader
          title="Procurement Dashboard"
          description="Manage active purchase orders"
          actions={<PageActions><button>Export</button></PageActions>}
        />
        <PageSection>
          <div>Section Content</div>
        </PageSection>
      </PageShell>
    );

    expect(screen.getByText("Procurement Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Manage active purchase orders")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
    expect(screen.getByText("Section Content")).toBeInTheDocument();
  });
});
