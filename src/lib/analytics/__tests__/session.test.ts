import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateUUID, SessionManager } from "../session";

describe("Analytics SessionManager", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("generates valid UUID v4 strings", () => {
    const uuid = generateUUID();
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidV4Regex);
  });

  it("persists and reuses anonymousId in localStorage", () => {
    const session1 = new SessionManager("test_prefix");
    const anon1 = session1.getAnonymousId();
    expect(anon1).toBeTruthy();

    const session2 = new SessionManager("test_prefix");
    expect(session2.getAnonymousId()).toBe(anon1);
  });

  it("tracks and rolls over sessionId when inactive for longer than timeout", () => {
    vi.useFakeTimers();
    const timeoutMs = 5000;
    const session = new SessionManager("test_prefix", timeoutMs);
    const initialSessionId = session.getSessionId();

    // Advance within timeout
    vi.advanceTimersByTime(2000);
    expect(session.getSessionId()).toBe(initialSessionId);

    // Advance beyond timeout
    vi.advanceTimersByTime(6000);
    const newSessionId = session.getSessionId();
    expect(newSessionId).not.toBe(initialSessionId);

    vi.useRealTimers();
  });

  it("increments component interaction counts sequentially", () => {
    const session = new SessionManager();
    expect(session.incrementComponentInteraction("btn_1")).toBe(1);
    expect(session.incrementComponentInteraction("btn_1")).toBe(2);
    expect(session.incrementComponentInteraction("btn_2")).toBe(1);
  });

  it("handles user identity and resets correctly", () => {
    const session = new SessionManager();
    session.setUserId("user_123");
    expect(session.getUserId()).toBe("user_123");

    const oldAnon = session.getAnonymousId();
    session.clearUserId();
    expect(session.getUserId()).toBeUndefined();
    // Clears user and rotates anonymous ID for privacy
    expect(session.getAnonymousId()).not.toBe(oldAnon);
  });

  it("renews pageId on navigation", () => {
    const session = new SessionManager();
    const p1 = session.getActivePageId();
    const p2 = session.renewPageId();
    expect(p2).not.toBe(p1);
    expect(session.getActivePageId()).toBe(p2);
  });
});
