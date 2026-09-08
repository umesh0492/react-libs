/**
 * @file constants.ts — India regional presets, scheduled languages, and financial helpers.
 */

export interface IndianLanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

/**
 * Standard Indian scheduled languages supported in multi-lingual enterprise UIs.
 */
export const INDIAN_LANGUAGES: IndianLanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
];

/**
 * Common Indian currency formatting units.
 */
export function formatLakhs(value: number, currencySymbol: string = "₹"): string {
  const inLakhs = value / 100000;
  return `${currencySymbol}${inLakhs.toLocaleString("en-IN", { maximumFractionDigits: 2 })}L`;
}

export function formatCrores(value: number, currencySymbol: string = "₹"): string {
  const inCrores = value / 10000000;
  return `${currencySymbol}${inCrores.toLocaleString("en-IN", { maximumFractionDigits: 2 })}Cr`;
}
