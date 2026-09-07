import type { AnalyticsAdapter, AnalyticsEvent } from "./types";

export interface AnalyticsQueueOptions {
  adapters: AnalyticsAdapter[];
  batchSize?: number;
  flushIntervalMs?: number;
  maxOfflineQueue?: number;
  storagePrefix?: string;
  onError?: (err: unknown) => void;
}

export class AnalyticsQueue {
  private adapters: AnalyticsAdapter[];
  private batchSize: number;
  private flushIntervalMs: number;
  private maxOfflineQueue: number;
  private storageKey: string;
  private onError?: (err: unknown) => void;

  private memoryQueue: AnalyticsEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private isFlushing = false;

  constructor(options: AnalyticsQueueOptions) {
    this.adapters = options.adapters;
    this.batchSize = options.batchSize ?? 10;
    this.flushIntervalMs = options.flushIntervalMs ?? 5000;
    this.maxOfflineQueue = options.maxOfflineQueue ?? 1000;
    this.storageKey = `${options.storagePrefix ?? "va_analytics"}_offline_queue`;
    this.onError = options.onError;

    this.startPeriodicFlush();
    this.registerLifecycleListeners();
  }

  private startPeriodicFlush(): void {
    if (typeof window === "undefined" || this.flushIntervalMs <= 0) return;
    this.flushTimer = setInterval(() => {
      this.flush().catch((err) => this.onError?.(err));
    }, this.flushIntervalMs);
  }

  private registerLifecycleListeners(): void {
    if (typeof window === "undefined") return;

    window.addEventListener("online", () => {
      this.flush().catch((err) => this.onError?.(err));
    });

    const handleUnload = () => {
      this.persistMemoryQueueToStorage();
    };

    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush().catch((err) => this.onError?.(err));
      }
    });
  }

  public enqueue(event: AnalyticsEvent): void {
    this.memoryQueue.push(event);

    if (this.memoryQueue.length >= this.batchSize) {
      this.flush().catch((err) => this.onError?.(err));
    }
  }

  private readStorageQueue(): AnalyticsEvent[] {
    if (typeof window === "undefined" || !window.localStorage) return [];
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeStorageQueue(events: AnalyticsEvent[]): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      // FIFO eviction to adhere to maxOfflineQueue limit
      const trimmed = events.slice(-this.maxOfflineQueue);
      window.localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
    } catch {
      // Quota exceeded or private mode
    }
  }

  private clearStorageQueue(): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.removeItem(this.storageKey);
    } catch {
      // Safe swallow
    }
  }

  private persistMemoryQueueToStorage(): void {
    if (this.memoryQueue.length === 0) return;
    const existing = this.readStorageQueue();
    const combined = [...existing, ...this.memoryQueue];
    this.memoryQueue = [];
    this.writeStorageQueue(combined);
  }

  private pendingFlushPromise: Promise<void> | null = null;

  public async flush(): Promise<void> {
    if (this.isFlushing) {
      return this.pendingFlushPromise ?? Promise.resolve();
    }
    this.isFlushing = true;
    this.pendingFlushPromise = this.executeDrainLoop();
    try {
      await this.pendingFlushPromise;
    } finally {
      this.isFlushing = false;
      this.pendingFlushPromise = null;
    }
  }

  private async executeDrainLoop(): Promise<void> {
    while (this.memoryQueue.length > 0 || this.readStorageQueue().length > 0) {
      const storedEvents = this.readStorageQueue();
      const eventsToFlush = [...storedEvents, ...this.memoryQueue];
      this.memoryQueue = [];
      this.clearStorageQueue();

      if (eventsToFlush.length === 0 || this.adapters.length === 0) {
        return;
      }

      const isOnline = typeof navigator === "undefined" || navigator.onLine !== false;
      if (!isOnline) {
        this.writeStorageQueue(eventsToFlush);
        return;
      }

      const failedAdapters: AnalyticsAdapter[] = [];
      await Promise.all(
        this.adapters.map(async (adapter) => {
          try {
            if (typeof adapter.trackBatch === "function") {
              await adapter.trackBatch(eventsToFlush);
            } else {
              await Promise.all(eventsToFlush.map((e) => adapter.track(e)));
            }
          } catch (err) {
            failedAdapters.push(adapter);
            this.onError?.(err);
          }
        })
      );

      if (failedAdapters.length === this.adapters.length && this.adapters.length > 0) {
        this.writeStorageQueue(eventsToFlush);
        return;
      }
    }
  }

  public getPendingCount(): number {
    return this.memoryQueue.length + this.readStorageQueue().length;
  }

  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.persistMemoryQueueToStorage();
  }
}
