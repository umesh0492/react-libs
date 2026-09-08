"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../layout/card";

export type KPICardTone = "default" | "info" | "success" | "warning" | "danger" | "accent";

export interface KPICardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  label?: React.ReactNode; // alias for title
  value: React.ReactNode;
  description?: React.ReactNode;
  change?: number; // e.g. 12.5 for +12.5%, -4.2 for -4.2%
  changePeriod?: string; // e.g. "vs last month"
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  prefix?: string;
  suffix?: string;
  variant?: "default" | "outline" | "ghost";
  tone?: KPICardTone;
  warning?: React.ReactNode;
}

function getToneStyle(tone: KPICardTone): string {
  switch (tone) {
    case "info":
      return "border-indigo-200/60 bg-indigo-50/20 dark:border-indigo-900/40 dark:bg-indigo-950/20";
    case "success":
      return "border-emerald-200/60 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/20";
    case "warning":
      return "border-amber-200/60 bg-amber-50/20 dark:border-amber-900/40 dark:bg-amber-950/20";
    case "danger":
      return "border-rose-200/60 bg-rose-50/20 dark:border-rose-900/40 dark:bg-rose-950/20";
    case "accent":
      return "border-purple-200/60 bg-purple-50/20 dark:border-purple-900/40 dark:bg-purple-950/20";
    default:
      return "";
  }
}

export const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  (
    {
      title,
      label,
      value,
      description,
      change,
      changePeriod,
      icon,
      prefix,
      suffix,
      variant = "default",
      tone = "default",
      warning,
      className,
      ...props
    },
    ref
  ) => {
    const displayTitle = title || label || "";
    const isPositive = typeof change === "number" && change > 0;
    const isNegative = typeof change === "number" && change < 0;
    const isZero = typeof change === "number" && change === 0;

    const renderIcon = () => {
      if (!icon) return null;
      if (typeof icon === "function") {
        const IconComp = icon as React.ComponentType<{ className?: string }>;
        return <IconComp className="h-5 w-5" />;
      }
      return icon;
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all",
          variant === "outline" && "border-2",
          variant === "ghost" && "border-transparent bg-muted/30 shadow-none",
          getToneStyle(tone),
          className
        )}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {displayTitle}
          </CardTitle>
          {icon && (
            <div className="p-2 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
              {renderIcon()}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-1">
          <div className="text-2xl font-bold tracking-tight text-foreground flex items-baseline gap-0.5">
            {prefix && <span className="text-xl font-normal text-muted-foreground">{prefix}</span>}
            <span>{value}</span>
            {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
          </div>

          {(typeof change === "number" || description || changePeriod) && (
            <div className="flex items-center gap-1.5 pt-1 text-xs">
              {typeof change === "number" && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded",
                    isPositive && "text-emerald-700 bg-emerald-500/10 dark:text-emerald-400",
                    isNegative && "text-rose-700 bg-rose-500/10 dark:text-rose-400",
                    isZero && "text-muted-foreground bg-muted"
                  )}
                >
                  {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                  {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                  {isZero && <Minus className="h-3.5 w-3.5" />}
                  <span>
                    {isPositive ? `+${change}%` : `${change}%`}
                  </span>
                </div>
              )}

              {(changePeriod || description) && (
                <span className="text-muted-foreground truncate">
                  {changePeriod || description}
                </span>
              )}
            </div>
          )}

          {warning && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{warning}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

KPICard.displayName = "KPICard";

export { KPICard as MetricCard, type KPICardProps as MetricCardProps };
