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

  it("properly renders explicit column count and custom scoreLabel", () => {
    const customCols: KanbanColumn[] = [
      {
        id: "active",
        title: "In Review",
        count: 42,
        items: [
          {
            id: "t1",
            title: "Security Audit Task",
            scoreLabel: "High",
            tag: "P0",
          },
        ],
      },
    ];

    render(<PipelineKanban columns={customCols} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("P0")).toBeInTheDocument();
  });

  it("renders custom empty message when column has no items", () => {
    const emptyCol: KanbanColumn[] = [
      {
        id: "done",
        title: "Completed",
        items: [],
        emptyMessage: "No tasks finished yet",
      },
    ];

    render(<PipelineKanban columns={emptyCol} />);

    expect(screen.getByText("No tasks finished yet")).toBeInTheDocument();
  });
});
