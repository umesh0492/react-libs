import * as React from "react";
import { cn } from "../../../lib/utils";

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FilterBar({ className, ...props }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    />
  );
}
