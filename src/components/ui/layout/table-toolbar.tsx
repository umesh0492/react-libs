import * as React from "react";
import { cn } from "../../../lib/utils";

export interface TableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TableToolbar({ className, ...props }: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50",
        className
      )}
      {...props}
    />
  );
}
