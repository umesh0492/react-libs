import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PipelineKanban, KanbanColumn } from "../pipeline-kanban";

describe("PipelineKanban", () => {
  const columns: KanbanColumn[] = [
    {
      id: "screened",
      title: "Screened (90%+ ATS)",
      tone: "emerald",
      items: [
        { id: "c1", title: "Aarav Sharma", subtitle: "Senior Fullstack", score: 94 },
      ],
    },
    {
      id: "interview",
      title: "Technical Round",
      tone: "indigo",
      items: [],
    },
  ];

  it("renders columns and card items", () => {
    const handleCardClick = vi.fn();
    render(<PipelineKanban columns={columns} onCardClick={handleCardClick} />);

    expect(screen.getByText("Screened (90%+ ATS)")).toBeInTheDocument();
    expect(screen.getByText("Aarav Sharma")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Aarav Sharma"));
    expect(handleCardClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "c1" }),
      "screened"
    );
  });
});
