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
export function withAuditTrail<P extends object, Ref = unknown>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithAudit = React.forwardRef<Ref, P & WithAuditTrailProps>(
    function WithAuditTrail(props, ref) {
      const { actionName, entityId, entityType, auditLogger, onClick, ...rest } =
        props as WithAuditTrailProps;

      const handleClick = React.useCallback(
        (e: React.MouseEvent) => {
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
        },
        [actionName, entityType, entityId, auditLogger, onClick]
      );

      return <WrappedComponent {...(rest as unknown as P)} ref={ref} onClick={handleClick} />;
    }
  );

  ComponentWithAudit.displayName = `withAuditTrail(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithAudit;
}
