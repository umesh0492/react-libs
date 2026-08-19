import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn — className utility', () => {
  it('returns a single class unchanged', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('merges multiple classes', () => {
    expect(cn('px-4', 'py-2', 'text-sm')).toBe('px-4 py-2 text-sm');
  });

  it('handles undefined and null gracefully', () => {
    expect(cn('base', undefined, null as any)).toBe('base');
  });

  it('handles empty string inputs', () => {
    expect(cn('', 'valid')).toBe('valid');
  });

  it('resolves tailwind conflicts — later class wins', () => {
    const result = cn('px-4', 'px-6');
    expect(result).toBe('px-6');
  });

  it('resolves text color conflict', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('handles conditional class objects', () => {
    const isActive = true;
    const result = cn('base', { 'bg-primary': isActive, 'bg-muted': !isActive });
    expect(result).toContain('bg-primary');
    expect(result).not.toContain('bg-muted');
  });

  it('handles false conditional classes', () => {
    const result = cn('base', { 'hidden': false });
    expect(result).toBe('base');
    expect(result).not.toContain('hidden');
  });

  it('handles arrays of classes', () => {
    const result = cn(['flex', 'items-center'], 'gap-4');
    expect(result).toBe('flex items-center gap-4');
  });

  it('deduplicates identical classes', () => {
    const result = cn('flex', 'flex');
    expect(result).toBe('flex');
  });

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('handles complex real-world merge scenario', () => {
    const base = 'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium';
    const override = 'px-6 py-4';
    const result = cn(base, override);
    expect(result).toContain('px-6');
    expect(result).toContain('py-4');
    expect(result).not.toContain('px-3');
    expect(result).not.toContain('py-2');
  });
});
