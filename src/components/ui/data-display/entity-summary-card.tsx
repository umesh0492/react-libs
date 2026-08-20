import * as React from "react";
import { SectionCard } from "../layout/section-card";
import { cn } from "../../../lib/utils";

export interface EntitySummaryCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EntitySummaryCard({
  title,
  description,
  meta,
  actions,
  icon,
  className,
  ...props
}: EntitySummaryCardProps) {
  return (
    <SectionCard className={cn("p-5 sm:p-6", className)} {...props}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3.5 min-w-0">
          {icon ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              {icon}
            </div>
          ) : null}
          <div className="space-y-1 min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h2>
            {description ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            ) : null}
            {meta ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2 pt-1">
                {meta}
              </div>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
