import * as React from "react";
import { cn } from "../../../lib/utils";

export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SectionCard({ className, ...props }: SectionCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    />
  );
}
