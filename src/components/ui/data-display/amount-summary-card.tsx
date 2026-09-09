"use client";

import * as React from "react";
import { Coins, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../layout/card";
import { Badge } from "./badge";
import { formatCurrency } from "../../../lib/formatters";
import { cn } from "../../../lib/utils";

export interface AmountSummaryItem {
  totalQuantity?: number | string;
  targetPrice?: number | string;
  taxRate?: number;
  /** @deprecated Use `taxRate` instead. */
  tax_rate?: number;
}

export interface AmountSummaryTaxItem {
  label: string;
  amount: number;
  rate?: number;
}

export interface AmountSummaryDeductionItem {
  label: string;
  amount: number;
  rate?: number;
}

export interface AmountSummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  baseAmount?: number;
  /** Direct single tax amount or list of individual tax components */
  taxAmount?: number;
  taxLabel?: string;
  taxes?: AmountSummaryTaxItem[];
  shippingCost?: number;
  /** @deprecated Alias for `shippingCost` */
  transportCost?: number;
  /** Percentage of tax or withholding deduction */
  withholdingPercentage?: number;
  /** @deprecated Alias for `withholdingPercentage` */
  tdsPercentage?: number;
  /** Custom deductions list */
  deductions?: AmountSummaryDeductionItem[];
  /** Flag to indicate urgent processing */
  isUrgent?: boolean;
  urgentLabel?: string;
  /** Explicit net payable override */
  netPayable?: number;
  isTaxInclusive?: boolean;
  items?: AmountSummaryItem[];
  size?: "sm" | "default";
  maskFormatter?: (val: number | string) => string;
}

function calculateItemTax(item: AmountSummaryItem, isTaxInclusive: boolean) {
  const qty = Number(item.totalQuantity) || 0;
  const price = Number(item.targetPrice) || 0;
  let rate = 0;
  if (item.taxRate !== undefined) {
    rate = Number(item.taxRate);
  } else if (item.tax_rate !== undefined) {
    rate = Number(item.tax_rate);
  }

  if (isTaxInclusive) {
    const totalPrice = qty * price;
    const taxPerUnit = rate > 0 ? price * (rate / (100 + rate)) : 0;
    const totalTax = qty * taxPerUnit;
    return { base: totalPrice - totalTax, totalTax };
  }

  const base = qty * price;
  const taxPerUnit = price * (rate / 100);
  return { base, totalTax: qty * taxPerUnit };
}

function calculateItemsTotals(items: AmountSummaryItem[], isTaxInclusive: boolean) {
  let calcBase = 0;
  let calcTax = 0;

  for (const item of items) {
    const { base, totalTax } = calculateItemTax(item, isTaxInclusive);
    calcBase += base;
    calcTax += totalTax;
  }

  return { calcBase, calcTax };
}

function computeAmounts({
  baseAmount,
  taxAmount,
  taxes,
  shippingCost,
  transportCost,
  withholdingPercentage,
  tdsPercentage,
  deductions,
  netPayable,
  isTaxInclusive,
  items,
}: Pick<
  AmountSummaryCardProps,
  | "baseAmount"
  | "taxAmount"
  | "taxes"
  | "shippingCost"
  | "transportCost"
  | "withholdingPercentage"
  | "tdsPercentage"
  | "deductions"
  | "netPayable"
  | "isTaxInclusive"
  | "items"
>) {
  let finalBaseAmount = baseAmount ?? 0;
  let finalTaxAmount = taxAmount ?? 0;

  if (items && items.length > 0) {
    const computed = calculateItemsTotals(items, isTaxInclusive ?? false);
    if (baseAmount === undefined) finalBaseAmount = computed.calcBase;
    if (taxAmount === undefined && (!taxes || taxes.length === 0)) finalTaxAmount = computed.calcTax;
  }

  const effectiveShipping = shippingCost ?? transportCost ?? 0;
  const effectiveWithholdingPct = withholdingPercentage ?? tdsPercentage ?? 0;
  const withholdingAmount = finalBaseAmount * (effectiveWithholdingPct / 100);

  let totalTaxFromList = 0;
  if (taxes && taxes.length > 0) {
    totalTaxFromList = taxes.reduce((acc, t) => acc + t.amount, 0);
  } else {
    totalTaxFromList = finalTaxAmount;
  }

  let totalDeductions = withholdingAmount;
  if (deductions && deductions.length > 0) {
    totalDeductions += deductions.reduce((acc, d) => acc + d.amount, 0);
  }

  const totalValue =
    netPayable !== undefined
      ? netPayable
      : finalBaseAmount + totalTaxFromList + effectiveShipping - totalDeductions;

  return {
    finalBaseAmount,
    finalTaxAmount,
    effectiveShipping,
    effectiveWithholdingPct,
    withholdingAmount,
    totalValue,
  };
}

