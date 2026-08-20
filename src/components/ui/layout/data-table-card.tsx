import * as React from "react";
import { SectionCard } from "./section-card";
import { SectionHeader } from "./section-header";
import { cn } from "../../../lib/utils";

export interface DataTableCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  headerClassName?: string;
}

export function DataTableCard({
  title,
  description,
  actions,
  children,
  headerClassName,
  className,
  ...props
}: DataTableCardProps) {
  return (
    <SectionCard className={className} {...props}>
      {title ? (
        <div
          className={cn(
            "border-b border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60",
            headerClassName
          )}
        >
          <SectionHeader title={title} description={description} actions={actions} />
        </div>
      ) : null}
      <div className="overflow-x-auto">{children}</div>
    </SectionCard>
  );
}
