import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../layout/card";

export interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  change?: number; // e.g. 12.5 for +12.5%, -4.2 for -4.2%
  changePeriod?: string; // e.g. "vs last month"
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  variant?: "default" | "outline" | "ghost";
}

export const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  (
    {
      title,
      value,
      description,
      change,
      changePeriod,
      icon,
      prefix,
      suffix,
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const isPositive = typeof change === "number" && change > 0;
    const isNegative = typeof change === "number" && change < 0;
    const isZero = typeof change === "number" && change === 0;

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all",
          variant === "outline" && "border-2",
          variant === "ghost" && "border-transparent bg-muted/30 shadow-none",
          className
        )}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="p-2 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
              {icon}
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
        </CardContent>
      </Card>
    );
  }
);

KPICard.displayName = "KPICard";
