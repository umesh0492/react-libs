/**
 * @file locations.ts
 * Generic geographical region, state, and city helper utilities.
 * 
 * Provides type contracts and helper utilities for building cascade state/province
 * and city/locality select controls across any country or custom geography.
 */

/**
 * Generic administrative region/state/province definition.
 */
export interface RegionState {
  /** Standard region code (e.g. ISO 3166-2 division code). */
  code: string;
  /** Human-readable region name. */
  name: string;
}

/**
 * Generic city or locality subdivision definition.
 */
export interface RegionCity {
  /** Locality or city name. */
  name: string;
  /** Parent state/division code. */
  stateCode: string;
}

/**
 * Option format compatible with Select, AsyncSelect, and FilterSelect components.
 */
export interface RegionOption {
  value: string;
  label: string;
}

/**
 * Generic utility to filter localities/cities by parent division code, sorted alphabetically.
 */
export function filterCitiesByState<T extends RegionCity>(cities: T[], stateCode: string): T[] {
  if (!stateCode) return [];
  return cities
    .filter((c) => c.stateCode === stateCode)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Generic utility to convert region/state arrays into Select-compatible options.
 */
export function toStateOptions<T extends RegionState>(
  states: T[],
  placeholder = "Select State"
): RegionOption[] {
  return [
    { value: "", label: placeholder },
    ...states.map((s) => ({ value: s.code, label: s.name })),
  ];
}

/**
 * Generic utility to convert locality/city arrays into Select-compatible options.
 */
export function toCityOptions<T extends RegionCity>(
  cities: T[],
  placeholder = "Select City"
): RegionOption[] {
  return [
    { value: "", label: placeholder },
    ...cities.map((c) => ({ value: c.name, label: c.name })),
  ];
}
