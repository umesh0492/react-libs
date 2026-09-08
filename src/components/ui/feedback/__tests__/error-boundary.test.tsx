import * as React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ErrorBoundary,
  withErrorBoundary,
  useErrorBoundary,
} from "../error-boundary";

// Component that throws on render conditionally
function ProblemChild({ shouldThrow, message }: { shouldThrow?: boolean; message?: string }) {
  if (shouldThrow) {
    throw new Error(message ?? "Crash occurred");
  }
  return <div>Healthy Child Content</div>;
}

// Suppress console.error in tests for expected thrown errors
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});

describe("ErrorBoundary", () => {
  it("renders children normally when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Healthy Child Content")).toBeInTheDocument();
  });

  it("catches render errors and renders default ErrorState fallback UI", () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} message="Simulated render crash" />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Simulated render crash")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("renders declarative ReactNode fallback prop", () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error Message</div>}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom Error Message")).toBeInTheDocument();
  });

  it("renders render-prop function fallback receiving error and resetErrorBoundary", () => {
    render(
      <ErrorBoundary
        fallback={({ error, resetErrorBoundary }) => (
          <div>
            <span>Error details: {error.message}</span>
            <button onClick={resetErrorBoundary}>Retry Now</button>
          </div>
        )}
      >
        <ProblemChild shouldThrow={true} message="Exploded" />
      </ErrorBoundary>
    );

    expect(screen.getByText("Error details: Exploded")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry Now" })).toBeInTheDocument();
  });

  it("invokes onError callback with error and errorInfo", () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ProblemChild shouldThrow={true} message="Audit error log" />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Audit error log" }),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it("resets boundary state and invokes onReset when resetErrorBoundary is triggered", () => {
    const onReset = vi.fn();

    function DynamicTest() {
      const [explode, setExplode] = React.useState(true);
      return (
        <ErrorBoundary
          onReset={() => {
            onReset();
            setExplode(false);
          }}
        >
          {explode ? <ProblemChild shouldThrow={true} message="Initial failure" /> : <div>Recovered Content</div>}
        </ErrorBoundary>
      );
    }

    render(<DynamicTest />);

    expect(screen.getByText("Initial failure")).toBeInTheDocument();

    const tryAgainBtn = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(tryAgainBtn);

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Recovered Content")).toBeInTheDocument();
  });

  it("resets automatically when resetKeys change", () => {
    function ResetKeysTest({ retryKey, explode }: { retryKey: number; explode: boolean }) {
      return (
        <ErrorBoundary resetKeys={[retryKey]}>
          {explode ? <ProblemChild shouldThrow={true} message="Crash on key" /> : <div>Key Content OK</div>}
        </ErrorBoundary>
      );
    }

    const { rerender } = render(<ResetKeysTest retryKey={1} explode={true} />);
    expect(screen.getByText("Crash on key")).toBeInTheDocument();

    // Rerender with changed resetKey and explode=false
    rerender(<ResetKeysTest retryKey={2} explode={false} />);
    expect(screen.getByText("Key Content OK")).toBeInTheDocument();
  });

  it("withErrorBoundary HOC wraps component and forwards ref", () => {
    const BaseButton = React.forwardRef<
      HTMLButtonElement,
      { shouldThrow?: boolean; label: string }
    >(({ shouldThrow, label }, ref) => {
      if (shouldThrow) throw new Error("HOC exploded");
      return <button ref={ref}>{label}</button>;
    });

    const SafeButton = withErrorBoundary(BaseButton, {
      fallback: <div data-testid="hoc-fallback">HOC Fallback</div>,
    });

    const ref = React.createRef<HTMLButtonElement>();
    const { rerender } = render(<SafeButton ref={ref} label="Clickable" />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByText("Clickable")).toBeInTheDocument();

    rerender(<SafeButton ref={ref} label="Clickable" shouldThrow={true} />);
    expect(screen.getByTestId("hoc-fallback")).toBeInTheDocument();
  });

  it("useErrorBoundary hook can imperatively trigger an error boundary", () => {
    function TriggerComponent() {
      const { showBoundary } = useErrorBoundary();
      return (
        <button onClick={() => showBoundary(new Error("Imperative crash"))}>
          Crash Me
        </button>
      );
    }

    render(
      <ErrorBoundary fallback={<div>Caught imperative crash</div>}>
        <TriggerComponent />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole("button", { name: "Crash Me" }));
    expect(screen.getByText("Caught imperative crash")).toBeInTheDocument();
  });
});
