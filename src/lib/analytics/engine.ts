import { DomTracker } from "./dom-tracker";
import { AnalyticsQueue } from "./queue";
import { generateUUID, SessionManager } from "./session";
import type {
  AnalyticsAdapter,
  AnalyticsConfig,
  AnalyticsEvent,
  ComponentContext,
  PageContext,
} from "./types";

export class AnalyticsEngine {
  private config: AnalyticsConfig;
  private sessionManager: SessionManager;
  private queue: AnalyticsQueue;
  private domTracker?: DomTracker;
  private globalMetadata: Record<string, unknown> = {};
  private originalPushState?: typeof history.pushState;
  private originalReplaceState?: typeof history.replaceState;
  private popStateListener?: () => void;
  private isInitialized = false;

  constructor(config: AnalyticsConfig = {}) {
    this.config = config;
    this.globalMetadata = { ...(config.globalMetadata || {}) };

    this.sessionManager = new SessionManager(
      config.storagePrefix,
      config.sessionTimeoutMs
    );

    this.queue = new AnalyticsQueue({
      adapters: config.adapters || [],
      batchSize: config.batchSize,
      flushIntervalMs: config.flushIntervalMs,
      maxOfflineQueue: config.maxOfflineQueue,
      storagePrefix: config.storagePrefix,
      onError: config.onError,
    });

    if (config.autoTrackDom !== false) {
      this.domTracker = new DomTracker({
        onInteraction: (component, metadata) => {
          this.handleDomInteraction(component, metadata);
        },
        maskPatterns: config.maskPatterns,
      });
      this.domTracker.start();
    }

    if (config.autoTrackPages !== false) {
      this.setupPageTracking();
    }

    // Call adapter onInit hooks
    if (config.adapters) {
      config.adapters.forEach((adapter) => {
        try {
          const res = adapter.onInit?.(config);
          if (res instanceof Promise) {
            res.catch((err) => config.onError?.(err));
          }
        } catch (err) {
          config.onError?.(err);
        }
      });
    }

    this.isInitialized = true;
  }

  private getCurrentPageContext(): PageContext {
    if (typeof window === "undefined") {
      return {
        url: "",
        path: "",
        title: "",
        referrer: "",
      };
    }
    return {
      url: window.location.href,
      path: window.location.pathname + window.location.search,
      title: document.title || "",
      referrer: document.referrer || "",
    };
  }

  private setupPageTracking(): void {
    if (typeof window === "undefined" || !window.history) return;

    // Track initial page view on load
    this.trackPageView();

    // Wrap history.pushState and replaceState only if patchHistory is explicitly enabled
    if (this.config.patchHistory === true) {
      this.originalPushState = window.history.pushState;
      const originalPush = this.originalPushState;
      window.history.pushState = (...args: Parameters<typeof history.pushState>) => {
        originalPush.apply(window.history, args);
        this.sessionManager.renewPageId();
        this.trackPageView();
      };

      this.originalReplaceState = window.history.replaceState;
      const originalReplace = this.originalReplaceState;
      window.history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
        originalReplace.apply(window.history, args);
        this.sessionManager.renewPageId();
        this.trackPageView();
      };
    }

