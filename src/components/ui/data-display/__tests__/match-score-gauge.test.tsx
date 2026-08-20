import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchScoreGauge } from "../match-score-gauge";

describe("MatchScoreGauge", () => {
  it("renders match percentage and grade", () => {
    render(<MatchScoreGauge score={92} label="ATS Match Score" />);

    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("Grade A+")).toBeInTheDocument();
    expect(screen.getByText("ATS Match Score")).toBeInTheDocument();
  });
});
