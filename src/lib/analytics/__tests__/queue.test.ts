import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AnalyticsQueue } from "../queue";
import type { AnalyticsAdapter, AnalyticsEvent } from "../types";

function createMockEvent(id: string): AnalyticsEvent {
  return {
    eventId: id,
    eventName: "test_event",
    timestamp: new Date().toISOString(),
    sessionId: "sess_1",
    pageId: "page_1",
    anonymousId: "anon_1",
    page: {
      url: "http://localhost/test",
      path: "/test",
      title: "Test",
      referrer: "",
    },
    metadata: {},
  };
}

describe("AnalyticsQueue", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("flushes automatically when batchSize is reached", async () => {
    const trackBatch = vi.fn().mockResolvedValue(undefined);
    const mockAdapter: AnalyticsAdapter = {
      name: "mock",
      track: vi.fn(),
      trackBatch,
    };

    const queue = new AnalyticsQueue({
      adapters: [mockAdapter],
      batchSize: 3,
      flushIntervalMs: 10000,
    });

    queue.enqueue(createMockEvent("1"));
    queue.enqueue(createMockEvent("2"));
    expect(trackBatch).not.toHaveBeenCalled();

    queue.enqueue(createMockEvent("3"));
    // Await flush cycle
    await queue.flush();

    expect(trackBatch).toHaveBeenCalledTimes(1);
    expect(trackBatch.mock.calls[0][0]).toHaveLength(3);
    queue.destroy();
  });

  it("flushes on interval even if batchSize is not reached", async () => {
    const trackBatch = vi.fn().mockResolvedValue(undefined);
    const mockAdapter: AnalyticsAdapter = {
      name: "mock",
      track: vi.fn(),
      trackBatch,
    };

    const queue = new AnalyticsQueue({
      adapters: [mockAdapter],
      batchSize: 10,
      flushIntervalMs: 2000,
    });

    queue.enqueue(createMockEvent("1"));
    expect(trackBatch).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2000);

    expect(trackBatch).toHaveBeenCalledTimes(1);
    expect(trackBatch.mock.calls[0][0]).toHaveLength(1);
    queue.destroy();
  });

  it("buffers failed events to localStorage and limits by maxOfflineQueue", async () => {
    const failingAdapter: AnalyticsAdapter = {
      name: "failing",
      track: vi.fn().mockRejectedValue(new Error("Network Error")),
      trackBatch: vi.fn().mockRejectedValue(new Error("Network Error")),
    };

    const queue = new AnalyticsQueue({
      adapters: [failingAdapter],
      batchSize: 2,
      maxOfflineQueue: 3,
      storagePrefix: "test_storage",
    });

    queue.enqueue(createMockEvent("1"));
    queue.enqueue(createMockEvent("2"));
    await queue.flush();

    queue.enqueue(createMockEvent("3"));
    queue.enqueue(createMockEvent("4"));
    await queue.flush();

    const stored = JSON.parse(
      window.localStorage.getItem("test_storage_offline_queue") || "[]"
    );
    // Should be capped to 3 (events 2, 3, 4)
    expect(stored.length).toBe(3);
    expect(stored[stored.length - 1].eventId).toBe("4");
    queue.destroy();
  });
});
