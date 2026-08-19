import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatWeight,
  formatQuantity,
  formatFileSize,
  formatPercent,
  formatLocalizedDate,
  formatLocalizedDateTime,
  formatLocalizedNumber,
} from '../formatters';

describe('formatCurrency', () => {
  it('formats a number as INR', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1,234.56');
  });

  it('returns em dash for null', () => {
    expect(formatCurrency(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatCurrency(undefined)).toBe('—');
  });

  it('returns em dash for NaN string', () => {
    expect(formatCurrency('abc')).toBe('—');
  });

  it('formats a string number', () => {
    const result = formatCurrency('999.99');
    expect(result).toContain('999.99');
  });

  it('handles zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0.00');
  });
});

describe('formatNumber', () => {
  it('formats a number with locale grouping', () => {
    const result = formatNumber(1234567);
    expect(result).toBeTruthy();
  });

  it('returns em dash for null', () => {
    expect(formatNumber(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatNumber(undefined)).toBe('—');
  });

  it('parses string numbers', () => {
    const result = formatNumber('5000');
    expect(result).toBeTruthy();
  });

  it('accepts custom format options', () => {
    const result = formatNumber(0.856, { style: 'percent' });
    expect(result).toBeTruthy();
  });
});

describe('formatDate', () => {
  it('formats a valid date string', () => {
    const result = formatDate('2026-01-15');
    expect(result).toContain('2026');
  });

  it('formats a Date object', () => {
    const result = formatDate(new Date('2026-03-27'));
    expect(result).toContain('2026');
  });

  it('returns em dash for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns em dash for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });
});

describe('formatDateTime', () => {
  it('formats a valid date-time', () => {
    const result = formatDateTime('2026-03-27T14:30:00');
    expect(result).toContain('2026');
  });

  it('returns em dash for null', () => {
    expect(formatDateTime(null)).toBe('—');
  });

  it('returns em dash for invalid date', () => {
    expect(formatDateTime('garbage')).toBe('—');
  });
});

describe('formatRelativeTime', () => {
  it('returns "just now" for a date very close to now', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe('just now');
  });

  it('returns em dash for null', () => {
    expect(formatRelativeTime(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatRelativeTime(undefined)).toBe('—');
  });

  it('returns em dash for invalid date string', () => {
    expect(formatRelativeTime('not-a-date')).toBe('—');
  });

  it('returns "X min ago" for a date 5 minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = formatRelativeTime(fiveMinAgo);
    expect(result).toContain('m ago');
  });

  it('returns "Xh ago" for a date 3 hours ago', () => {
    const threeHrsAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const result = formatRelativeTime(threeHrsAgo);
    expect(result).toContain('h ago');
  });

  it('returns "Xd ago" for a date 3 days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(threeDaysAgo);
    expect(result).toContain('d ago');
  });

  it('falls back to formatDate for a date > 7 days ago', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(tenDaysAgo);
    expect(result).toContain('20');
  });

  it('returns "in Xm" for a future date in 5 minutes', () => {
    const fiveMinFuture = new Date(Date.now() + 5 * 60 * 1000);
    const result = formatRelativeTime(fiveMinFuture);
    expect(result).toContain('in');
  });
});

describe('formatWeight', () => {
  it('formats a number with kg unit', () => {
    expect(formatWeight(12.5)).toContain('12.5 kg');
  });

  it('formats grams', () => {
    expect(formatWeight(1200, 'g')).toContain('g');
  });

  it('returns em dash for null', () => {
    expect(formatWeight(null)).toBe('—');
  });

  it('parses string input', () => {
    expect(formatWeight('50.5')).toContain('kg');
  });
});

describe('formatQuantity', () => {
  it('formats with unit', () => {
    const result = formatQuantity(150, 'boxes');
    expect(result).toContain('boxes');
  });

  it('formats without unit', () => {
    const result = formatQuantity(150);
    expect(result).toBeTruthy();
    expect(result).not.toContain('undefined');
  });

  it('returns em dash for null', () => {
    expect(formatQuantity(null)).toBe('—');
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1234567)).toBe('1.2 MB');
  });

  it('handles zero', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('returns em dash for null', () => {
    expect(formatFileSize(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatFileSize(undefined)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('formats a ratio', () => {
    expect(formatPercent(0.856)).toBe('85.6%');
  });

  it('formats a direct percentage', () => {
    expect(formatPercent(85.6, false)).toBe('85.6%');
  });

  it('returns em dash for null', () => {
    expect(formatPercent(null)).toBe('—');
  });

  it('accepts custom decimals', () => {
    expect(formatPercent(0.5, true, 0)).toBe('50%');
  });

  it('handles 0%', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('handles 100%', () => {
    expect(formatPercent(1)).toBe('100.0%');
  });
});

describe('formatLocalizedDate', () => {
  it('formats in English locale by default', () => {
    const result = formatLocalizedDate('2026-03-27');
    expect(result).toContain('2026');
  });

  it('formats in Hindi locale', () => {
    const result = formatLocalizedDate('2026-03-27', 'hi');
    expect(result).toBeTruthy();
  });

  it('returns empty string for null', () => {
    expect(formatLocalizedDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatLocalizedDate(undefined)).toBe('');
  });

  it('handles invalid date string', () => {
    const result = formatLocalizedDate('not-a-date');
    expect(result).toBe('not-a-date');
  });
});

describe('formatLocalizedDateTime', () => {
  it('formats date-time in English', () => {
    const result = formatLocalizedDateTime('2026-03-27T14:30:00');
    expect(result).toContain('2026');
  });

  it('formats in Hindi locale', () => {
    const result = formatLocalizedDateTime('2026-03-27T14:30:00', 'hi');
    expect(result).toBeTruthy();
  });

  it('returns empty string for null', () => {
    expect(formatLocalizedDateTime(null)).toBe('');
  });

  it('handles invalid date string fallback', () => {
    const result = formatLocalizedDateTime('invalid-time');
    expect(result).toBe('invalid-time');
  });

  it('handles objects without toString methods safely', () => {
    const mockDate = Object.create(null); // No toString
    expect(formatLocalizedDateTime(mockDate as any)).toBe('');
    expect(formatLocalizedDate(mockDate as any)).toBe('');
  });
});

describe('formatLocalizedNumber', () => {
  it('formats in English locale', () => {
    const result = formatLocalizedNumber(1234.5);
    expect(result).toBeTruthy();
  });

  it('formats in Hindi locale', () => {
    const result = formatLocalizedNumber(1234.5, 'hi');
    expect(result).toBeTruthy();
  });

  it('returns empty string for null', () => {
    expect(formatLocalizedNumber(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatLocalizedNumber(undefined)).toBe('');
  });

  it('handles zero', () => {
    expect(formatLocalizedNumber(0)).toBe('0');
  });
});
