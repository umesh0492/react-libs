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
  language?: string; // "en" | "hi" | etc.
  labelMap?: Record<string, string>;
  formatCurrency?: boolean;
  formatPercent?: boolean;
  formatter?: (value: number | string, name: string) => string;
}

const HINDI_CHART_LABELS: Record<string, string> = {
  Jan: "जन", Feb: "फ़र", Mar: "मार्च", Apr: "अप्र", May: "मई", Jun: "जून",
  Jul: "जुल", Aug: "अग", Sep: "सित", Oct: "अक्त", Nov: "नव", Dec: "दिस",
  amount: "राशि", Amount: "राशि",
  value: "मूल्य", Value: "मूल्य",
  month: "महीना", Month: "महीना",
  target: "लक्ष्य", Target: "लक्ष्य",
  savings: "बचत", Savings: "बचत",
  "Actual DPO": "वास्तविक डीपीओ",
  "Target DPO": "लक्ष्य डीपीओ",
  dpo: "डीपीओ", DPO: "डीपीओ",
  gmv: "कुल मूल्य", GMV: "कुल मूल्य",
  "Target Price": "लक्ष्य मूल्य",
  "Awarded Price": "पुरस्कृत मूल्य",
  "Rejection Rate": "अस्वीकृति दर",
  "Quality Score": "गुणवत्ता स्कोर",
  "On-Time Delivery": "समय पर डिलीवरी",
  "Fill Rate": "पूर्ति दर",
  "Share of Spend": "खर्च का हिस्सा",
};

function getSafeLookup(map: Record<string, string> | undefined, key: string): string | undefined {
  if (!map) return undefined;
  const entries = Object.entries(map);
  const found = entries.find(([k]) => k === key);
  return found ? found[1] : undefined;
}

export function BilingualTooltip({
  active,
  payload,
  label,
  language = "en",
  labelMap,
  formatCurrency = false,
  formatPercent = false,
  formatter,
}: BilingualTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const translate = (key: string): string => {
    const custom = getSafeLookup(labelMap, key);
    if (custom) return custom;
    if (language === "hi") {
      const hindi = getSafeLookup(HINDI_CHART_LABELS, key);
      return hindi ?? key;
    }
    return key;
  };

  const translateLabel = (lbl?: string): string => {
    if (!lbl) return "";
    const custom = getSafeLookup(labelMap, lbl);
    if (custom) return custom;
    if (language === "hi") {
      const hindi = getSafeLookup(HINDI_CHART_LABELS, lbl);
      return hindi ?? lbl;
    }
    return lbl;
  };

  const formatVal = (val: number | string, name: string): string => {
    if (formatter) return formatter(val, name);
    if (formatCurrency && typeof val === "number") {
      if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(2)} Cr`;
      if (val >= 1_00_000) return `₹${(val / 1_00_000).toFixed(2)} L`;
      return `₹${formatNumber(val)}`;
    }
    if (formatPercent && typeof val === "number") return `${val.toFixed(1)}%`;
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
