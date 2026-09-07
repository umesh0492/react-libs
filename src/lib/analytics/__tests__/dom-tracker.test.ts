import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DomTracker } from "../dom-tracker";

describe("DomTracker Event Delegation", () => {
  let tracker: DomTracker;
  const onInteraction = vi.fn();

  beforeEach(() => {
    document.body.innerHTML = "";
    onInteraction.mockClear();
    tracker = new DomTracker({ onInteraction });
    tracker.start();
  });

  afterEach(() => {
    tracker.stop();
  });

  it("captures button clicks and derives accessible label", () => {
    const btn = document.createElement("button");
    btn.textContent = "Submit Form";
    document.body.appendChild(btn);

    btn.click();

    expect(onInteraction).toHaveBeenCalledTimes(1);
    const [comp] = onInteraction.mock.calls[0];
    expect(comp.name).toBe("Submit Form");
    expect(comp.interaction).toBe("click");
    expect(comp.id).toMatch(/^cmp_/);
  });

  it("reads explicit data-track-name and data-track-metadata", () => {
    const btn = document.createElement("button");
    btn.setAttribute("data-track-name", "custom_btn_action");
    btn.setAttribute(
      "data-track-metadata",
      JSON.stringify({ orderId: "ORD-99", amount: 1200 })
    );
    btn.textContent = "Ignored Text";
    document.body.appendChild(btn);

    btn.click();

    expect(onInteraction).toHaveBeenCalledTimes(1);
    const [comp, meta] = onInteraction.mock.calls[0];
    expect(comp.name).toBe("custom_btn_action");
    expect(meta).toEqual({ orderId: "ORD-99", amount: 1200 });
  });

  it("inherits contextual journey and step from parent track area", () => {
    const area = document.createElement("div");
    area.setAttribute("data-track-area", "");
    area.setAttribute("data-track-area-journey", "vendor_onboarding");
    area.setAttribute("data-track-area-step", "bank_account");
    area.setAttribute(
      "data-track-area-metadata",
      JSON.stringify({ vendorType: "domestic" })
    );

    const btn = document.createElement("button");
    btn.textContent = "Next Step";
    area.appendChild(btn);
    document.body.appendChild(area);

    btn.click();

    expect(onInteraction).toHaveBeenCalledTimes(1);
    const [, meta] = onInteraction.mock.calls[0];
    expect(meta).toEqual({
      journey: "vendor_onboarding",
      step: "bank_account",
      vendorType: "domestic",
    });
  });

  it("masks and ignores password fields and sensitive inputs", () => {
    const pwdInput = document.createElement("input");
    pwdInput.type = "password";
    document.body.appendChild(pwdInput);

    pwdInput.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onInteraction).not.toHaveBeenCalled();

    const ignoredBtn = document.createElement("button");
    ignoredBtn.setAttribute("data-track-ignore", "");
    ignoredBtn.textContent = "Secret Action";
    document.body.appendChild(ignoredBtn);

    ignoredBtn.click();
    expect(onInteraction).not.toHaveBeenCalled();
  });
});
