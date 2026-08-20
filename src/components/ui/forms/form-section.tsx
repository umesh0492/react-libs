import * as React from "react";
import { cn } from "../../../lib/utils";

export interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4 pt-4 first:pt-0", className)} {...props}>
      {title || description || actions ? (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            {title ? (
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
