import * as React from "react";
import { cn } from "../../../lib/utils";

export interface InfoItem {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
}

export interface InfoListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: InfoItem[];
}

export function InfoList({ items, className, ...props }: InfoListProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 dark:border-slate-800"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {item.label}
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {item.value}
          </span>
          {item.hint ? (
            <span className="text-xs text-slate-400">{item.hint}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
