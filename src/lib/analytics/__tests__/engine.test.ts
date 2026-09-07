import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initAnalytics, getAnalyticsEngine } from "../engine";
import type { AnalyticsAdapter, AnalyticsEvent } from "../types";

describe("AnalyticsEngine", () => {
  let trackedEvents: AnalyticsEvent[] = [];
  const mockAdapter: AnalyticsAdapter = {
    name: "test_adapter",
    track: vi.fn((event) => {
      trackedEvents.push(event);
    }),
    trackBatch: vi.fn((events) => {
      trackedEvents.push(...events);
    }),
    identify: vi.fn(),
    reset: vi.fn(),
  };

  beforeEach(() => {
    trackedEvents = [];
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    getAnalyticsEngine()?.destroy();
  });

  it("initializes and tracks custom events with global metadata", async () => {
    const engine = initAnalytics({
      appId: "test_app",
      adapters: [mockAdapter],
      batchSize: 1, // immediate flush
      globalMetadata: { appVersion: "2.1.0" },
      autoTrackDom: false,
      autoTrackPages: false,
    });

    engine.track("custom_action", { feature: "export" });
    await engine.flush();

    expect(trackedEvents).toHaveLength(1);
    const event = trackedEvents[0];
    expect(event.eventName).toBe("custom_action");
    expect(event.metadata.appVersion).toBe("2.1.0");
    expect(event.metadata.feature).toBe("export");
    expect(event.sessionId).toBeTruthy();
    expect(event.anonymousId).toBeTruthy();
  });

  it("handles user identity lifecycle and resets state", async () => {
    const engine = initAnalytics({
      adapters: [mockAdapter],
      batchSize: 1,
      autoTrackDom: false,
      autoTrackPages: false,
    });

    engine.identify("user_42", { role: "buyer" });
    expect(mockAdapter.identify).toHaveBeenCalledWith("user_42", { role: "buyer" });

    engine.track("purchase");
    await engine.flush();

    const purchaseEvent = trackedEvents.find((e) => e.eventName === "purchase");
    expect(purchaseEvent?.userId).toBe("user_42");

    engine.logout();
    expect(mockAdapter.reset).toHaveBeenCalled();
  });

  it("tracks page views and updates active pageId", async () => {
    const engine = initAnalytics({
      adapters: [mockAdapter],
      batchSize: 1,
      autoTrackDom: false,
      autoTrackPages: false,
    });

    const event1 = engine.trackPageView({ path: "/home", title: "Home" });
    const event2 = engine.trackPageView({ path: "/settings", title: "Settings" });

    expect(event1.eventName).toBe("page_view");
    expect(event1.page.path).toBe("/home");
    expect(event2.page.path).toBe("/settings");
  });
});
