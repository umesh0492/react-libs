import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { SectionCard } from "../layout/section-card";
import { Button } from "../forms/button";
import { cn } from "../../../lib/utils";

export interface ErrorStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: React.ReactNode;
  onAction?: () => void;
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <SectionCard
      className={cn("px-6 py-10 text-center", className)}
      {...props}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </SectionCard>
  );
}
