import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  AnalyticsProvider,
  useAnalytics,
  TrackArea,
  PageViewTracker,
} from "../react";
import { initAnalytics } from "../engine";
import type { AnalyticsAdapter, AnalyticsEvent } from "../types";

describe("React Analytics Integration", () => {
  let trackedEvents: AnalyticsEvent[] = [];
  const mockAdapter: AnalyticsAdapter = {
    name: "react_mock",
    track: vi.fn((event) => {
      trackedEvents.push(event);
    }),
    trackBatch: vi.fn((events) => {
      trackedEvents.push(...events);
    }),
  };

  beforeEach(() => {
    trackedEvents = [];
    vi.clearAllMocks();
  });

  function TestButton() {
    const { track } = useAnalytics();
    return (
      <button onClick={() => track("custom_click", { buttonId: "btn_test" })}>
        Click Me
      </button>
    );
  }

  it("provides useAnalytics hook through AnalyticsProvider", async () => {
    const engine = initAnalytics({
      adapters: [mockAdapter],
      batchSize: 1,
      autoTrackDom: false,
      autoTrackPages: false,
    });

    render(
      <AnalyticsProvider engine={engine}>
        <TestButton />
      </AnalyticsProvider>
    );

    const btn = screen.getByText("Click Me");
    btn.click();
    await engine.flush();

    expect(trackedEvents.some((e) => e.eventName === "custom_click")).toBe(true);
    engine.destroy();
  });

  it("renders TrackArea with proper data attributes", () => {
    const { container } = render(
      <TrackArea
        journey="checkout_funnel"
        step="shipping"
        metadata={{ courier: "express" }}
      >
        <span>Content</span>
      </TrackArea>
    );

    const area = container.querySelector("[data-track-area]");
    expect(area).toBeInTheDocument();
    expect(area).toHaveAttribute("data-track-area-journey", "checkout_funnel");
    expect(area).toHaveAttribute("data-track-area-step", "shipping");
    expect(area).toHaveAttribute(
      "data-track-area-metadata",
      JSON.stringify({ courier: "express" })
    );
  });

  it("PageViewTracker automatically dispatches page view on mount", async () => {
    const engine = initAnalytics({
      adapters: [mockAdapter],
      batchSize: 1,
      autoTrackDom: false,
      autoTrackPages: false,
    });

    render(
      <AnalyticsProvider engine={engine}>
        <PageViewTracker pageTitle="Dashboard" path="/app/dashboard" />
      </AnalyticsProvider>
    );

    await engine.flush();
    const pageEvent = trackedEvents.find((e) => e.eventName === "page_view");
    expect(pageEvent).toBeDefined();
    expect(pageEvent?.page.title).toBe("Dashboard");
    expect(pageEvent?.page.path).toBe("/app/dashboard");
    engine.destroy();
  });
});
