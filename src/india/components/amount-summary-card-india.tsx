"use client";

import * as React from "react";
import { Coins, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/layout/card";
import { Badge } from "../../components/ui/data-display/badge";
import { cn } from "../../lib/utils";
import { calculateGSTSplit, calculateTDS } from "../tax";
import { formatLakhs, formatCrores } from "../constants";

export interface AmountSummaryCardIndiaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base taxable amount in INR */
  baseAmount?: number;
  /** GST rate percentage (e.g. 5, 12, 18, 28). Default: 18 */
  gstRate?: number;
  /** True if intra-state (CGST 50% + SGST 50%), false for inter-state (IGST 100%). Default: true */
  isIntraState?: boolean;
  /** True if baseAmount already includes GST. Default: false */
  isTaxInclusive?: boolean;
  /** Freight / Cartage / Transportation cost in INR */
  transportCost?: number;
  /** TDS withholding deduction percentage (e.g. 1% or 2% under sec 194C/194J) */
  tdsPercentage?: number;
  /** Explicit override for final net payable */
  netPayable?: number;
  /** Urgent processing indicator flag */
  isUrgent?: boolean;
  /** Label for urgent badge */
  urgentLabel?: string;
  /** Compact or default size */
  size?: "sm" | "default";
}

function formatINRCurrency(value: number): string {
  return "₹" + Math.round(value).toLocaleString("en-IN");
}

export const AmountSummaryCardIndia = React.forwardRef<HTMLDivElement, AmountSummaryCardIndiaProps>(
  (
    {
      baseAmount = 0,
      gstRate = 18,
      isIntraState = true,
      isTaxInclusive = false,
      transportCost = 0,
      tdsPercentage = 0,
      netPayable: netPayableOverride,
      isUrgent = false,
      urgentLabel = "Urgent Payout",
      size = "default",
      className,
      ...props
    },
    ref
  ) => {
    const isSm = size === "sm";

    const gst = React.useMemo(() => {
      return calculateGSTSplit(baseAmount, gstRate, isIntraState, isTaxInclusive);
    }, [baseAmount, gstRate, isIntraState, isTaxInclusive]);

    const tdsAmount = React.useMemo(() => {
      return calculateTDS(gst.baseAmount, tdsPercentage);
    }, [gst.baseAmount, tdsPercentage]);

    const calculatedPayable = Math.max(
      0,
      gst.baseAmount + gst.totalTax + transportCost - tdsAmount
    );
    const totalPayable = netPayableOverride !== undefined ? netPayableOverride : calculatedPayable;

    // Lakhs/Crore high-value contextual hint
    const highValueHint = React.useMemo(() => {
      if (totalPayable >= 10000000) {
        return formatCrores(totalPayable);
      }
      if (totalPayable >= 100000) {
        return formatLakhs(totalPayable);
      }
      return null;
    }, [totalPayable]);

    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden border-border/80 shadow-sm",
          isSm ? "p-3.5" : "p-5",
          className
        )}
        {...props}
      >
        <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-border/60">
          <CardTitle className={cn("flex items-center gap-2 font-semibold text-foreground", isSm ? "text-sm" : "text-base")}>
            <Coins className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>Tax & Amount Summary (INR)</span>
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {isUrgent && (
              <Badge variant="destructive" className="animate-pulse text-[11px] px-2 py-0.5">
                <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
                {urgentLabel}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              {isIntraState ? "Intra-State GST" : "Inter-State IGST"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 pt-3 space-y-2.5 text-xs sm:text-sm">
          {/* Base Amount */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Taxable Value (Base)</span>
            <span className="font-medium text-foreground">{formatINRCurrency(gst.baseAmount)}</span>
          </div>

          {/* GST Breakdown */}
          {isIntraState ? (
            <>
              <div className="flex items-center justify-between pl-2 text-muted-foreground/90 text-xs">
                <span>{`CGST (${gstRate / 2}%)`}</span>
                <span>{formatINRCurrency(gst.cgstAmount)}</span>
              </div>
              <div className="flex items-center justify-between pl-2 text-muted-foreground/90 text-xs">
                <span>{`SGST (${gstRate / 2}%)`}</span>
                <span>{formatINRCurrency(gst.sgstAmount)}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between pl-2 text-muted-foreground/90 text-xs">
              <span>{`IGST (${gstRate}%)`}</span>
              <span>{formatINRCurrency(gst.igstAmount)}</span>
            </div>
          )}

          {/* Transport / Freight */}
          {transportCost > 0 && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Freight / Transport Charges</span>
              <span className="font-medium text-foreground">{formatINRCurrency(transportCost)}</span>
            </div>
          )}

          {/* TDS Deduction */}
          {tdsAmount > 0 && (
            <div className="flex items-center justify-between text-destructive">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{`Less: TDS u/s IT Act (${tdsPercentage}%)`}</span>
              </span>
              <span className="font-medium">{`-${formatINRCurrency(tdsAmount)}`}</span>
            </div>
          )}

          {/* Net Total */}
          <div className="pt-2 border-t border-border/80 flex items-baseline justify-between">
            <div>
              <div className="font-semibold text-foreground text-sm sm:text-base">Net Payable</div>
              {highValueHint && (
                <div className="text-[11px] text-muted-foreground font-mono">
                  {`Approx. ${highValueHint}`}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-bold tracking-tight text-primary font-mono">
                {formatINRCurrency(totalPayable)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

AmountSummaryCardIndia.displayName = "AmountSummaryCardIndia";
