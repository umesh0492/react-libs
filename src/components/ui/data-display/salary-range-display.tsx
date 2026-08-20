import * as React from "react";
import { IndianRupee, TrendingUp } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface SalaryRangeDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  minLakhs?: number;
  maxLakhs?: number;
  currencySymbol?: string;
  period?: "PA" | "PM";
  breakdown?: {
    fixedLakhs?: number;
    variableLakhs?: number;
    esopsLakhs?: number;
  };
  variant?: "badge" | "card";
}

export function SalaryRangeDisplay({
  minLakhs,
  maxLakhs,
  currencySymbol = "₹",
  period = "PA",
  breakdown,
  variant = "badge",
  className,
  ...props
}: SalaryRangeDisplayProps) {
  const formattedRange =
    minLakhs !== undefined && maxLakhs !== undefined
      ? `${currencySymbol}${minLakhs}L - ${currencySymbol}${maxLakhs}L`
      : minLakhs !== undefined
      ? `${currencySymbol}${minLakhs}L+`
      : maxLakhs !== undefined
      ? `Up to ${currencySymbol}${maxLakhs}L`
      : "Competitive";

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
        <span className="text-[10px] font-medium opacity-75">{period}</span>
      </span>
    );
  }

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
          Compensation Range
        </span>
        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
          {formattedRange} {period}
        </span>
      </div>

      {breakdown ? (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          {breakdown.fixedLakhs !== undefined && (
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Fixed
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currencySymbol}{breakdown.fixedLakhs}L
              </span>
            </div>
          )}
          {breakdown.variableLakhs !== undefined && (
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Variable
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {currencySymbol}{breakdown.variableLakhs}L
              </span>
            </div>
          )}
          {breakdown.esopsLakhs !== undefined && (
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                ESOPs
              </span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {currencySymbol}{breakdown.esopsLakhs}L
              </span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
