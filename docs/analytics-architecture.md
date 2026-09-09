# Behavioral Analytics Layer Architecture Specification

**Package**: `@umesh0492/react-libs/analytics`  
**Status**: Approved (Brainstorming Complete)  
**Target React Version**: React 19+  

---

## 1. Understanding Summary

* **What is being built**: A zero-effort, pluggable Behavioral Analytics Engine for `@umesh0492/react-libs` with automatic DOM event delegation, page & component UUID generation, resilient batching queue, offline `localStorage` fallback, and an Adapter pattern for destinations.
* **Why it exists**: To enable organizations and developers to track user interactions, component click frequency, page visits, and funnel drop-offs automatically without having to write manual tracking boilerplate in every component.
* **Who it is for**: Developers, product managers, and growth engineers building enterprise applications with `@umesh0492/react-libs`.
* **Key constraints**:
  * Strict React 19 Concurrent Mode safety (pure rendering, no render-time side effects).
  * Zero heavy external dependencies (adapters bridge to existing browser globals or standard HTTP).
  * Automated PII masking (never captures password fields, masked data like Aadhaar/PAN, or elements marked `data-track-ignore`).
  * Bounded browser storage (FIFO eviction capped at 1,000 events to prevent `localStorage` exhaustion).
* **Explicit non-goals**:
  * Not building a distributed APM/OTel server-side tracing suite in this milestone.
  * Not modifying or wrapping existing core UI components with heavy tracking code.

---

## 2. Assumptions & Defaults

* **Session Lifecycle**: A user session ID will be generated and refreshed after 30 minutes of inactivity (configurable via `initAnalytics()`), persisted in `sessionStorage`.
* **Anonymous vs Identified Identity**: Unauthenticated visitors receive a persistent `anonymousId` in `localStorage`. Calling `identify(userId, metadata)` links the anonymous journey to the authenticated user. On `logout()`, the queue flushes and a new `anonymousId` is generated.
* **Route Detection**: SPA page views are automatically intercepted via HTML5 History API (`pushState`, `replaceState`, `popstate`), with an optional `<PageViewTracker />` React helper.
* **Network Deliverability**: Events are batched (default 10 events or 5 seconds), with `navigator.sendBeacon` (falling back to `fetch` with `keepalive: true`) on page unloads.

---

## 3. Decision Log

| # | Decision | Options Considered | Rationale |
|---|---|---|---|
| 1 | Primary Scope: Behavioral & Product Analytics | A) Behavioral Analytics<br>B) Audit Trail<br>C) APM/Performance<br>D) Unified Hybrid | Option A prioritized per waterfall roadmap to deliver user journey & drop-off tracking first. |
| 2 | Collection Strategy: Hybrid DOM Delegation + Metadata Attributes | A) DOM Event Delegation + Data Attributes<br>B) Internal Component Hooks<br>C) Mandatory Wrappers | Option A achieves zero developer friction, zero re-render overhead, and supports optional metadata. |
| 3 | Non-Functional Requirements & Queueing | A) Fixed standard defaults<br>B) Real-time immediate flush<br>C) Configurable with Option A defaults | Option C allows enterprise customization while working out of the box with sensible defaults. |
| 4 | Adapter Packaging | A) Lightweight Zero-Dependency<br>B) Bundled Vendor SDKs<br>C) Open Interface Only | Option A keeps the library lightweight without bloating npm install sizes with third-party SDKs. |
| 5 | Identity & Metadata Lifecycle | Static config vs Dynamic Identity | Implemented `identify()`, `setGlobalMetadata()`, and `logout()` for seamless unauthenticated-to-authenticated transitions. |
| 6 | Core Architecture | Approach 1: Modular Engine Core + React Context Bridge | Decouples engine logic from React render loop, enabling 100% pure unit testability and zero re-renders. |

---

## 4. Architecture & Module Structure

```
src/lib/analytics/
├── types.ts              # Core contracts: AnalyticsEvent, AnalyticsConfig, AnalyticsAdapter
├── session.ts            # UUID generators, Session ID (sliding window), Anonymous ID
├── queue.ts              # Resilient batch queue, flush timers, localStorage FIFO buffer
├── dom-tracker.ts        # Global DOM delegation (clicks, changes), data-attribute parser, PII sanitizer
├── engine.ts             # AnalyticsEngine core (initAnalytics, identify, logout, track)
├── adapters/
│   ├── base.ts           # AnalyticsAdapter interface & abstract helper
│   ├── http.ts           # In-house backend adapter (fetch / sendBeacon with batching)
│   ├── console.ts        # Dev/debugging logger
│   ├── mixpanel.ts       # Zero-dependency window.mixpanel bridge
│   └── google.ts         # Zero-dependency window.gtag (GA4) bridge
└── react/
    ├── provider.tsx      # <AnalyticsProvider /> and useAnalytics() hook
    ├── page-tracker.tsx  # Automatic SPA navigation observer (<PageViewTracker />)
    └── track-area.tsx    # Declarative journey boundary wrapper (<TrackArea journey="checkout" />)
```

---

## 5. Event Data Contract

```typescript
export interface AnalyticsEvent {
  eventId: string;        // UUID v4
  eventName: string;      // "component_interaction" | "page_view" | "custom_event"
  timestamp: string;      // ISO 8601 UTC
  sessionId: string;      // Current browsing session UUID
  pageId: string;         // Unique UUID for current page view
  anonymousId: string;    // Device/browser persistent UUID
  userId?: string;        // Authenticated user ID (when logged in)
  component?: {
    id: string;           // Auto-generated or custom component UUID
    name: string;         // "approve_invoice_btn", "theme_toggle", etc.
    type: string;         // "button" | "select" | "tab" | "dialog" | ...
    interaction: "click" | "change" | "submit";
    interactionCount: number; // Sequence count within session
  };
  page: {
    url: string;
    path: string;
    title: string;
    referrer: string;
  };
  metadata: Record<string, unknown>; // Merged global + journey + component metadata
}
```

---

## 6. Developer Usage Example

```tsx
import { initAnalytics, HttpAdapter, MixpanelAdapter, ConsoleAdapter } from "@umesh0492/react-libs/analytics";

// Initialize once at app root (e.g., main.tsx or App.tsx)
initAnalytics({
  appId: "enterprise_app",
  adapters: [
    new HttpAdapter({ endpoint: "/api/telemetry" }),
    new MixpanelAdapter(),
    process.env.NODE_ENV === "development" && new ConsoleAdapter(),
  ].filter(Boolean),
  batchSize: 10,
  flushIntervalMs: 5000,
  globalMetadata: { appVersion: "0.1.0", tenantId: "org_42" },
});
```
