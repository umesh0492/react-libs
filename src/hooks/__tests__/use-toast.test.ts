import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast, toast } from "../use-toast";

describe("useToast", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("dispatches toast and updates state across all subscribers", () => {
    const { result: sub1 } = renderHook(() => useToast());
    const { result: sub2 } = renderHook(() => useToast());

    act(() => {
      toast({
        title: "Test Notification",
        description: "Operation successful",
      });
    });

    expect(sub1.current.toasts.length).toBe(1);
    expect(sub1.current.toasts[0]!.title).toBe("Test Notification");

    expect(sub2.current.toasts.length).toBe(1);
    expect(sub2.current.toasts[0]!.title).toBe("Test Notification");
  });

  it("allows updating an existing toast in-flight", () => {
    const { result } = renderHook(() => useToast());

    let toastHandle!: ReturnType<typeof toast>;
    act(() => {
      toastHandle = toast({
        title: "Initial Title",
      });
    });

    expect(result.current.toasts[0]!.title).toBe("Initial Title");

    act(() => {
      toastHandle.update({
        id: toastHandle.id,
        title: "Updated Title",
      });
    });

    expect(result.current.toasts[0]!.title).toBe("Updated Title");
  });

  it("dismisses toast and marks open as false", () => {
    const { result } = renderHook(() => useToast());

    let toastHandle!: ReturnType<typeof toast>;
    act(() => {
      toastHandle = toast({
        title: "Dismiss Me",
      });
    });

    expect(result.current.toasts[0]!.open).toBe(true);

    act(() => {
      toastHandle.dismiss();
    });

    expect(result.current.toasts[0]!.open).toBe(false);
  });
});
