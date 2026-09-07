import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns initial value when storage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("reads existing value from localStorage", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("stored");
  });

  it("updates value directly and persists to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(window.localStorage.getItem("test-key")!)).toBe("updated");
  });

  it("updates value with functional updater without stale closures", () => {
    const { result } = renderHook(() => useLocalStorage<number>("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
      result.current[1]((prev) => prev + 2);
    });

    expect(result.current[0]).toBe(3);
    expect(JSON.parse(window.localStorage.getItem("counter")!)).toBe(3);
  });

  it("syncs state across hooks via local-storage event", () => {
    const { result: hook1 } = renderHook(() => useLocalStorage("shared-key", "default"));
    const { result: hook2 } = renderHook(() => useLocalStorage("shared-key", "default"));

    expect(hook1.current[0]).toBe("default");
    expect(hook2.current[0]).toBe("default");

    act(() => {
      hook1.current[1]("new-shared-value");
    });

    expect(hook1.current[0]).toBe("new-shared-value");
    expect(hook2.current[0]).toBe("new-shared-value");
  });

  it("syncs state from external StorageEvent for matching key and ignores other keys", () => {
    const { result } = renderHook(() => useLocalStorage("target-key", "original"));

    // Simulate storage event for a completely different key
    window.localStorage.setItem("other-key", JSON.stringify("ignored"));
    act(() => {
      const event = new StorageEvent("storage", {
        key: "other-key",
        newValue: JSON.stringify("ignored"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("original");

    // Simulate storage event for target-key
    window.localStorage.setItem("target-key", JSON.stringify("from-external-tab"));
    act(() => {
      const event = new StorageEvent("storage", {
        key: "target-key",
        newValue: JSON.stringify("from-external-tab"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("from-external-tab");
  });
});
