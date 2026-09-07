import * as React from "react";
import { getAnalyticsEngine, initAnalytics, AnalyticsEngine } from "../engine";
import type { AnalyticsConfig, AnalyticsEvent, PageContext } from "../types";

export interface AnalyticsContextValue {
  engine: AnalyticsEngine | null;
  track: (eventName: string, metadata?: Record<string, unknown>) => AnalyticsEvent | undefined;
  trackPageView: (
    page?: Partial<PageContext>,
    metadata?: Record<string, unknown>
  ) => AnalyticsEvent | undefined;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  setGlobalMetadata: (metadata: Record<string, unknown>) => void;
  logout: () => void;
}

const AnalyticsContext = React.createContext<AnalyticsContextValue | null>(null);

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: AnalyticsConfig;
  engine?: AnalyticsEngine;
}

export function AnalyticsProvider({
  children,
  config,
  engine: externalEngine,
}: AnalyticsProviderProps) {
  const [engineInstance] = React.useState<AnalyticsEngine | null>(() => {
    return externalEngine || getAnalyticsEngine() || (config ? initAnalytics(config) : null);
  });

  const value = React.useMemo<AnalyticsContextValue>(() => {
    return {
      engine: engineInstance,
      track: (eventName, metadata) => engineInstance?.track(eventName, metadata),
      trackPageView: (page, metadata) =>
        engineInstance?.trackPageView(page, metadata),
      identify: (userId, traits) => engineInstance?.identify(userId, traits),
      setGlobalMetadata: (metadata) => engineInstance?.setGlobalMetadata(metadata),
      logout: () => engineInstance?.logout(),
    };
  }, [engineInstance]);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextValue {
  const context = React.useContext(AnalyticsContext);
  if (!context) {
    // If used outside provider, fallback gracefully to global singleton
    const engine = getAnalyticsEngine();
    return {
      engine,
      track: (eventName, metadata) => engine?.track(eventName, metadata),
      trackPageView: (page, metadata) => engine?.trackPageView(page, metadata),
      identify: (userId, traits) => engine?.identify(userId, traits),
      setGlobalMetadata: (metadata) => engine?.setGlobalMetadata(metadata),
      logout: () => engine?.logout(),
    };
  }
  return context;
}
