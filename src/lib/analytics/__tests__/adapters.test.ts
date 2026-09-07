import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  HttpAdapter,
  MixpanelAdapter,
  GoogleAnalyticsAdapter,
  ConsoleAdapter,
} from "../adapters";
import type { AnalyticsEvent } from "../types";

function mockEvent(): AnalyticsEvent {
  return {
    eventId: "evt-123",
    eventName: "button_click",
    timestamp: new Date().toISOString(),
    sessionId: "sess-1",
    pageId: "pg-1",
    anonymousId: "anon-1",
    userId: "usr-9",
    component: {
      id: "cmp-1",
      name: "Submit",
      type: "button",
      interaction: "click",
      interactionCount: 1,
    },
    page: {
      url: "http://localhost/invoice",
      path: "/invoice",
      title: "Invoice",
      referrer: "",
    },
    metadata: { key: "value" },
  };
}

describe("Analytics Adapters", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    delete (window as any).mixpanel;
    delete (window as any).gtag;
    delete (window as any).dataLayer;
  });

  it("HttpAdapter delivers batch via fetch", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    global.fetch = fetchMock;

    const adapter = new HttpAdapter({
      endpoint: "https://telemetry.example.com/events",
      headers: { "X-API-KEY": "secret-key" },
    });

    await adapter.track(mockEvent());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://telemetry.example.com/events");
    expect(init.method).toBe("POST");
    expect(init.headers["X-API-KEY"]).toBe("secret-key");
    const body = JSON.parse(init.body);
    expect(body.events).toHaveLength(1);
    expect(body.events[0].eventId).toBe("evt-123");
  });

  it("MixpanelAdapter delegates to window.mixpanel", () => {
    const track = vi.fn();
    const identify = vi.fn();
    const set = vi.fn();
    const reset = vi.fn();

    window.mixpanel = {
      track,
      identify,
      people: { set },
      reset,
    };

    const adapter = new MixpanelAdapter();
    adapter.track(mockEvent());

    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith("button_click", expect.objectContaining({
      distinct_id: "usr-9",
      session_id: "sess-1",
      component_name: "Submit",
    }));

    adapter.identify("usr-9", { plan: "enterprise" });
    expect(identify).toHaveBeenCalledWith("usr-9");
    expect(set).toHaveBeenCalledWith({ plan: "enterprise" });

    adapter.reset();
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("GoogleAnalyticsAdapter delegates to window.gtag", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    const adapter = new GoogleAnalyticsAdapter({ measurementId: "G-XYZ123" });
    adapter.track(mockEvent());

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "button_click",
      expect.objectContaining({
        send_to: "G-XYZ123",
        event_label: "Submit",
      })
    );

    adapter.identify("usr-9", { role: "admin" });
    expect(gtag).toHaveBeenCalledWith("set", {
      user_id: "usr-9",
      user_properties: { role: "admin" },
    });
  });

  it("ConsoleAdapter prints to console", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const adapter = new ConsoleAdapter();
    adapter.track(mockEvent());
    expect(infoSpy).toHaveBeenCalled();
    infoSpy.mockRestore();
  });
});
