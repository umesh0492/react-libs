"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { Card } from "../layout/card";
import { Button } from "../forms/button";
import { Progress } from "../feedback/progress";
import { cn } from "../../../lib/utils";

export interface QuotaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  used: number;
  total: number;
  /** Label describing the quota units (e.g., "units", "credits", "requests"). Defaults to "units". */
  unitLabel?: string;
  /** Action button CTA text. Defaults to "Upgrade". */
  actionLabel?: string;
  /** Callback fired when the action button is clicked. If omitted, no button is rendered. */
  onAction?: () => void;
  /** Shows a loading state on the action button. */
  isLoading?: boolean;
  /** Optional custom subtitle/description overriding the default "X of Y units remaining". */
  description?: React.ReactNode;
  /** Optional formatter for the badge text (e.g., (pct) => `${pct}% consumed`). */
  formatPercentage?: (percentage: number) => string;
  /** Optional custom icon for the action button. Defaults to `<Sparkles />`. */
  icon?: React.ReactNode;
}

export function QuotaCard({
  title,
  used,
  total,
  unitLabel = "units",
  actionLabel = "Upgrade",
  onAction,
  isLoading = false,
  description,
  formatPercentage,
  icon,
  className,
  ...props
}: QuotaCardProps) {
  const percentage = Math.min(100, Math.max(0, total > 0 ? (used / total) * 100 : 0));
  const remaining = Math.max(0, total - used);
  const badgeText = formatPercentage ? formatPercentage(percentage) : `${Math.round(percentage)}% used`;

  return (
    <Card className={cn("p-4.5 space-y-3.5", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description ?? `${remaining} of ${total} ${unitLabel} remaining`}
          </p>
        </div>
        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
          {badgeText}
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
            {icon ?? <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500" />}
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
