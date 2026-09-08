"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";

export interface MetricRangeBreakdownItem {
  label: string;
  value: number | string;
  colorClass?: string;
}

export interface SalaryRangeDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Minimum range value. */
  min?: number;
  /** Maximum range value. */
  max?: number;
  /** Backwards compatibility alias for min (in Lakhs). */
  minLakhs?: number;
  /** Backwards compatibility alias for max (in Lakhs). */
  maxLakhs?: number;
  /** Currency symbol prefix (e.g., "$", "₹", "€", "£"). Defaults to "$". */
  currencySymbol?: string;
  /** Unit suffix for range values (e.g., "k", "M", "L"). */
  unit?: string;
  /** Frequency/period suffix (e.g., "yr", "mo", "PA", "PM"). Defaults to "yr". */
  period?: string;
  /** Card header label. Defaults to "Compensation Range". */
  label?: string;
  /** Breakdown components (fixed, variable, equity, or custom items). */
  breakdown?: {
    fixedLakhs?: number;
    variableLakhs?: number;
    esopsLakhs?: number;
    items?: MetricRangeBreakdownItem[];
  };
  /** Generic list of breakdown items. */
  items?: MetricRangeBreakdownItem[];
  /** Visual variant: inline compact badge or detailed card container. Defaults to "badge". */
  variant?: "badge" | "card";
}

function formatRangeString(
  min?: number,
  max?: number,
  currency = "$",
  unit = ""
): string {
  if (min !== undefined && max !== undefined) {
    return `${currency}${min}${unit} - ${currency}${max}${unit}`;
  }
  if (min !== undefined) {
    return `${currency}${min}${unit}+`;
  }
  if (max !== undefined) {
    return `Up to ${currency}${max}${unit}`;
  }
  return "Competitive";
}

function resolveBreakdownItems(
  items?: MetricRangeBreakdownItem[],
  breakdown?: SalaryRangeDisplayProps["breakdown"],
  currencySymbol = "$",
  effectiveUnit = ""
): MetricRangeBreakdownItem[] {
  if (items && items.length > 0) return items;
  if (breakdown?.items && breakdown.items.length > 0) return breakdown.items;
  if (!breakdown) return [];

  const list: MetricRangeBreakdownItem[] = [];
  if (breakdown.fixedLakhs !== undefined) {
    list.push({
      label: "Fixed",
      value: `${currencySymbol}${breakdown.fixedLakhs}${effectiveUnit}`,
      colorClass: "text-slate-800 dark:text-slate-200",
    });
  }
  if (breakdown.variableLakhs !== undefined) {
    list.push({
      label: "Variable",
      value: `${currencySymbol}${breakdown.variableLakhs}${effectiveUnit}`,
      colorClass: "text-indigo-600 dark:text-indigo-400",
    });
  }
  if (breakdown.esopsLakhs !== undefined) {
    list.push({
      label: "Equity",
      value: `${currencySymbol}${breakdown.esopsLakhs}${effectiveUnit}`,
      colorClass: "text-purple-600 dark:text-purple-400",
    });
  }
  return list;
}

export function SalaryRangeDisplay({
  min,
  max,
  minLakhs,
  maxLakhs,
  currencySymbol = "$",
  unit,
  period = "yr",
  label = "Compensation Range",
  breakdown,
  items,
  variant = "badge",
  className,
  ...props
}: SalaryRangeDisplayProps) {
  // Resolve effective min, max, and unit (handling legacy lakhs props seamlessly)
  const isLegacyLakhs = minLakhs !== undefined || maxLakhs !== undefined;
  const effectiveMin = min ?? minLakhs;
  const effectiveMax = max ?? maxLakhs;
  const effectiveUnit = unit ?? (isLegacyLakhs ? "L" : "");

  const formattedRange = formatRangeString(effectiveMin, effectiveMax, currencySymbol, effectiveUnit);

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
          className
        )}
        {...props}
      >
        <span>{formattedRange}</span>
        {period ? <span className="text-[10px] font-medium opacity-75">{period}</span> : null}
      </span>
    );
  }

  const resolvedItems = resolveBreakdownItems(items, breakdown, currencySymbol, effectiveUnit);

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
          {formattedRange} {period}
        </span>
      </div>

      {resolvedItems.length > 0 ? (
        <div
          className={cn(
            "grid gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center",
            resolvedItems.length === 2 ? "grid-cols-2" : "grid-cols-3"
          )}
        >
          {resolvedItems.map((item, idx) => (
            <div key={idx}>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                {item.label}
              </span>
              <span className={cn("text-xs font-bold", item.colorClass ?? "text-slate-800 dark:text-slate-200")}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Generic alias for SalaryRangeDisplay to display any metric or compensation range. */
export type MetricRangeDisplayProps = SalaryRangeDisplayProps;
export const MetricRangeDisplay = SalaryRangeDisplay;
