import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ProofOfWorkCard,
  ProofOfWorkItem,
  MetricVerificationCard,
} from "../proof-of-work-card";

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

  it("renders MetricVerificationCard alias with custom metricLabel and linkLabel", () => {
    render(
      <MetricVerificationCard
        item={{
          title: "SOC-2 Type II Compliance",
          type: "certificate",
          metricLabel: "Passed Audit",
          linkLabel: "View Certificate",
          linkUrl: "https://example.com/audit.pdf",
          tags: ["Security", "Compliance"],
        }}
      />
    );

    expect(screen.getByText("SOC-2 Type II Compliance")).toBeInTheDocument();
    expect(screen.getByText("Passed Audit")).toBeInTheDocument();
    expect(screen.getByText("View Certificate")).toBeInTheDocument();
  });

  it("renders score with custom maxScore", () => {
    render(
      <ProofOfWorkCard
        item={{
          title: "Code Quality Rating",
          score: 5,
          maxScore: 5,
        }}
      />
    );

    expect(screen.getByText("5/5")).toBeInTheDocument();
  });
});
