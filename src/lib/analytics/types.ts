export interface ComponentContext {
  id: string;
  name: string;
  type: string;
  interaction: "click" | "change" | "submit";
  interactionCount: number;
}

export interface PageContext {
  url: string;
  path: string;
  title: string;
  referrer: string;
}

export interface AnalyticsEvent {
  eventId: string;
  eventName: string;
  timestamp: string;
  sessionId: string;
  pageId: string;
  anonymousId: string;
  userId?: string;
  component?: ComponentContext;
  page: PageContext;
  metadata: Record<string, unknown>;
}

export interface AnalyticsAdapter {
  name: string;
  onInit?(config: AnalyticsConfig): Promise<void> | void;
  track(event: AnalyticsEvent): Promise<void> | void;
  trackBatch?(events: AnalyticsEvent[]): Promise<void> | void;
  identify?(userId: string, traits?: Record<string, unknown>): Promise<void> | void;
  reset?(): Promise<void> | void;
}

export interface AnalyticsConfig {
  appId?: string;
  adapters?: AnalyticsAdapter[];
  batchSize?: number;
  flushIntervalMs?: number;
  sessionTimeoutMs?: number;
  maxOfflineQueue?: number;
  storagePrefix?: string;
  globalMetadata?: Record<string, unknown>;
  autoTrackDom?: boolean;
  autoTrackPages?: boolean;
  /**
   * @warning Monkey-patching window.history.pushState/replaceState can cause conflicts with client-side routers (Next.js App Router, Remix, React Router). Defaults to false.
   */
  patchHistory?: boolean;
  maskPatterns?: RegExp[];
  onError?: (error: unknown) => void;
}