interface TaxBreakdownProps {
  taxes?: Array<{ label: string; amount: number }>;
  finalTaxAmount: number;
  taxLabel: string;
  fmt: (num: number) => string;
}

function TaxBreakdownSection({ taxes, finalTaxAmount, taxLabel, fmt }: TaxBreakdownProps) {
  if (taxes && taxes.length > 0) {
    return (
      <>
        {taxes.map((tax, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800"
          >
            <span className="text-[11px] font-medium text-slate-500">{tax.label}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              +{fmt(tax.amount)}
            </span>
          </div>
        ))}
      </>
    );
  }

  if (finalTaxAmount > 0) {
    return (
      <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-medium text-slate-500">{taxLabel}</span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          +{fmt(finalTaxAmount)}
        </span>
      </div>
    );
  }

  return null;
}

interface TotalPayableSectionProps {
  isUrgent: boolean;
  urgentLabel?: string;
  isSm: boolean;
  totalValue: number;
  fmt: (num: number) => string;
}

function TotalPayableSection({ isUrgent, urgentLabel, isSm, totalValue, fmt }: TotalPayableSectionProps) {
  return (
    <>
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
          <span>{urgentLabel ?? "Urgent Priority Settlement"}</span>
        </Badge>
      )}
    </>
  );
}

export function AmountSummaryCard({
  baseAmount,
  taxAmount,
  taxLabel = "Tax",
  taxes,
  shippingCost,
  transportCost,
  withholdingPercentage,
  tdsPercentage,
  deductions,
  isUrgent = false,
  urgentLabel,
  netPayable,
  isTaxInclusive = false,
  items,
  size = "default",
  maskFormatter,
  className,
  ...props
}: AmountSummaryCardProps) {
  const {
    finalBaseAmount,
    finalTaxAmount,
    effectiveShipping,
    effectiveWithholdingPct,
    withholdingAmount,
    totalValue,
  } = computeAmounts({
    baseAmount,
    taxAmount,
    taxes,
    shippingCost,
    transportCost,
    withholdingPercentage,
    tdsPercentage,
    deductions,
    netPayable,
    isTaxInclusive,
    items,
  });

  const isSm = size === "sm";

  const fmt = (num: number) => {
    if (maskFormatter) return maskFormatter(formatCurrency(num));
    return formatCurrency(num);
  };

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

          {/* Tax Breakdown */}
          <TaxBreakdownSection
            taxes={taxes}
            finalTaxAmount={finalTaxAmount}
            taxLabel={taxLabel}
            fmt={fmt}
          />

          {/* Shipping & Logistics */}
          {effectiveShipping > 0 && (
            <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">Logistics & Shipping</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                +{fmt(effectiveShipping)}
              </span>
            </div>
          )}

          {/* Withholding */}
          {effectiveWithholdingPct > 0 && (
            <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">
                Withholding ({effectiveWithholdingPct}%)
              </span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                -{fmt(withholdingAmount)}
              </span>
            </div>
          )}

          {/* Custom Deductions */}
          {deductions &&
            deductions.map((d, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-1 border-b border-dashed border-slate-100 dark:border-slate-800"
              >
                <span className="text-[11px] font-medium text-slate-500">{d.label}</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  -{fmt(d.amount)}
                </span>
              </div>
            ))}
        </div>

        {/* Total Payable Value Banner */}
        <TotalPayableSection
          isUrgent={isUrgent}
          urgentLabel={urgentLabel}
          isSm={isSm}
          totalValue={totalValue}
          fmt={fmt}
        />
      </CardContent>
    </Card>
  );
}
