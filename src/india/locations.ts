/**
 * @file locations.ts — India states, union territories, commercial cities, and selector helpers.
 *
 * Preserves battle-tested regional datasets for Indian enterprise applications.
 */

export interface RegionState {
  code: string;
  name: string;
}

export interface RegionCity {
  name: string;
  stateCode: string;
}

export interface RegionOption {
  value: string;
  label: string;
}

export type IndiaState = RegionState;
export type IndiaCity = RegionCity;

/**
 * Reference dataset of Indian states and Union Territories (ISO 3166-2:IN).
 */
export const INDIA_STATES: IndiaState[] = [
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CG", name: "Chhattisgarh" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TS", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
  // Union Territories
  { code: "AN", name: "Andaman & Nicobar Islands" },
  { code: "CH", name: "Chandigarh" },
  { code: "DN", name: "Dadra & Nagar Haveli and Daman & Diu" },
  { code: "DL", name: "Delhi" },
  { code: "JK", name: "Jammu & Kashmir" },
  { code: "LA", name: "Ladakh" },
  { code: "LD", name: "Lakshadweep" },
  { code: "PY", name: "Puducherry" },
];

/**
 * Reference dataset of major commercial and industrial cities in India.
 */
export const INDIA_CITIES: IndiaCity[] = [
  // Maharashtra
  { name: "Mumbai", stateCode: "MH" },
  { name: "Pune", stateCode: "MH" },
  { name: "Nagpur", stateCode: "MH" },
  { name: "Nashik", stateCode: "MH" },
  { name: "Aurangabad", stateCode: "MH" },
  { name: "Solapur", stateCode: "MH" },
  { name: "Kolhapur", stateCode: "MH" },
  { name: "Thane", stateCode: "MH" },
  // Karnataka
  { name: "Bengaluru", stateCode: "KA" },
  { name: "Mysuru", stateCode: "KA" },
  { name: "Hubballi", stateCode: "KA" },
  { name: "Mangaluru", stateCode: "KA" },
  { name: "Belagavi", stateCode: "KA" },
  // Gujarat
  { name: "Ahmedabad", stateCode: "GJ" },
  { name: "Surat", stateCode: "GJ" },
  { name: "Vadodara", stateCode: "GJ" },
  { name: "Rajkot", stateCode: "GJ" },
  { name: "Bhavnagar", stateCode: "GJ" },
  { name: "Jamnagar", stateCode: "GJ" },
  // Tamil Nadu
  { name: "Chennai", stateCode: "TN" },
  { name: "Coimbatore", stateCode: "TN" },
  { name: "Madurai", stateCode: "TN" },
  { name: "Tiruchirappalli", stateCode: "TN" },
  { name: "Salem", stateCode: "TN" },
  { name: "Erode", stateCode: "TN" },
  // Telangana
  { name: "Hyderabad", stateCode: "TS" },
  { name: "Warangal", stateCode: "TS" },
  { name: "Karimnagar", stateCode: "TS" },
  // Andhra Pradesh
  { name: "Visakhapatnam", stateCode: "AP" },
  { name: "Vijayawada", stateCode: "AP" },
  { name: "Guntur", stateCode: "AP" },
  { name: "Nellore", stateCode: "AP" },
  // Uttar Pradesh
  { name: "Lucknow", stateCode: "UP" },
  { name: "Kanpur", stateCode: "UP" },
  { name: "Agra", stateCode: "UP" },
  { name: "Varanasi", stateCode: "UP" },
  { name: "Meerut", stateCode: "UP" },
  { name: "Allahabad", stateCode: "UP" },
  { name: "Gorakhpur", stateCode: "UP" },
  { name: "Noida", stateCode: "UP" },
  { name: "Greater Noida", stateCode: "UP" },
  { name: "Ghaziabad", stateCode: "UP" },
  // Rajasthan
  { name: "Jaipur", stateCode: "RJ" },
  { name: "Jodhpur", stateCode: "RJ" },
  { name: "Udaipur", stateCode: "RJ" },
  { name: "Kota", stateCode: "RJ" },
  { name: "Bikaner", stateCode: "RJ" },
  // Punjab
  { name: "Ludhiana", stateCode: "PB" },
  { name: "Amritsar", stateCode: "PB" },
  { name: "Jalandhar", stateCode: "PB" },
  { name: "Patiala", stateCode: "PB" },
  // Haryana
  { name: "Gurugram", stateCode: "HR" },
  { name: "Faridabad", stateCode: "HR" },
  { name: "Panipat", stateCode: "HR" },
  { name: "Ambala", stateCode: "HR" },
  // Delhi
  { name: "New Delhi", stateCode: "DL" },
  { name: "Delhi", stateCode: "DL" },
  // Bihar
  { name: "Patna", stateCode: "BR" },
  { name: "Gaya", stateCode: "BR" },
  { name: "Muzaffarpur", stateCode: "BR" },
  // West Bengal
  { name: "Kolkata", stateCode: "WB" },
  { name: "Howrah", stateCode: "WB" },
  { name: "Siliguri", stateCode: "WB" },
  { name: "Durgapur", stateCode: "WB" },
  // Kerala
  { name: "Thiruvananthapuram", stateCode: "KL" },
  { name: "Kochi", stateCode: "KL" },
  { name: "Kozhikode", stateCode: "KL" },
  { name: "Thrissur", stateCode: "KL" },
  // Madhya Pradesh
  { name: "Bhopal", stateCode: "MP" },
  { name: "Indore", stateCode: "MP" },
  { name: "Jabalpur", stateCode: "MP" },
  { name: "Gwalior", stateCode: "MP" },
  // Odisha
  { name: "Bhubaneswar", stateCode: "OD" },
  { name: "Cuttack", stateCode: "OD" },
  // Assam
  { name: "Guwahati", stateCode: "AS" },
  // Jharkhand
  { name: "Ranchi", stateCode: "JH" },
  { name: "Jamshedpur", stateCode: "JH" },
  // Himachal Pradesh
  { name: "Shimla", stateCode: "HP" },
  { name: "Manali", stateCode: "HP" },
  // Chhattisgarh
  { name: "Raipur", stateCode: "CG" },
  // Goa
  { name: "Panaji", stateCode: "GA" },
  { name: "Margao", stateCode: "GA" },
  // Uttarakhand
  { name: "Dehradun", stateCode: "UK" },
  { name: "Haridwar", stateCode: "UK" },
  // Jammu & Kashmir
  { name: "Srinagar", stateCode: "JK" },
  { name: "Jammu", stateCode: "JK" },
  // Chandigarh
  { name: "Chandigarh", stateCode: "CH" },
  // Puducherry
  { name: "Puducherry", stateCode: "PY" },
];

const METRO_CITIES = new Set([
  "Delhi",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
]);

/**
 * Filters cities by parent state/UT code, sorted alphabetically.
 */
export function getCitiesForState(stateCode: string): IndiaCity[] {
  if (!stateCode) return [];
  return INDIA_CITIES
    .filter((c) => c.stateCode === stateCode)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns FilterSelect-compatible option objects for all Indian states.
 */
export function getStateOptions(placeholder = "Select State"): RegionOption[] {
  return [
    { value: "", label: placeholder },
    ...INDIA_STATES.map((s) => ({ value: s.code, label: s.name })),
  ];
}

/**
 * Returns FilterSelect-compatible option objects for cities in a given state.
 */
export function getCityOptions(stateCode: string, placeholder = "Select City"): RegionOption[] {
  return [
    { value: "", label: placeholder },
    ...getCitiesForState(stateCode).map((c) => ({ value: c.name, label: c.name })),
  ];
}

/**
 * Checks if a city is designated as a major Indian metro city.
 */
export function isMetroCity(cityName: string): boolean {
  return METRO_CITIES.has(cityName.trim());
}
