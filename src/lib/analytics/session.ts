export function generateUUID(): string {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40; // Version 4
      bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80; // Variant 10xx
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  }
  const time = Date.now().toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${time.slice(-12)}`;
}

export class SessionManager {
  private prefix: string;
  private sessionTimeoutMs: number;
  private anonymousId: string;
  private sessionId: string;
  private lastActiveTimestamp: number;
  private activePageId: string;
  private userId?: string;
  private componentInteractionCounts = new Map<string, number>();

  constructor(prefix = "va_analytics", sessionTimeoutMs = 30 * 60 * 1000) {
    this.prefix = prefix;
    this.sessionTimeoutMs = sessionTimeoutMs;
    this.anonymousId = this.loadOrCreateAnonymousId();
    this.lastActiveTimestamp = Date.now();
    this.sessionId = this.loadOrCreateSessionId();
    this.activePageId = generateUUID();
  }

  private loadOrCreateAnonymousId(): string {
    const key = `${this.prefix}_anon_id`;
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored) return stored;
        const newId = generateUUID();
        window.localStorage.setItem(key, newId);
        return newId;
      } catch {
        // Fallback for private browsing or restricted quota
      }
    }
    return generateUUID();
  }

  private loadOrCreateSessionId(): string {
    const sessionKey = `${this.prefix}_session_id`;
    const lastActiveKey = `${this.prefix}_last_active`;

    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const storedSession = window.sessionStorage.getItem(sessionKey);
        const storedLastActive = window.sessionStorage.getItem(lastActiveKey);
        const now = Date.now();

        if (storedSession && storedLastActive) {
          const lastActive = parseInt(storedLastActive, 10);
          if (!isNaN(lastActive) && now - lastActive < this.sessionTimeoutMs) {
            this.lastActiveTimestamp = now;
            window.sessionStorage.setItem(lastActiveKey, now.toString());
            return storedSession;
          }
        }

        // Create new session if expired or not found
        const newSessionId = generateUUID();
        window.sessionStorage.setItem(sessionKey, newSessionId);
        window.sessionStorage.setItem(lastActiveKey, now.toString());
        return newSessionId;
      } catch {
        // Fallback
      }
    }
    return generateUUID();
  }

  public touchSession(): string {
    const now = Date.now();
    if (now - this.lastActiveTimestamp >= this.sessionTimeoutMs) {
      // Session expired, roll over to new session
      this.sessionId = generateUUID();
      this.componentInteractionCounts.clear();
    }
    this.lastActiveTimestamp = now;

    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(`${this.prefix}_session_id`, this.sessionId);
        window.sessionStorage.setItem(`${this.prefix}_last_active`, now.toString());
      } catch {
        // Safe swallow
      }
    }
    return this.sessionId;
  }

  public getSessionId(): string {
    return this.touchSession();
  }

  public getAnonymousId(): string {
    return this.anonymousId;
  }

  public getActivePageId(): string {
    return this.activePageId;
  }

  public renewPageId(): string {
    this.activePageId = generateUUID();
    return this.activePageId;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public clearUserId(): void {
    this.userId = undefined;
    // Generate new anonymousId on logout to isolate data
    this.anonymousId = generateUUID();
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(`${this.prefix}_anon_id`, this.anonymousId);
      } catch {
        // Safe swallow
      }
    }
  }

  public incrementComponentInteraction(componentId: string): number {
    const count = (this.componentInteractionCounts.get(componentId) ?? 0) + 1;
    this.componentInteractionCounts.set(componentId, count);
    return count;
  }

  public reset(): void {
    this.clearUserId();
    this.sessionId = generateUUID();
    this.activePageId = generateUUID();
    this.componentInteractionCounts.clear();
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        window.sessionStorage.removeItem(`${this.prefix}_session_id`);
        window.sessionStorage.removeItem(`${this.prefix}_last_active`);
      } catch {
        // Safe swallow
      }
    }
  }
}
