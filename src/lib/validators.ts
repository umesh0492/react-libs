/**
 * validators.ts — India-specific field validation patterns & helpers.
 *
 * All regex constants are exported so consuming apps can use them in
 * custom form libraries (react-hook-form, zod, yup) or plain validation
 * functions. Each constant is paired with a descriptive error message.
 */

// ─── Regex Patterns ──────────────────────────────────────────────────────────

/** 15-character GSTIN: 2-digit state code + PAN + 1 entity num + Z + 1 checksum */
export const REGEX_GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[\dA-Z]$/;

/** 10-character PAN: 5 alpha + 4 numeric + 1 alpha */
export const REGEX_PAN = /^[A-Z]{5}\d{4}[A-Z]$/;

/** Indian mobile number: 10 digits starting with 6–9 */
export const REGEX_PHONE_IN = /^[6-9]\d{9}$/;

/** Standard email (lenient but safe from backtracking) */
export const REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** IFSC code: 4 alpha + 0 + 6 alphanumeric */
export const REGEX_IFSC = /^[A-Z]{4}0[A-Z\d]{6}$/;

/** Bank account number: 9–18 digits */
export const REGEX_BANK_ACCOUNT = /^\d{9,18}$/;

/** 14-digit FSSAI license number */
export const REGEX_FSSAI = /^\d{14}$/;

/** 6-digit Indian pincode */
export const REGEX_PINCODE = /^[1-9]\d{5}$/;

// ─── Error Messages ───────────────────────────────────────────────────────────

export const VALIDATION_MESSAGES = {
  gstin:       "Enter a valid 15-character GSTIN (e.g. 27AADCA1234D1Z5)",
  pan:         "Enter a valid 10-character PAN (e.g. AADCA1234D)",
  phone:       "Enter a valid 10-digit Indian mobile number",
  email:       "Enter a valid email address",
  ifsc:        "Enter a valid IFSC code (e.g. HDFC0001234)",
  bankAccount: "Account number must be 9–18 digits",
  fssai:       "FSSAI license must be exactly 14 digits",
  pincode:     "Enter a valid 6-digit pincode",
} as const;

// ─── Validator Functions ──────────────────────────────────────────────────────

/** Returns undefined if valid, or an error string if invalid. */

export function validateGSTIN(value: string): string | undefined {
  const v = value.trim().toUpperCase();
  if (!v) return "GST Number is required";
  if (!REGEX_GSTIN.test(v)) return VALIDATION_MESSAGES.gstin;
}

export function validatePAN(value: string): string | undefined {
  const v = value.trim().toUpperCase();
  if (!v) return "PAN Number is required";
  if (!REGEX_PAN.test(v)) return VALIDATION_MESSAGES.pan;
}

export function validatePhoneIN(value: string): string | undefined {
  const v = value.trim().replace(/\s/g, "");
  if (!v) return "Phone number is required";
  if (!REGEX_PHONE_IN.test(v)) return VALIDATION_MESSAGES.phone;
}

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Email address is required";
  if (!REGEX_EMAIL.test(v)) return VALIDATION_MESSAGES.email;
}

export function validateIFSC(value: string): string | undefined {
  const v = value.trim().toUpperCase();
  if (!v) return "IFSC code is required";
  if (!REGEX_IFSC.test(v)) return VALIDATION_MESSAGES.ifsc;
}

export function validateBankAccount(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Account number is required";
  if (!REGEX_BANK_ACCOUNT.test(v)) return VALIDATION_MESSAGES.bankAccount;
}

export function validateFSSAI(value: string): string | undefined {
  if (!value || !value.trim()) return undefined; // optional field
  if (!REGEX_FSSAI.test(value.trim())) return VALIDATION_MESSAGES.fssai;
}

export function validatePincode(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Pincode is required";
  if (!REGEX_PINCODE.test(v)) return VALIDATION_MESSAGES.pincode;
}
