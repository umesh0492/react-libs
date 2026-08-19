import { describe, it, expect } from 'vitest';
import {
  INDIA_STATES,
  INDIA_CITIES,
  getCitiesForState,
  getStateOptions,
  getCityOptions,
} from '../indiaLocations';

describe('INDIA_STATES', () => {
  it('contains at least 28 states/UTs', () => {
    expect(INDIA_STATES.length).toBeGreaterThanOrEqual(28);
  });

  it('each entry has code and name as non-empty strings', () => {
    for (const s of INDIA_STATES) {
      expect(typeof s.code).toBe('string');
      expect(s.code.length).toBeGreaterThan(0);
      expect(typeof s.name).toBe('string');
      expect(s.name.length).toBeGreaterThan(0);
    }
  });

  it('includes Maharashtra (MH)', () => {
    expect(INDIA_STATES.some((s) => s.code === 'MH')).toBe(true);
  });

  it('includes Delhi (DL)', () => {
    expect(INDIA_STATES.some((s) => s.code === 'DL')).toBe(true);
  });

  it('has unique state codes', () => {
    const codes = INDIA_STATES.map((s) => s.code);
    const unique = new Set(codes);
    expect(unique.size).toBe(codes.length);
  });
});

describe('INDIA_CITIES', () => {
  it('contains at least 10 cities', () => {
    expect(INDIA_CITIES.length).toBeGreaterThanOrEqual(10);
  });

  it('each city has name and stateCode as non-empty strings', () => {
    for (const c of INDIA_CITIES) {
      expect(typeof c.name).toBe('string');
      expect(c.name.length).toBeGreaterThan(0);
      expect(typeof c.stateCode).toBe('string');
      expect(c.stateCode.length).toBeGreaterThan(0);
    }
  });

  it('includes Mumbai in MH', () => {
    expect(INDIA_CITIES.some((c) => c.name === 'Mumbai' && c.stateCode === 'MH')).toBe(true);
  });

  it('includes Bengaluru in KA', () => {
    expect(INDIA_CITIES.some((c) => c.name === 'Bengaluru' && c.stateCode === 'KA')).toBe(true);
  });
});

describe('getCitiesForState', () => {
  it('returns cities for Maharashtra', () => {
    const cities = getCitiesForState('MH');
    expect(cities.length).toBeGreaterThan(0);
    expect(cities.every((c) => c.stateCode === 'MH')).toBe(true);
  });

  it('returns cities sorted alphabetically', () => {
    const cities = getCitiesForState('KA');
    const names = cities.map((c) => c.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it('returns empty array for unknown state code', () => {
    expect(getCitiesForState('XX')).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(getCitiesForState('')).toEqual([]);
  });

  it('returns cities for Delhi (DL)', () => {
    const cities = getCitiesForState('DL');
    expect(cities.length).toBeGreaterThan(0);
  });
});

describe('getStateOptions', () => {
  it('returns an array with first entry as "Select State" placeholder', () => {
    const opts = getStateOptions();
    expect(opts[0]).toEqual({ value: '', label: 'Select State' });
  });

  it('includes all states after placeholder', () => {
    const opts = getStateOptions();
    // Should be states count + 1 for the placeholder
    expect(opts.length).toBe(INDIA_STATES.length + 1);
  });

  it('each option has value and label strings', () => {
    const opts = getStateOptions();
    for (const o of opts) {
      expect(typeof o.value).toBe('string');
      expect(typeof o.label).toBe('string');
    }
  });

  it('maps state code to value and state name to label', () => {
    const opts = getStateOptions();
    const mh = opts.find((o) => o.value === 'MH');
    expect(mh?.label).toBe('Maharashtra');
  });
});

describe('getCityOptions', () => {
  it('returns first entry as "Select City" placeholder', () => {
    const opts = getCityOptions('MH');
    expect(opts[0]).toEqual({ value: '', label: 'Select City' });
  });

  it('includes city names for Maharashtra after placeholder', () => {
    const opts = getCityOptions('MH');
    expect(opts.length).toBeGreaterThan(1);
    expect(opts.slice(1).every((o) => typeof o.value === 'string')).toBe(true);
  });

  it('returns only placeholder for unknown state', () => {
    const opts = getCityOptions('XX');
    expect(opts).toEqual([{ value: '', label: 'Select City' }]);
  });

  it('maps city name to both value and label', () => {
    const opts = getCityOptions('MH');
    const mumbai = opts.find((o) => o.value === 'Mumbai');
    expect(mumbai?.label).toBe('Mumbai');
  });
});
