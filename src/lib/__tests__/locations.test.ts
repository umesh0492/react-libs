import { describe, it, expect } from 'vitest';
import {
  filterCitiesByState,
  toStateOptions,
  toCityOptions,
  type RegionState,
  type RegionCity,
} from '../locations';

describe('Generic locations utilities', () => {
  const sampleStates: RegionState[] = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
  ];

  const sampleCities: RegionCity[] = [
    { name: 'San Francisco', stateCode: 'CA' },
    { name: 'Los Angeles', stateCode: 'CA' },
    { name: 'Buffalo', stateCode: 'NY' },
    { name: 'Albany', stateCode: 'NY' },
    { name: 'Austin', stateCode: 'TX' },
  ];

  describe('filterCitiesByState', () => {
    it('returns empty array when stateCode is empty', () => {
      expect(filterCitiesByState(sampleCities, '')).toEqual([]);
    });

    it('filters and sorts cities alphabetically for a state', () => {
      const filtered = filterCitiesByState(sampleCities, 'CA');
      expect(filtered).toHaveLength(2);
      expect(filtered[0]?.name).toBe('Los Angeles');
      expect(filtered[1]?.name).toBe('San Francisco');
    });

    it('returns empty array when no cities match stateCode', () => {
      expect(filterCitiesByState(sampleCities, 'WA')).toEqual([]);
    });
  });

  describe('toStateOptions', () => {
    it('maps states to select options with default placeholder', () => {
      const options = toStateOptions(sampleStates);
      expect(options).toHaveLength(4);
      expect(options[0]).toEqual({ value: '', label: 'Select State' });
      expect(options[1]).toEqual({ value: 'CA', label: 'California' });
    });

    it('uses custom placeholder when provided', () => {
      const options = toStateOptions(sampleStates, 'Choose a Region');
      expect(options[0]).toEqual({ value: '', label: 'Choose a Region' });
    });
  });

  describe('toCityOptions', () => {
    it('maps cities to select options with default placeholder', () => {
      const options = toCityOptions(sampleCities);
      expect(options).toHaveLength(6);
      expect(options[0]).toEqual({ value: '', label: 'Select City' });
      expect(options[1]).toEqual({ value: 'San Francisco', label: 'San Francisco' });
    });

    it('uses custom placeholder when provided', () => {
      const options = toCityOptions(sampleCities, 'Choose Locality');
      expect(options[0]).toEqual({ value: '', label: 'Choose Locality' });
    });
  });
});
