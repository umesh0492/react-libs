import type { AnalyticsAdapter, AnalyticsEvent } from "../types";

export interface GoogleAnalyticsAdapterOptions {
  measurementId?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
  }
}

export class GoogleAnalyticsAdapter implements AnalyticsAdapter {
  public name = "google_analytics";
  private measurementId?: string;

  constructor(options: GoogleAnalyticsAdapterOptions = {}) {
    this.measurementId = options.measurementId;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private gtag(...args: any[]): void {
    if (typeof window !== "undefined") {
      if (typeof window.gtag === "function") {
        window.gtag(...args);
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(args);
      }
    }
  }

  public track(event: AnalyticsEvent): void {
    if (event.eventName === "page_view") {
      this.gtag("event", "page_view", {
        page_location: event.page.url,
        page_path: event.page.path,
        page_title: event.page.title,
        page_id: event.pageId,
        session_id: event.sessionId,
        send_to: this.measurementId,
        ...event.metadata,
      });
      return;
    }

    this.gtag("event", event.eventName, {
      event_category: event.component?.type ?? "ui_interaction",
      event_label: event.component?.name ?? event.component?.id,
      component_id: event.component?.id,
      component_type: event.component?.type,
      interaction: event.component?.interaction,
      interaction_count: event.component?.interactionCount,
      page_id: event.pageId,
      session_id: event.sessionId,
      send_to: this.measurementId,
      ...event.metadata,
    });
  }

  public trackBatch(events: AnalyticsEvent[]): void {
    events.forEach((event) => this.track(event));
  }

  public identify(userId: string, traits?: Record<string, unknown>): void {
    this.gtag("set", {
      user_id: userId,
      user_properties: traits,
    });
  }

  public reset(): void {
    this.gtag("set", {
      user_id: null,
    });
  }
}
