import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadarSweep } from "../radar-sweep";

describe("RadarSweep", () => {
  it("renders status text and blips", () => {
    const blips = [
      { id: "1", x: 45, y: 30, label: "Senior Go Engineer", tone: "emerald" as const },
      { id: "2", x: 70, y: 60, label: "Staff React Engineer", tone: "indigo" as const },
    ];

    render(
      <RadarSweep blips={blips} statusText="Scanning for Job Matches..." />
    );

    expect(screen.getByText("Scanning for Job Matches...")).toBeInTheDocument();
    expect(screen.getByText("Senior Go Engineer")).toBeInTheDocument();
  });
});
