import { describe, it, expect } from "vitest";
import {
  REGEX_EMAIL,
  REGEX_PHONE,
  REGEX_POSTAL_CODE,
  REGEX_TAX_ID,
  REGEX_BANK_ACCOUNT,
  REGEX_ROUTING_CODE,
  REGEX_URL,
  VALIDATION_MESSAGES,
  validateEmail,
  validatePhone,
  validatePostalCode,
  validateTaxId,
  validateBankAccount,
  validateRoutingCode,
  validateUrl,
} from "../validators";

describe("Universal Validators & Regex", () => {
  describe("REGEX_EMAIL", () => {
    it("matches valid emails", () => {
      expect(REGEX_EMAIL.test("user@example.com")).toBe(true);
      expect(REGEX_EMAIL.test("first.last@sub.domain.co")).toBe(true);
      expect(REGEX_EMAIL.test("user+tag@domain.org")).toBe(true);
    });
    it("rejects invalid emails", () => {
      expect(REGEX_EMAIL.test("notanemail")).toBe(false);
      expect(REGEX_EMAIL.test("@domain.com")).toBe(false);
      expect(REGEX_EMAIL.test("user@")).toBe(false);
      expect(REGEX_EMAIL.test("")).toBe(false);
    });
  });

  describe("REGEX_PHONE", () => {
    it("matches international phone numbers", () => {
      expect(REGEX_PHONE.test("+14155552671")).toBe(true);
      expect(REGEX_PHONE.test("442071838750")).toBe(true);
      expect(REGEX_PHONE.test("+919876543210")).toBe(true);
    });
    it("rejects invalid numbers", () => {
      expect(REGEX_PHONE.test("123")).toBe(false); // too short
      expect(REGEX_PHONE.test("abc1234567")).toBe(false);
      expect(REGEX_PHONE.test("")).toBe(false);
    });
  });

  describe("REGEX_POSTAL_CODE", () => {
    it("matches universal postal/ZIP codes", () => {
      expect(REGEX_POSTAL_CODE.test("90210")).toBe(true);
      expect(REGEX_POSTAL_CODE.test("SW1A 1AA")).toBe(true);
      expect(REGEX_POSTAL_CODE.test("K1A-0B1")).toBe(true);
      expect(REGEX_POSTAL_CODE.test("100-0001")).toBe(true);
    });
    it("rejects invalid postal codes", () => {
      expect(REGEX_POSTAL_CODE.test("12")).toBe(false); // too short
      expect(REGEX_POSTAL_CODE.test("123456789012")).toBe(false); // too long
    });
  });

  describe("REGEX_TAX_ID", () => {
    it("matches standard tax and business registration IDs", () => {
      expect(REGEX_TAX_ID.test("12-3456789")).toBe(true); // US EIN
      expect(REGEX_TAX_ID.test("GB123456789")).toBe(true); // UK VAT
      expect(REGEX_TAX_ID.test("DE123456789")).toBe(true); // German VAT
      expect(REGEX_TAX_ID.test("27AADCA1234D1Z5")).toBe(true);
    });
    it("rejects invalid tax IDs", () => {
      expect(REGEX_TAX_ID.test("123")).toBe(false); // too short
      expect(REGEX_TAX_ID.test("")).toBe(false);
    });
  });

  describe("REGEX_BANK_ACCOUNT", () => {
    it("matches standard account / IBAN numbers", () => {
      expect(REGEX_BANK_ACCOUNT.test("123456789")).toBe(true);
      expect(REGEX_BANK_ACCOUNT.test("GB29NWBK60161331926819")).toBe(true);
      expect(REGEX_BANK_ACCOUNT.test("123456789012345678")).toBe(true);
    });
    it("rejects invalid bank accounts", () => {
      expect(REGEX_BANK_ACCOUNT.test("12345")).toBe(false); // too short
      expect(REGEX_BANK_ACCOUNT.test("")).toBe(false);
    });
  });

  describe("REGEX_ROUTING_CODE", () => {
    it("matches routing and SWIFT/BIC codes", () => {
      expect(REGEX_ROUTING_CODE.test("021000021")).toBe(true); // US ABA routing
      expect(REGEX_ROUTING_CODE.test("CHASUS33")).toBe(true); // 8-char SWIFT
      expect(REGEX_ROUTING_CODE.test("CHASUS33XXX")).toBe(true); // 11-char SWIFT
    });
    it("rejects invalid routing codes", () => {
      expect(REGEX_ROUTING_CODE.test("12")).toBe(false);
      expect(REGEX_ROUTING_CODE.test("TOOLONGROUTINGCODE123")).toBe(false);
    });
  });

  describe("REGEX_URL", () => {
    it("matches valid URLs", () => {
      expect(REGEX_URL.test("https://example.com")).toBe(true);
      expect(REGEX_URL.test("http://sub.domain.org/path?q=1#hash")).toBe(true);
    });
    it("rejects invalid URLs", () => {
      expect(REGEX_URL.test("ftp://invalid.com")).toBe(false);
      expect(REGEX_URL.test("not a url")).toBe(false);
    });
  });

  // ─── Validator Functions ───────────────────────────────────────────────────

  describe("validateEmail", () => {
    it("returns undefined for valid email", () => {
      expect(validateEmail("user@example.com")).toBeUndefined();
    });
    it("returns required error for empty email", () => {
      expect(validateEmail("")).toBe("Email address is required");
    });
    it("returns format error for invalid email", () => {
      expect(validateEmail("invalid")).toBe(VALIDATION_MESSAGES.email);
    });
  });

  describe("validatePhone", () => {
    it("returns undefined for valid phone", () => {
      expect(validatePhone("+1 (415) 555-2671")).toBeUndefined();
    });
    it("returns required error for empty phone", () => {
      expect(validatePhone("")).toBe("Phone number is required");
    });
    it("returns format error for invalid phone", () => {
      expect(validatePhone("123")).toBe(VALIDATION_MESSAGES.phone);
    });
  });

  describe("validatePostalCode", () => {
    it("returns undefined for valid postal code", () => {
      expect(validatePostalCode("90210")).toBeUndefined();
      expect(validatePostalCode("SW1A 1AA")).toBeUndefined();
    });
    it("returns required error for empty postal code", () => {
      expect(validatePostalCode("")).toBe("Postal code is required");
    });
  });

  describe("validateTaxId", () => {
    it("returns undefined for valid tax ID", () => {
      expect(validateTaxId("US123456789")).toBeUndefined();
    });
    it("returns required error for empty tax ID", () => {
      expect(validateTaxId("")).toBe("Tax ID is required");
    });
  });

  describe("validateBankAccount", () => {
    it("returns undefined for valid bank account", () => {
      expect(validateBankAccount("123456789012")).toBeUndefined();
    });
    it("returns required error for empty bank account", () => {
      expect(validateBankAccount("")).toBe("Bank account number is required");
    });
  });

  describe("validateRoutingCode", () => {
    it("returns undefined for valid routing code", () => {
      expect(validateRoutingCode("CHASUS33")).toBeUndefined();
    });
    it("returns required error for empty routing code", () => {
      expect(validateRoutingCode("")).toBe("Routing code is required");
    });
  });

  describe("validateUrl", () => {
    it("returns undefined for valid URL", () => {
      expect(validateUrl("https://example.com")).toBeUndefined();
    });
    it("returns required error for empty URL", () => {
      expect(validateUrl("")).toBe("URL is required");
    });
    it("returns format error for invalid URL", () => {
      expect(validateUrl("badurl")).toBe(VALIDATION_MESSAGES.url);
    });
  });
});
