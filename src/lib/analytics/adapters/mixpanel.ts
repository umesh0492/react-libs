import type { AnalyticsAdapter, AnalyticsEvent } from "../types";

export interface MixpanelClient {
  track(eventName: string, properties?: Record<string, unknown>): void;
  identify(uniqueId: string): void;
  people?: {
    set(properties: Record<string, unknown>): void;
  };
  reset(): void;
}

export interface MixpanelAdapterOptions {
  client?: MixpanelClient;
}

declare global {
  interface Window {
    mixpanel?: MixpanelClient;
  }
}

export class MixpanelAdapter implements AnalyticsAdapter {
  public name = "mixpanel";
  private customClient?: MixpanelClient;

  constructor(options: MixpanelAdapterOptions = {}) {
    this.customClient = options.client;
  }

  private getClient(): MixpanelClient | undefined {
    if (this.customClient) return this.customClient;
    if (typeof window !== "undefined" && window.mixpanel) {
      return window.mixpanel;
    }
    return undefined;
  }

  public track(event: AnalyticsEvent): void {
    const client = this.getClient();
    if (!client) return;

    const properties: Record<string, unknown> = {
      $current_url: event.page.url,
      distinct_id: event.userId ?? event.anonymousId,
      session_id: event.sessionId,
      page_id: event.pageId,
      page_path: event.page.path,
      page_title: event.page.title,
      component_id: event.component?.id,
      component_name: event.component?.name,
      component_type: event.component?.type,
      interaction: event.component?.interaction,
      interaction_count: event.component?.interactionCount,
      ...event.metadata,
    };

    client.track(event.eventName, properties);
  }

  public trackBatch(events: AnalyticsEvent[]): void {
    events.forEach((event) => this.track(event));
  }

  public identify(userId: string, traits?: Record<string, unknown>): void {
    const client = this.getClient();
    if (!client) return;

    client.identify(userId);
    if (traits && client.people && typeof client.people.set === "function") {
      client.people.set(traits);
    }
  }

  public reset(): void {
    const client = this.getClient();
    if (client && typeof client.reset === "function") {
      client.reset();
    }
  }
}
