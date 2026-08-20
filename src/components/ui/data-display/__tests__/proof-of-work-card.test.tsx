import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProofOfWorkCard, ProofOfWorkItem } from "../proof-of-work-card";

describe("ProofOfWorkCard", () => {
  const item: ProofOfWorkItem = {
    title: "High Throughput Ingestion Pipeline",
    type: "github",
    description: "Go-based Kafka streaming engine processing 100k events/sec.",
    linkUrl: "https://github.com/example/pipeline",
    score: 96,
    verified: true,
    tags: ["Golang", "Kafka", "Redis"],
  };

  it("renders verified artifact with tags and score", () => {
    render(<ProofOfWorkCard item={item} />);

    expect(screen.getByText("High Throughput Ingestion Pipeline")).toBeInTheDocument();
    expect(screen.getByText("96/100")).toBeInTheDocument();
    expect(screen.getByText("Golang")).toBeInTheDocument();
    expect(screen.getByText("View Artifact")).toBeInTheDocument();
  });
});
