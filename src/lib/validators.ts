/**
 * @file validators.ts — Universal field validation patterns & helpers.
 *
 * All regex constants are exported so consuming apps can use them in
 * custom form libraries (react-hook-form, zod, yup) or plain validation
 * functions. Each constant is paired with a descriptive error message.
 */

// ─── Regex Patterns ──────────────────────────────────────────────────────────

/** Standard email address (RFC 5322 compatible, safe from ReDoS backtracking) */
export const REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** International phone number (E.164 compatible: optional +, 7 to 15 digits) */
export const REGEX_PHONE = /^\+?[1-9]\d{6,14}$/;

/** Universal postal / ZIP code (3 to 10 alphanumeric characters with optional hyphens/spaces) */
export const REGEX_POSTAL_CODE = /^[A-Za-z0-9\s-]{3,10}$/;

/** Generic tax identification number (EIN, VAT, ABN, etc.: 6 to 20 alphanumeric characters) */
export const REGEX_TAX_ID = /^[A-Za-z0-9\s-]{6,20}$/;

/** International Bank Account / IBAN number (6 to 34 alphanumeric characters) */
export const REGEX_BANK_ACCOUNT = /^[A-Za-z0-9]{6,34}$/;

/** Bank routing transit code / SWIFT / BIC (4 to 11 alphanumeric characters) */
export const REGEX_ROUTING_CODE = /^[A-Za-z0-9]{4,11}$/;

/** Web URL (http or https) */
export const REGEX_URL = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

// ─── Error Messages ───────────────────────────────────────────────────────────

export const VALIDATION_MESSAGES = {
  email: "Enter a valid email address",
  phone: "Enter a valid international phone number",
  postalCode: "Enter a valid postal or ZIP code",
  taxId: "Enter a valid tax identification number",
  bankAccount: "Enter a valid bank account or IBAN number",
  routingCode: "Enter a valid routing code or SWIFT/BIC",
  url: "Enter a valid URL (e.g. https://example.com)",
} as const;

// ─── Validator Functions ──────────────────────────────────────────────────────

/** Returns undefined if valid, or an error string if invalid. */

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Email address is required";
  if (!REGEX_EMAIL.test(v)) return VALIDATION_MESSAGES.email;
}

export function validatePhone(value: string): string | undefined {
  const v = value.trim().replace(/[\s()-]/g, "");
  if (!v) return "Phone number is required";
  if (!REGEX_PHONE.test(v)) return VALIDATION_MESSAGES.phone;
}

export function validatePostalCode(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Postal code is required";
  if (!REGEX_POSTAL_CODE.test(v)) return VALIDATION_MESSAGES.postalCode;
}

export function validateTaxId(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Tax ID is required";
  if (!REGEX_TAX_ID.test(v)) return VALIDATION_MESSAGES.taxId;
}

export function validateBankAccount(value: string): string | undefined {
  const v = value.trim().replace(/\s/g, "");
  if (!v) return "Bank account number is required";
  if (!REGEX_BANK_ACCOUNT.test(v)) return VALIDATION_MESSAGES.bankAccount;
}

export function validateRoutingCode(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Routing code is required";
  if (!REGEX_ROUTING_CODE.test(v)) return VALIDATION_MESSAGES.routingCode;
}

export function validateUrl(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "URL is required";
  if (!REGEX_URL.test(v)) return VALIDATION_MESSAGES.url;
}

