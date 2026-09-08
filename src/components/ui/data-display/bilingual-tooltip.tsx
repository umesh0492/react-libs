"use client";

import * as React from "react";
import { formatNumber } from "../../../lib/formatters";
import { cn } from "../../../lib/utils";

export interface BilingualTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color?: string;
    fill?: string;
  }>;
  label?: string;
  /** Active language code (e.g., "en", "es", "hi", "fr"). Defaults to "en". */
  language?: string;
  /** Configurable locale for numeric/currency formatting. Defaults to "en-US". */
  locale?: string;
  /** Direct key-to-label mapping for the current view/language. */
  labelMap?: Record<string, string>;
  /** Direct translations mapping for the current active language. */
  translations?: Record<string, string>;
  /**
   * Multi-language dictionary mapping language codes to key-value translation records.
   * Example: `{ es: { Month: "Mes", Amount: "Cantidad" } }`
   */
  dictionary?: Record<string, Record<string, string>>;
  /** Whether to format numeric values with the currency symbol and locale formatting. */
  formatCurrency?: boolean;
  /** Currency symbol to prefix when formatCurrency is enabled. Defaults to "$". */
  currencySymbol?: string;
  /** Whether to format numeric values as a percentage with one decimal place. */
  formatPercent?: boolean;
  /** Optional custom value formatter function. */
  formatter?: (value: number | string, name: string) => string;
}

function getSafeLookup(map: Record<string, string> | undefined, key: string): string | undefined {
  if (!map) return undefined;
  // eslint-disable-next-line security/detect-object-injection
  if (key in map) return map[key];
  const entries = Object.entries(map);
  const found = entries.find(([k]) => k.toLowerCase() === key.toLowerCase());
  return found ? found[1] : undefined;
}

export function BilingualTooltip({
  active,
  payload,
  label,
  language = "en",
  locale = "en-US",
  labelMap,
  translations,
  dictionary,
  formatCurrency = false,
  currencySymbol = "$",
  formatPercent = false,
  formatter,
}: BilingualTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const translate = (key: string): string => {
    // 1. Priority: Direct labelMap or translations map
    const custom = getSafeLookup(labelMap, key) ?? getSafeLookup(translations, key);
    if (custom) return custom;

    // 2. Multi-language dictionary lookup
    // eslint-disable-next-line security/detect-object-injection
    if (dictionary && language && dictionary[language]) {
      // eslint-disable-next-line security/detect-object-injection
      const dictTranslation = getSafeLookup(dictionary[language], key);
      if (dictTranslation) return dictTranslation;
    }

    // 3. Neutral fallback: Return key unchanged
    return key;
  };

  const translateLabel = (lbl?: string): string => {
    if (!lbl) return "";
    return translate(lbl);
  };

  const formatVal = (val: number | string, name: string): string => {
    if (formatter) return formatter(val, name);

    if (formatCurrency && typeof val === "number") {
      return `${currencySymbol}${val.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }

    if (formatPercent && typeof val === "number") {
      return `${val.toFixed(1)}%`;
    }

    if (typeof val === "number") {
      return formatNumber(val, undefined, locale);
    }

    return String(val);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-2.5 shadow-md min-w-[140px] text-xs">
      {label !== undefined && (
        <p className="font-semibold text-muted-foreground mb-1.5 border-b border-border pb-1 text-xs">
          {translateLabel(label)}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5 mt-1">
          <span
            className={cn("w-2.5 h-2.5 rounded-full shrink-0", !entry.color && !entry.fill && "bg-muted-foreground")}
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          <span className="text-muted-foreground flex-1 text-xs">
            {translate(entry.name)}
          </span>
          <span className="font-bold text-foreground text-xs">
            {formatVal(entry.value, entry.name)}
          </span>
        </div>
      ))}
    </div>
  );
}
