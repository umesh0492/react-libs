import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StageProgression } from "../stage-progression";

describe("StageProgression", () => {
  const stages = [
    { id: 1, name: "Intern (0y)" },
    { id: 2, name: "Fresher (0-1y)" },
    { id: 3, name: "Mid (3-5y)", target: "90% ATS" },
  ];

  it("renders stages with active selection", () => {
    render(
      <StageProgression
        stages={stages}
        activeStage={3}
      />
    );

    expect(screen.getByText("Intern (0y)")).toBeInTheDocument();
    expect(screen.getByText("Fresher (0-1y)")).toBeInTheDocument();
    expect(screen.getByText("Mid (3-5y)")).toBeInTheDocument();
  });
});
