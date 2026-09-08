import { describe, it, expect } from "vitest";
import {
  REGEX_GSTIN,
  REGEX_PAN,
  REGEX_PHONE_IN,
  REGEX_IFSC,
  REGEX_BANK_ACCOUNT_IN,
  REGEX_FSSAI,
  REGEX_PINCODE,
  VALIDATION_MESSAGES_IN,
  validateGSTIN,
  validatePAN,
  validatePhoneIN,
  validateIFSC,
  validateBankAccountIN,
  validateFSSAI,
  validatePincode,
  calculateGSTSplit,
  calculateTDS,
  INDIAN_LANGUAGES,
  formatLakhs,
  formatCrores,
} from "../index";

describe("@umesh0492/react-libs/india", () => {
  describe("Validators & Regex", () => {
    it("validates GSTIN correctly", () => {
      expect(REGEX_GSTIN.test("27AADCA1234D1Z5")).toBe(true);
      expect(REGEX_GSTIN.test("29AADCA1234D1ZA")).toBe(true);
      expect(REGEX_GSTIN.test("INVALID")).toBe(false);

      expect(validateGSTIN("27AADCA1234D1Z5")).toBeUndefined();
      expect(validateGSTIN("")).toBe("GST Number is required");
      expect(validateGSTIN("INVALID")).toBe(VALIDATION_MESSAGES_IN.gstin);
    });

    it("validates PAN correctly", () => {
      expect(REGEX_PAN.test("AADCA1234D")).toBe(true);
      expect(REGEX_PAN.test("INVALID")).toBe(false);

      expect(validatePAN("AADCA1234D")).toBeUndefined();
      expect(validatePAN("")).toBe("PAN Number is required");
      expect(validatePAN("INVALID")).toBe(VALIDATION_MESSAGES_IN.pan);
    });

    it("validates Indian mobile numbers correctly", () => {
      expect(REGEX_PHONE_IN.test("9876543210")).toBe(true);
      expect(REGEX_PHONE_IN.test("5876543210")).toBe(false); // starts with 5

      expect(validatePhoneIN("9876543210")).toBeUndefined();
      expect(validatePhoneIN("")).toBe("Phone number is required");
      expect(validatePhoneIN("1234567890")).toBe(VALIDATION_MESSAGES_IN.phone);
    });

    it("validates IFSC code correctly", () => {
      expect(REGEX_IFSC.test("HDFC0001234")).toBe(true);
      expect(REGEX_IFSC.test("HDFC1001234")).toBe(false); // 5th char must be 0

      expect(validateIFSC("HDFC0001234")).toBeUndefined();
      expect(validateIFSC("")).toBe("IFSC code is required");
      expect(validateIFSC("BADIFSC")).toBe(VALIDATION_MESSAGES_IN.ifsc);
    });

    it("validates bank accounts correctly", () => {
      expect(REGEX_BANK_ACCOUNT_IN.test("123456789012")).toBe(true);
      expect(REGEX_BANK_ACCOUNT_IN.test("1234")).toBe(false);

      expect(validateBankAccountIN("123456789012")).toBeUndefined();
      expect(validateBankAccountIN("")).toBe("Account number is required");
      expect(validateBankAccountIN("123")).toBe(VALIDATION_MESSAGES_IN.bankAccount);
    });

    it("validates FSSAI numbers correctly", () => {
      expect(REGEX_FSSAI.test("12345678901234")).toBe(true);
      expect(validateFSSAI("")).toBeUndefined(); // optional
      expect(validateFSSAI("12345678901234")).toBeUndefined();
      expect(validateFSSAI("123")).toBe(VALIDATION_MESSAGES_IN.fssai);
    });

    it("validates PIN codes correctly", () => {
      expect(REGEX_PINCODE.test("400001")).toBe(true);
      expect(REGEX_PINCODE.test("011001")).toBe(false);

      expect(validatePincode("400001")).toBeUndefined();
      expect(validatePincode("")).toBe("Pincode is required");
      expect(validatePincode("011001")).toBe(VALIDATION_MESSAGES_IN.pincode);
    });
  });

  describe("Tax Calculations", () => {
    it("calculates intra-state GST split (CGST + SGST)", () => {
      const res = calculateGSTSplit(10000, 18, true, false);
      expect(res.baseAmount).toBe(10000);
      expect(res.totalTax).toBe(1800);
      expect(res.cgstAmount).toBe(900);
      expect(res.sgstAmount).toBe(900);
      expect(res.igstAmount).toBe(0);
      expect(res.totalPayable).toBe(11800);
    });

    it("calculates inter-state GST (IGST)", () => {
      const res = calculateGSTSplit(10000, 18, false, false);
      expect(res.baseAmount).toBe(10000);
      expect(res.totalTax).toBe(1800);
      expect(res.cgstAmount).toBe(0);
      expect(res.sgstAmount).toBe(0);
      expect(res.igstAmount).toBe(1800);
      expect(res.totalPayable).toBe(11800);
    });

    it("calculates tax-inclusive GST", () => {
      const res = calculateGSTSplit(11800, 18, true, true);
      expect(Math.round(res.baseAmount)).toBe(10000);
      expect(Math.round(res.totalTax)).toBe(1800);
      expect(Math.round(res.cgstAmount)).toBe(900);
      expect(Math.round(res.sgstAmount)).toBe(900);
    });

    it("calculates TDS withholding", () => {
      expect(calculateTDS(10000, 2)).toBe(200);
      expect(calculateTDS(10000, 0)).toBe(0);
    });
  });

  describe("Constants & Formatting", () => {
    it("provides scheduled Indian languages", () => {
      expect(INDIAN_LANGUAGES.length).toBeGreaterThanOrEqual(10);
      expect(INDIAN_LANGUAGES.some((l) => l.code === "hi")).toBe(true);
    });

    it("formats Lakhs and Crores", () => {
      expect(formatLakhs(500000)).toContain("5L");
      expect(formatCrores(25000000)).toContain("2.5Cr");
    });
  });
});
