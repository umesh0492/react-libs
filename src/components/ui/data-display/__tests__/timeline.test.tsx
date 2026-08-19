import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Timeline, TimelineItem } from "../timeline";

const items: TimelineItem[] = [
  {
    title: "Deployment Completed",
    description: "Version 0.1.0 rolled out to production",
    timestamp: "10 mins ago",
    status: "success",
  },
  {
    title: "Build Started",
    description: "GitHub Actions CI pipeline triggered",
    timestamp: "15 mins ago",
    status: "info",
  },
];

describe("Timeline", () => {
  it("renders timeline items with titles and timestamps", () => {
    render(<Timeline items={items} />);
    expect(screen.getByText("Deployment Completed")).toBeInTheDocument();
    expect(screen.getByText("Version 0.1.0 rolled out to production")).toBeInTheDocument();
    expect(screen.getByText("10 mins ago")).toBeInTheDocument();
    expect(screen.getByText("Build Started")).toBeInTheDocument();
  });
});
