import { describe, it, expect } from "vitest";
import { maskSensitiveValue } from "../masking";

describe("maskSensitiveValue", () => {
  it("masks values when isMasked is true", () => {
    expect(maskSensitiveValue(50000, { isMasked: true })).toBe("••••••");
    expect(maskSensitiveValue("Sensitive Data", { isMasked: true, maskPattern: "***" })).toBe("***");
  });

  it("formats unmasked financial values as currency", () => {
    expect(maskSensitiveValue(15000, { isMasked: false, dataType: "FINANCIAL_DATA" })).toContain("15,000");
  });

  it("handles null and undefined safely", () => {
    expect(maskSensitiveValue(undefined)).toBe("—");
    expect(maskSensitiveValue(null)).toBe("—");
    expect(maskSensitiveValue(null, { isMasked: true })).toBe("••••••");
  });

  it("formats standard numbers or strings when dataType is not financial", () => {
    expect(maskSensitiveValue(42, { isMasked: false, dataType: "PII_DATA" })).toBe("42");
    expect(maskSensitiveValue("John Doe", { isMasked: false })).toBe("John Doe");
  });
});
