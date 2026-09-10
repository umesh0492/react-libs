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
  onError?: (err: unknown) => void;
}

/* eslint-disable security/detect-object-injection */
function areArraysEqual<T>(a?: T[], b?: T[], compare?: (x: T, y: T) => boolean): boolean {
  if (a === b) return true;
  if (!a || !b) return (a?.length ?? 0) === (b?.length ?? 0);
  if (a.length !== b.length) return false;
  return a.every((val, idx) => (compare ? compare(val, b[idx] as T) : val === b[idx]));
}

function areMetadataEqual(
  a?: Record<string, unknown>,
  b?: Record<string, unknown>
): boolean {
  if (a === b) return true;
  return JSON.stringify(a || {}) === JSON.stringify(b || {});
}

function isConfigEqual(prev?: AnalyticsConfig, next?: AnalyticsConfig): boolean {
  if (prev === next) return true;
  if (!prev || !next) return false;
  if (
    prev.appId !== next.appId ||
    prev.batchSize !== next.batchSize ||
    prev.flushIntervalMs !== next.flushIntervalMs ||
    prev.sessionTimeoutMs !== next.sessionTimeoutMs ||
    prev.maxOfflineQueue !== next.maxOfflineQueue ||
    prev.storagePrefix !== next.storagePrefix ||
    prev.autoTrackDom !== next.autoTrackDom ||
    prev.autoTrackPages !== next.autoTrackPages
  ) {
    return false;
  }
  // Compare adapters by name rather than reference identity
  if (!areArraysEqual(prev.adapters, next.adapters, (a, b) => a?.name === b?.name)) {
    return false;
  }
  if (!areArraysEqual(prev.maskPatterns, next.maskPatterns, (x, y) => x?.toString() === y?.toString())) {
    return false;
  }
  return areMetadataEqual(prev.globalMetadata, next.globalMetadata);
}
/* eslint-enable security/detect-object-injection */

export function AnalyticsProvider({
  children,
  config,
  engine: externalEngine,
  onError,
}: AnalyticsProviderProps) {
  const [engineInstance, setEngineInstance] = React.useState<AnalyticsEngine | null>(
    () => externalEngine || (config ? null : getAnalyticsEngine())
  );

  const onErrorRef = React.useRef(onError || config?.onError);
  React.useEffect(() => {
    onErrorRef.current = onError || config?.onError;
  }, [onError, config?.onError]);

  const configRef = React.useRef<AnalyticsConfig | undefined>(config);
  const [configVersion, setConfigVersion] = React.useState(0);

  React.useEffect(() => {
    if (!isConfigEqual(configRef.current, config)) {
      configRef.current = config;
      setConfigVersion((v) => v + 1);
    }
  }, [config]);

  React.useEffect(() => {
    if (externalEngine) {
      setEngineInstance(externalEngine);
      return;
    }

    const currentConf = configRef.current;
    if (currentConf) {
      const stableConfig: AnalyticsConfig = {
        ...currentConf,
        onError: (err: unknown) => onErrorRef.current?.(err),
      };
      const engine = initAnalytics(stableConfig);
      setEngineInstance(engine);

      return () => {
        engine.destroy();
        setEngineInstance(null);
      };
    } else {
      setEngineInstance(getAnalyticsEngine());
    }
  }, [externalEngine, configVersion]);

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
