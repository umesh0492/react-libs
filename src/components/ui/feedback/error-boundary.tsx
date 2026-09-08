"use client";

import * as React from "react";
import { ErrorState } from "./error-state";

export interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export type FallbackRender = (props: FallbackProps) => React.ReactNode;

export interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode | FallbackRender;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function areResetKeysDifferent(
  prevKeys: unknown[] = [],
  nextKeys: unknown[] = []
): boolean {
  if (prevKeys.length !== nextKeys.length) return true;
  // eslint-disable-next-line security/detect-object-injection
  return prevKeys.some((k, i) => !Object.is(k, nextKeys[i]));
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (
      this.state.hasError &&
      prevProps.resetKeys &&
      this.props.resetKeys &&
      areResetKeysDifferent(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      if (typeof fallback === "function") {
        return (fallback as FallbackRender)({
          error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      if (fallback !== undefined) {
        return fallback;
      }

      return (
        <ErrorState
          title="Something went wrong"
          description={
            error.message ||
            "An unexpected error occurred while rendering this component."
          }
          actionLabel="Try again"
          onAction={this.resetErrorBoundary}
        />
      );
    }

    return children ?? null;
  }
}

/**
 * HOC to wrap components with an ErrorBoundary while preserving refs.
 */
export function withErrorBoundary<P extends object, Ref = unknown>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const Wrapped = React.forwardRef<Ref, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      {/* @ts-expect-error - generic forwardRef pass-through */}
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  Wrapped.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
}

/**
 * Hook to imperatively trigger an ErrorBoundary boundary from event handlers or async calls.
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return {
    showBoundary: (err: Error) => setError(err),
    resetBoundary: () => setError(null),
  };
}
