import * as React from "react";

export interface AuditTrailPayload {
  actionName: string;
  entityId?: string;
  entityType?: string;
  userId?: string;
  userName?: string;
  role?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export type AuditLogger = (payload: AuditTrailPayload) => Promise<void> | void;

let globalAuditLogger: AuditLogger | null = null;

export function setGlobalAuditLogger(logger: AuditLogger | null) {
  globalAuditLogger = logger;
}

export interface WithAuditTrailProps {
  actionName: string;
  entityId?: string;
  entityType?: string;
  auditLogger?: AuditLogger;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: unknown;
}

/**
 * Higher-Order Component that wraps any clickable element to emit an audit telemetry event.
 */
export function withAuditTrail<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuditTrail(props: P & WithAuditTrailProps) {
    const { actionName, entityId, entityType, auditLogger, onClick, ...rest } =
      props;

    const handleClick = (e: React.MouseEvent) => {
      const payload: AuditTrailPayload = {
        actionName,
        entityType: entityType ?? "Unknown",
        entityId: entityId ?? undefined,
        timestamp: new Date().toISOString(),
      };

      const logger = auditLogger || globalAuditLogger;
      if (logger) {
        try {
          const res = logger(payload);
          if (res instanceof Promise) {
            res.catch(() => {});
          }
        } catch {
          // Swallow telemetry errors to never block user action
        }
      }

      if (onClick && typeof onClick === "function") {
        onClick(e);
      }
    };

    // @ts-expect-error — HOC prop spread is intentionally generic
    return <WrappedComponent {...rest} onClick={handleClick} />;
  };
}
