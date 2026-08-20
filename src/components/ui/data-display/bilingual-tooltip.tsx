import * as React from "react";
import { formatNumber } from "../../../lib/formatters";

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
    if (labelMap?.[key]) return labelMap[key];
    if (language === "hi") return HINDI_CHART_LABELS[key] ?? key;
    return key;
  };

  const translateLabel = (lbl?: string): string => {
    if (!lbl) return "";
    if (labelMap?.[lbl]) return labelMap[lbl];
    if (language === "hi") return HINDI_CHART_LABELS[lbl] ?? lbl;
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
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow: "0 4px 12px -2px rgba(0,0,0,0.12)",
        minWidth: 140,
      }}
    >
      {label !== undefined && (
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#64748b",
            marginBottom: 6,
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: 4,
          }}
        >
          {translateLabel(label)}
        </p>
      )}
      {payload.map((entry, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: entry.color ?? entry.fill ?? "#94a3b8",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>
            {translate(entry.name)}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
            {formatVal(entry.value, entry.name)}
          </span>
        </div>
      ))}
    </div>
  );
}
