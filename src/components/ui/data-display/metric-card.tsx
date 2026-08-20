import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SectionCard } from "../layout/section-card";
import { cn } from "../../../lib/utils";

const metricCardVariants = cva("p-5 transition-all duration-200", {
  variants: {
    tone: {
      default: "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900",
      info: "border-indigo-200/60 bg-indigo-50/30 dark:border-indigo-900/40 dark:bg-indigo-950/20",
      success: "border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20",
      warning: "border-amber-200/60 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-950/20",
      danger: "border-rose-200/60 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/20",
      accent: "border-purple-200/60 bg-purple-50/30 dark:border-purple-900/40 dark:bg-purple-950/20",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

const metricIconVariants = cva("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", {
  variants: {
    tone: {
      default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
      info: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
      success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      danger: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
      accent: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export interface MetricCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof metricCardVariants> {
  label: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  warning?: React.ReactNode;
  change?: number;
  changePeriod?: string;
}

export function MetricCard({
  label,
  value,
  description,
  icon,
  tone,
  warning,
  change,
  changePeriod,
  className,
  ...props
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="h-5 w-5" />;
    }
    return icon;
  };

  return (
    <SectionCard className={cn(metricCardVariants({ tone }), className)} {...props}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {label}
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 truncate">
            {value}
          </p>
          {description ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          ) : null}
        </div>
        {icon ? (
          <div className={metricIconVariants({ tone })}>{renderIcon()}</div>
        ) : null}
      </div>

      {change !== undefined && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-bold",
              isPositive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
              isNegative && "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
              !isPositive && !isNegative && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
            {change > 0 ? `+${change}%` : `${change}%`}
          </span>
          {changePeriod ? (
            <span className="text-slate-400">{changePeriod}</span>
          ) : null}
        </div>
      )}

      {warning ? (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{warning}</span>
        </div>
      ) : null}
    </SectionCard>
  );
}

export interface MetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

export function MetricGrid({
  columns = 4,
  className,
  ...props
}: MetricGridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn("grid gap-4", colClasses[columns] || colClasses[4], className)}
      {...props}
    />
  );
}
