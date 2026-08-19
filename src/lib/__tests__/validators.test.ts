import { describe, it, expect } from 'vitest';
import {
  REGEX_GSTIN,
  REGEX_PAN,
  REGEX_PHONE_IN,
  REGEX_EMAIL,
  REGEX_IFSC,
  REGEX_BANK_ACCOUNT,
  REGEX_FSSAI,
  REGEX_PINCODE,
  VALIDATION_MESSAGES,
  validateGSTIN,
  validatePAN,
  validatePhoneIN,
  validateEmail,
  validateIFSC,
  validateBankAccount,
  validateFSSAI,
  validatePincode,
} from '../validators';

// ─── Regex patterns ───────────────────────────────────────────────────────────

describe('REGEX_GSTIN', () => {
  it('matches a valid GSTIN', () => {
    expect(REGEX_GSTIN.test('27AADCA1234D1Z5')).toBe(true);
    expect(REGEX_GSTIN.test('29AADCA1234D1ZA')).toBe(true);
  });
  it('rejects invalid GSTINs', () => {
    expect(REGEX_GSTIN.test('INVALIDGSTIN')).toBe(false);
    expect(REGEX_GSTIN.test('27AADCA1234D1Z')).toBe(false);  // too short
    expect(REGEX_GSTIN.test('')).toBe(false);
  });
});

describe('REGEX_PAN', () => {
  it('matches a valid PAN', () => {
    expect(REGEX_PAN.test('AADCA1234D')).toBe(true);
    expect(REGEX_PAN.test('ABCDE1234Z')).toBe(true);
  });
  it('rejects invalid PANs', () => {
    expect(REGEX_PAN.test('aadca1234d')).toBe(false);  // lowercase
    expect(REGEX_PAN.test('AADCA123D')).toBe(false);   // too short
    expect(REGEX_PAN.test('')).toBe(false);
  });
});

describe('REGEX_PHONE_IN', () => {
  it('matches valid Indian mobile numbers', () => {
    expect(REGEX_PHONE_IN.test('9876543210')).toBe(true);
    expect(REGEX_PHONE_IN.test('6000000000')).toBe(true);
  });
  it('rejects invalid numbers', () => {
    expect(REGEX_PHONE_IN.test('1234567890')).toBe(false);  // starts with 1
    expect(REGEX_PHONE_IN.test('987654321')).toBe(false);   // 9 digits
    expect(REGEX_PHONE_IN.test('98765432100')).toBe(false); // 11 digits
    expect(REGEX_PHONE_IN.test('')).toBe(false);
  });
});

describe('REGEX_EMAIL', () => {
  it('matches valid emails', () => {
    expect(REGEX_EMAIL.test('user@example.com')).toBe(true);
    expect(REGEX_EMAIL.test('admin+tag@sub.domain.in')).toBe(true);
  });
  it('rejects invalid emails', () => {
    expect(REGEX_EMAIL.test('notanemail')).toBe(false);
    expect(REGEX_EMAIL.test('missing@dot')).toBe(false);
    expect(REGEX_EMAIL.test('')).toBe(false);
  });
});

describe('REGEX_IFSC', () => {
  it('matches valid IFSC codes', () => {
    expect(REGEX_IFSC.test('HDFC0001234')).toBe(true);
    expect(REGEX_IFSC.test('SBIN0001234')).toBe(true);
  });
  it('rejects invalid IFSC codes', () => {
    expect(REGEX_IFSC.test('HDFC1001234')).toBe(false); // 5th char should be 0
    expect(REGEX_IFSC.test('hDFC0001234')).toBe(false); // lowercase
    expect(REGEX_IFSC.test('')).toBe(false);
  });
});

describe('REGEX_BANK_ACCOUNT', () => {
  it('matches 9–18 digit account numbers', () => {
    expect(REGEX_BANK_ACCOUNT.test('123456789')).toBe(true);      // 9 digits
    expect(REGEX_BANK_ACCOUNT.test('123456789012345678')).toBe(true); // 18 digits
  });
  it('rejects out-of-range lengths', () => {
    expect(REGEX_BANK_ACCOUNT.test('12345678')).toBe(false);  // 8 digits
    expect(REGEX_BANK_ACCOUNT.test('1234567890123456789')).toBe(false); // 19 digits
    expect(REGEX_BANK_ACCOUNT.test('12345abc0')).toBe(false); // non-numeric
  });
});

describe('REGEX_FSSAI', () => {
  it('matches exactly 14 digits', () => {
    expect(REGEX_FSSAI.test('12345678901234')).toBe(true);
  });
  it('rejects other lengths', () => {
    expect(REGEX_FSSAI.test('1234567890123')).toBe(false);   // 13
    expect(REGEX_FSSAI.test('123456789012345')).toBe(false); // 15
  });
});

