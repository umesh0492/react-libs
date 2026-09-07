import type { AnalyticsAdapter, AnalyticsEvent } from "../types";

export interface ConsoleAdapterOptions {
  prefix?: string;
  logLevel?: "debug" | "info" | "log";
}

export class ConsoleAdapter implements AnalyticsAdapter {
  public name = "console";
  private prefix: string;
  private logLevel: "debug" | "info" | "log";

  constructor(options: ConsoleAdapterOptions = {}) {
    this.prefix = options.prefix ?? "[Analytics]";
    this.logLevel = options.logLevel ?? "info";
  }

  public track(event: AnalyticsEvent): void {
    const logger = console[this.logLevel] || console.log;
    logger(
      `${this.prefix} ${event.eventName}`,
      {
        component: event.component?.name,
        page: event.page.path,
        user: event.userId ?? event.anonymousId,
        metadata: event.metadata,
      },
      event
    );
  }

  public trackBatch(events: AnalyticsEvent[]): void {
    const logger = console[this.logLevel] || console.log;
    logger(`${this.prefix} Flushed Batch (${events.length} events):`, events);
  }

  public identify(userId: string, traits?: Record<string, unknown>): void {
    const logger = console[this.logLevel] || console.log;
    logger(`${this.prefix} Identify User: ${userId}`, traits);
  }

  public reset(): void {
    const logger = console[this.logLevel] || console.log;
    logger(`${this.prefix} Reset Identity`);
  }
}
