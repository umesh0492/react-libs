import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("updates value only after specified delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay?: number }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 400 } }
    );

    expect(result.current).toBe("first");

    // Change value
    rerender({ value: "second", delay: 400 });
    expect(result.current).toBe("first");

    // Advance 200ms (not yet reached 400ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("first");

    // Advance remaining 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("second");
  });

  it("resets timer if value changes before delay expires", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("a");

    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    // Total 300ms since 'b', but only 150ms since 'c'
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("c");
  });
});
