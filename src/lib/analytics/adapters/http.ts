import type { AnalyticsAdapter, AnalyticsEvent } from "../types";

export interface HttpAdapterOptions {
  endpoint: string;
  headers?: Record<string, string>;
  getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
  credentials?: RequestCredentials;
}

export class HttpAdapter implements AnalyticsAdapter {
  public name = "http";
  private endpoint: string;
  private headers: Record<string, string>;
  private getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
  private credentials?: RequestCredentials;

  constructor(options: HttpAdapterOptions) {
    this.endpoint = options.endpoint;
    this.headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    this.getHeaders = options.getHeaders;
    this.credentials = options.credentials;
  }

  private async resolveHeaders(): Promise<Record<string, string>> {
    let customHeaders: Record<string, string> = {};
    if (this.getHeaders) {
      customHeaders = await this.getHeaders();
    }
    return {
      ...this.headers,
      ...customHeaders,
    };
  }

  public async track(event: AnalyticsEvent): Promise<void> {
    await this.trackBatch([event]);
  }

  public async trackBatch(events: AnalyticsEvent[]): Promise<void> {
    if (events.length === 0) return;

    const payload = JSON.stringify({ events });
    const headers = await this.resolveHeaders();

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers,
      body: payload,
      credentials: this.credentials,
      keepalive: true,
    });

    if (!response.ok) {
      throw new Error(`HttpAdapter delivery failed: HTTP ${response.status} ${response.statusText}`);
    }
  }
}
