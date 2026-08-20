import * as React from "react";
import { Sparkles } from "lucide-react";
import { SectionCard } from "../layout/section-card";
import { Button } from "../forms/button";
import { Progress } from "../feedback/progress";
import { cn } from "../../../lib/utils";

export interface QuotaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  used: number;
  total: number;
  unitLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export function QuotaCard({
  title,
  used,
  total,
  unitLabel = "Unlocks",
  actionLabel = "Upgrade Plan",
  onAction,
  isLoading = false,
  className,
  ...props
}: QuotaCardProps) {
  const percentage = Math.min(100, Math.max(0, total > 0 ? (used / total) * 100 : 0));
  const remaining = Math.max(0, total - used);

  return (
    <SectionCard className={cn("p-4.5 space-y-3.5", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {remaining} of {total} {unitLabel} remaining
          </p>
        </div>
        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
          {Math.round(percentage)}% used
        </span>
      </div>

      <Progress value={percentage} className="h-2" />

      {onAction ? (
        <div className="pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onAction}
            disabled={isLoading}
            className="w-full text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </SectionCard>
  );
}