    this.popStateListener = () => {
      this.sessionManager.renewPageId();
      this.trackPageView();
    };
    window.addEventListener("popstate", this.popStateListener);
  }

  private handleDomInteraction(
    component: ComponentContext,
    interactionMetadata: Record<string, unknown>
  ): void {
    const interactionCount = this.sessionManager.incrementComponentInteraction(
      component.id
    );

    const enrichedComponent: ComponentContext = {
      ...component,
      interactionCount,
    };

    this.track(
      `component_${component.interaction}`,
      interactionMetadata,
      enrichedComponent
    );
  }

  public track(
    eventName: string,
    metadata: Record<string, unknown> = {},
    component?: ComponentContext
  ): AnalyticsEvent {
    const event: AnalyticsEvent = {
      eventId: generateUUID(),
      eventName,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionManager.getSessionId(),
      pageId: this.sessionManager.getActivePageId(),
      anonymousId: this.sessionManager.getAnonymousId(),
      userId: this.sessionManager.getUserId(),
      component,
      page: this.getCurrentPageContext(),
      metadata: {
        ...this.globalMetadata,
        ...metadata,
      },
    };

    this.queue.enqueue(event);
    return event;
  }

  public trackPageView(
    customPage?: Partial<PageContext>,
    metadata: Record<string, unknown> = {}
  ): AnalyticsEvent {
    const page: PageContext = {
      ...this.getCurrentPageContext(),
      ...(customPage || {}),
    };

    const event: AnalyticsEvent = {
      eventId: generateUUID(),
      eventName: "page_view",
      timestamp: new Date().toISOString(),
      sessionId: this.sessionManager.getSessionId(),
      pageId: this.sessionManager.getActivePageId(),
      anonymousId: this.sessionManager.getAnonymousId(),
      userId: this.sessionManager.getUserId(),
      page,
      metadata: {
        ...this.globalMetadata,
        ...metadata,
      },
    };

    this.queue.enqueue(event);
    return event;
  }

  public identify(userId: string, traits?: Record<string, unknown>): void {
    this.sessionManager.setUserId(userId);

    // Track identify event
    this.track("user_identify", {
      identifiedUserId: userId,
      ...(traits || {}),
    });

    // Notify adapters
    if (this.config.adapters) {
      this.config.adapters.forEach((adapter) => {
        try {
          const res = adapter.identify?.(userId, traits);
          if (res instanceof Promise) {
            res.catch((err) => this.config.onError?.(err));
          }
        } catch (err) {
          this.config.onError?.(err);
        }
      });
    }
  }

  public logout(): void {
    this.track("user_logout");
    this.queue.flush().catch((err) => this.config.onError?.(err));

    this.sessionManager.clearUserId();

    // Reset adapters
    if (this.config.adapters) {
      this.config.adapters.forEach((adapter) => {
        try {
          const res = adapter.reset?.();
          if (res instanceof Promise) {
            res.catch((err) => this.config.onError?.(err));
          }
        } catch (err) {
          this.config.onError?.(err);
        }
      });
    }
  }

  public reset(): void {
    this.logout();
    this.sessionManager.reset();
  }

  public setGlobalMetadata(metadata: Record<string, unknown>): void {
    Object.assign(this.globalMetadata, metadata);
  }

  public clearGlobalMetadata(keys?: string[]): void {
    if (!keys) {
      this.globalMetadata = {};
    } else {
      const keysToDrop = new Set(keys);
      this.globalMetadata = Object.fromEntries(
        Object.entries(this.globalMetadata).filter(([k]) => !keysToDrop.has(k))
      );
    }
  }

  public addAdapter(adapter: AnalyticsAdapter): void {
    if (!this.config.adapters) {
      this.config.adapters = [];
    }
    this.config.adapters.push(adapter);
    try {
      const res = adapter.onInit?.(this.config);
      if (res instanceof Promise) {
        res.catch((err) => this.config.onError?.(err));
      }
    } catch (err) {
      this.config.onError?.(err);
    }
  }

  public async flush(): Promise<void> {
    await this.queue.flush();
  }

  public getSessionManager(): SessionManager {
    return this.sessionManager;
  }

  public getQueue(): AnalyticsQueue {
    return this.queue;
  }

  public destroy(): void {
    if (!this.isInitialized) return;
    this.domTracker?.stop();
    this.queue.destroy();

    if (typeof window !== "undefined") {
      if (window.history) {
        if (this.originalPushState) {
          window.history.pushState = this.originalPushState;
          this.originalPushState = undefined;
        }
        if (this.originalReplaceState) {
          window.history.replaceState = this.originalReplaceState;
          this.originalReplaceState = undefined;
        }
      }
      if (this.popStateListener) {
        window.removeEventListener("popstate", this.popStateListener);
        this.popStateListener = undefined;
      }
    }
    this.isInitialized = false;
  }
}

// Global Singleton Instance
let globalAnalyticsEngine: AnalyticsEngine | null = null;

export function initAnalytics(config?: AnalyticsConfig): AnalyticsEngine {
  if (globalAnalyticsEngine) {
    globalAnalyticsEngine.destroy();
  }
  globalAnalyticsEngine = new AnalyticsEngine(config);
  return globalAnalyticsEngine;
}

export function getAnalyticsEngine(): AnalyticsEngine | null {
  return globalAnalyticsEngine;
}