describe('REGEX_PINCODE', () => {
  it('matches valid 6-digit pincodes', () => {
    expect(REGEX_PINCODE.test('110001')).toBe(true);
    expect(REGEX_PINCODE.test('400001')).toBe(true);
  });
  it('rejects invalid pincodes', () => {
    expect(REGEX_PINCODE.test('011001')).toBe(false); // starts with 0
    expect(REGEX_PINCODE.test('11000')).toBe(false);  // 5 digits
    expect(REGEX_PINCODE.test('')).toBe(false);
  });
});

// ─── VALIDATION_MESSAGES ──────────────────────────────────────────────────────

describe('VALIDATION_MESSAGES', () => {
  it('exports all required message keys', () => {
    const keys = ['gstin', 'pan', 'phone', 'email', 'ifsc', 'bankAccount', 'fssai', 'pincode'];
    for (const k of keys) {
      expect(VALIDATION_MESSAGES).toHaveProperty(k);
      expect(typeof VALIDATION_MESSAGES[k as keyof typeof VALIDATION_MESSAGES]).toBe('string');
    }
  });
});

// ─── Validator functions ──────────────────────────────────────────────────────

describe('validateGSTIN', () => {
  it('returns undefined for a valid GSTIN', () => {
    expect(validateGSTIN('27AADCA1234D1Z5')).toBeUndefined();
  });
  it('returns required error for empty string', () => {
    expect(validateGSTIN('')).toBe('GST Number is required');
  });
  it('returns format error for invalid GSTIN', () => {
    expect(validateGSTIN('INVALID')).toBe(VALIDATION_MESSAGES.gstin);
  });
  it('is case-insensitive (normalises to upper)', () => {
    expect(validateGSTIN('27aadca1234d1z5')).toBeUndefined();
  });
});

describe('validatePAN', () => {
  it('returns undefined for valid PAN', () => {
    expect(validatePAN('AADCA1234D')).toBeUndefined();
  });
  it('returns required error for empty string', () => {
    expect(validatePAN('')).toBe('PAN Number is required');
  });
  it('returns format error for invalid PAN', () => {
    expect(validatePAN('INVALID')).toBe(VALIDATION_MESSAGES.pan);
  });
  it('is case-insensitive', () => {
    expect(validatePAN('aadca1234d')).toBeUndefined();
  });
});

describe('validatePhoneIN', () => {
  it('returns undefined for valid phone', () => {
    expect(validatePhoneIN('9876543210')).toBeUndefined();
  });
  it('returns required error for empty string', () => {
    expect(validatePhoneIN('')).toBe('Phone number is required');
  });
  it('returns format error for invalid phone', () => {
    expect(validatePhoneIN('1234567890')).toBe(VALIDATION_MESSAGES.phone);
  });
  it('strips whitespace before validating', () => {
    expect(validatePhoneIN('  9876543210  ')).toBeUndefined();
  });
});

describe('validateEmail', () => {
  it('returns undefined for valid email', () => {
    expect(validateEmail('user@example.com')).toBeUndefined();
  });
  it('returns required error for empty string', () => {
    expect(validateEmail('')).toBe('Email address is required');
  });
  it('returns format error for invalid email', () => {
    expect(validateEmail('notanemail')).toBe(VALIDATION_MESSAGES.email);
  });
});

describe('validateIFSC', () => {
  it('returns undefined for valid IFSC', () => {
    expect(validateIFSC('HDFC0001234')).toBeUndefined();
  });
  it('returns required error for empty string', () => {
    expect(validateIFSC('')).toBe('IFSC code is required');
  });
  it('returns format error for invalid IFSC', () => {
    expect(validateIFSC('BADIFSC')).toBe(VALIDATION_MESSAGES.ifsc);
  });
  it('normalises to uppercase', () => {
    expect(validateIFSC('hdfc0001234')).toBeUndefined();
  });
});

describe('validateBankAccount', () => {
  it('returns undefined for valid 12-digit account', () => {
    expect(validateBankAccount('123456789012')).toBeUndefined();
  });
  it('returns required error for empty string', () => {
    expect(validateBankAccount('')).toBe('Account number is required');
  });
  it('returns format error for invalid account', () => {
    expect(validateBankAccount('12345abc')).toBe(VALIDATION_MESSAGES.bankAccount);
  });
});

describe('validateFSSAI', () => {
  it('returns undefined for empty string (optional field)', () => {
    expect(validateFSSAI('')).toBeUndefined();
  });
  it('returns undefined for valid 14-digit FSSAI', () => {
    expect(validateFSSAI('12345678901234')).toBeUndefined();
  });
  it('returns format error for wrong length', () => {
    expect(validateFSSAI('1234567890123')).toBe(VALIDATION_MESSAGES.fssai);
  });
});

describe('validatePincode', () => {
  it('returns undefined for valid pincode', () => {
    expect(validatePincode('400001')).toBeUndefined();
  });
  it('returns required error for empty string', () => {
    expect(validatePincode('')).toBe('Pincode is required');
  });
  it('returns format error for invalid pincode', () => {
    expect(validatePincode('011001')).toBe(VALIDATION_MESSAGES.pincode);
  });
});
