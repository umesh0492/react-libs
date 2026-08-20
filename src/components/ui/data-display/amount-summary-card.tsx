import * as React from "react";
import { Coins, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../layout/card";
import { Badge } from "./badge";
import { formatCurrency, formatNumber } from "../../../lib/formatters";
import { cn } from "../../../lib/utils";

export interface AmountSummaryItem {
  totalQuantity?: number | string;
  targetPrice?: number | string;
  tax_rate?: number;
}

export interface AmountSummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  baseAmount?: number;
  gstAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  isIntraState?: boolean;
  transportCost?: number;
  tdsPercentage?: number;
  isUrgent?: boolean;
  netPayable?: number;
  isTaxInclusive?: boolean;
  items?: AmountSummaryItem[];
  size?: "sm" | "default";
  maskFormatter?: (val: number | string) => string;
}

export function AmountSummaryCard({
  baseAmount,
  gstAmount,
  cgstAmount,
  sgstAmount,
  igstAmount,
  isIntraState = false,
  transportCost = 0,
  tdsPercentage = 0,
  isUrgent = false,
  netPayable,
  isTaxInclusive = false,
  items,
  size = "default",
  maskFormatter,
  className,
  ...props
}: AmountSummaryCardProps) {
  let finalBaseAmount = baseAmount || 0;
  let finalGstAmount = gstAmount || 0;
  let finalCgstAmount = cgstAmount || 0;
  let finalSgstAmount = sgstAmount || 0;
  let finalIgstAmount = igstAmount || 0;

  if (items && items.length > 0) {
    let calcBase = 0;
    let calcGst = 0;
    let calcCgst = 0;
    let calcSgst = 0;
    let calcIgst = 0;

    items.forEach((item) => {
      const qty = Number(item.totalQuantity) || 0;
      const price = Number(item.targetPrice) || 0;
      const rate = item.tax_rate !== undefined ? Number(item.tax_rate) : 18;

      let base = 0;
      let totalTax = 0;

      if (isTaxInclusive) {
        const totalPrice = qty * price;
        const taxPerUnit = price * (rate / (100 + rate));
        totalTax = qty * taxPerUnit;
        base = totalPrice - totalTax;
      } else {
        base = qty * price;
        const taxPerUnit = price * (rate / 100);
        totalTax = qty * taxPerUnit;
      }

      calcBase += base;
      calcGst += totalTax;

      if (isIntraState) {
        calcCgst += totalTax / 2;
        calcSgst += totalTax / 2;
      } else {
        calcIgst += totalTax;
      }
    });

    if (baseAmount === undefined) finalBaseAmount = calcBase;
    if (gstAmount === undefined) finalGstAmount = calcGst;
    if (cgstAmount === undefined) finalCgstAmount = calcCgst;
    if (sgstAmount === undefined) finalSgstAmount = calcSgst;
    if (igstAmount === undefined) finalIgstAmount = calcIgst;
  }

  const tdsAmount = finalBaseAmount * (tdsPercentage / 100);
  const totalValue =
    netPayable !== undefined
      ? netPayable
      : finalBaseAmount + finalGstAmount + transportCost - tdsAmount;

  const isSm = size === "sm";

  const fmt = (num: number) => {
    if (maskFormatter) return maskFormatter(formatCurrency(num));
    return formatCurrency(num);
  };

  const showIntraState =
    finalCgstAmount > 0 ||
    finalSgstAmount > 0 ||
    (finalIgstAmount === 0 && isIntraState);

  return (
    <Card
      className={cn(
        "rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/30 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-950",
        className
      )}
      {...props}
    >
      <CardHeader
        className={cn(
          "border-b border-slate-100 dark:border-slate-800",
          isSm ? "px-3 py-2" : "px-4.5 py-3"
        )}
      >
        <CardTitle className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Coins className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Amount Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={isSm ? "p-3 space-y-2" : "p-4.5 space-y-3"}>
        <div className="space-y-0.5 text-xs">
          {/* Base Cost */}
          <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500">Base Cost</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {fmt(finalBaseAmount)}
            </span>
          </div>

          {/* Tax Details */}
          {showIntraState ? (
            <>
              <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500">CGST</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  +{fmt(finalCgstAmount > 0 ? finalCgstAmount : finalGstAmount / 2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500">SGST</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  +{fmt(finalSgstAmount > 0 ? finalSgstAmount : finalGstAmount / 2)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">IGST</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                +{fmt(finalIgstAmount > 0 ? finalIgstAmount : finalGstAmount)}
              </span>
            </div>
          )}

          {transportCost > 0 && (
            <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">Logistics Cost</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                +{fmt(transportCost)}
              </span>
            </div>
          )}

          {tdsPercentage > 0 && (
            <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">
                TDS ({tdsPercentage}%)
              </span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                -{fmt(tdsAmount)}
              </span>
            </div>
          )}
        </div>

        {/* Total Payable Value Banner */}
        <div
          className={cn(
            "mt-2 p-3.5 rounded-xl border flex justify-between items-center shadow-xs transition-all",
            isUrgent
              ? "bg-slate-900 border-rose-900/50 text-white"
              : "bg-slate-900 border-slate-800 text-white"
          )}
        >
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
              Total Payable
            </span>
            <span className="text-[9px] text-slate-500 block leading-tight">
              Inclusive of taxes & deductions
            </span>
          </div>
          <div className="text-right">
            <span
              className={cn(
                "font-extrabold tracking-tight block text-emerald-400",
                isSm ? "text-sm" : "text-base"
              )}
            >
              {fmt(totalValue)}
            </span>
          </div>
        </div>

        {isUrgent && (
          <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 border border-rose-500/20 w-full justify-center py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 mt-1">
            <Sparkles className="h-3 w-3 animate-pulse text-rose-500" />
            <span>Urgent Priority Settlement</span>
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
