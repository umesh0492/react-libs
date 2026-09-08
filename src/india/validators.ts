/**
 * @file validators.ts — India statutory validation patterns & helpers.
 *
 * Provides regex constants and validator functions for Indian business identifiers
 * including GSTIN, PAN, IFSC, Mobile numbers, FSSAI, and PIN codes.
 */

export const REGEX_GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[\dA-Z]$/;
export const REGEX_PAN = /^[A-Z]{5}\d{4}[A-Z]$/;
export const REGEX_PHONE_IN = /^[6-9]\d{9}$/;
export const REGEX_IFSC = /^[A-Z]{4}0[A-Z\d]{6}$/;
export const REGEX_BANK_ACCOUNT_IN = /^\d{9,18}$/;
export const REGEX_FSSAI = /^\d{14}$/;
export const REGEX_PINCODE = /^[1-9]\d{5}$/;

export const VALIDATION_MESSAGES_IN = {
  gstin: "Enter a valid 15-character GSTIN (e.g. 27AADCA1234D1Z5)",
  pan: "Enter a valid 10-character PAN (e.g. AADCA1234D)",
  phone: "Enter a valid 10-digit Indian mobile number",
  ifsc: "Enter a valid IFSC code (e.g. HDFC0001234)",
  bankAccount: "Account number must be 9–18 digits",
  fssai: "FSSAI license must be exactly 14 digits",
  pincode: "Enter a valid 6-digit pincode",
} as const;

export function validateGSTIN(value: string): string | undefined {
  const v = value.trim().toUpperCase();
  if (!v) return "GST Number is required";
  if (!REGEX_GSTIN.test(v)) return VALIDATION_MESSAGES_IN.gstin;
}

export function validatePAN(value: string): string | undefined {
  const v = value.trim().toUpperCase();
  if (!v) return "PAN Number is required";
  if (!REGEX_PAN.test(v)) return VALIDATION_MESSAGES_IN.pan;
}

export function validatePhoneIN(value: string): string | undefined {
  const v = value.trim().replace(/\s/g, "");
  if (!v) return "Phone number is required";
  if (!REGEX_PHONE_IN.test(v)) return VALIDATION_MESSAGES_IN.phone;
}

export function validateIFSC(value: string): string | undefined {
  const v = value.trim().toUpperCase();
  if (!v) return "IFSC code is required";
  if (!REGEX_IFSC.test(v)) return VALIDATION_MESSAGES_IN.ifsc;
}

export function validateBankAccountIN(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Account number is required";
  if (!REGEX_BANK_ACCOUNT_IN.test(v)) return VALIDATION_MESSAGES_IN.bankAccount;
}

export function validateFSSAI(value: string): string | undefined {
  if (!value || !value.trim()) return undefined;
  if (!REGEX_FSSAI.test(value.trim())) return VALIDATION_MESSAGES_IN.fssai;
}

export function validatePincode(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Pincode is required";
  if (!REGEX_PINCODE.test(v)) return VALIDATION_MESSAGES_IN.pincode;
}
