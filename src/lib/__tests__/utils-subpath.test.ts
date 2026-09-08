import { describe, it, expect } from 'vitest';
import * as utils from '../../utils';

describe('@umesh0492/react-libs/utils subpath', () => {
  it('exports pure utility functions and constants', () => {
    expect(typeof utils.cn).toBe('function');
    expect(typeof utils.formatCurrency).toBe('function');
    expect(typeof utils.formatNumber).toBe('function');
    expect(typeof utils.validateTaxId).toBe('function');
    expect(typeof utils.validatePostalCode).toBe('function');
    expect(typeof utils.maskSensitiveValue).toBe('function');
  });

  it('does NOT export DOM/browser-dependent export-utils functions', () => {
    // Purity check: exportData and downloadFileSecurely rely on Blob, document, window
    // and must only be exported from root index.ts, not /utils.
    expect((utils as Record<string, unknown>).exportData).toBeUndefined();
    expect((utils as Record<string, unknown>).downloadFileSecurely).toBeUndefined();
    expect((utils as Record<string, unknown>).downloadFromBackend).toBeUndefined();
    expect((utils as Record<string, unknown>).exportToCSV).toBeUndefined();
  });

  it('evaluates cleanly in pure environments without DOM APIs', () => {
    // cn works
    expect(utils.cn('px-2', 'py-1')).toBe('px-2 py-1');
    // formatters work (generic USD / en-US default)
    expect(utils.formatCurrency(150000)).toContain('150,000');
    // validators work
    expect(utils.validateTaxId('US123456789')).toBeUndefined();
    expect(utils.validateTaxId('')).toBe('Tax ID is required');
    // masking works
    expect(utils.maskSensitiveValue('SecretValue', { isMasked: true })).toBe('••••••');
  });
});

