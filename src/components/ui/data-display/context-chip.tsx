import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ContextChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: React.ReactNode;
  value?: React.ReactNode;
  tone?: "default" | "indigo" | "emerald" | "amber" | "rose" | "purple";
  icon?: React.ReactNode;
}

function getToneStyle(tone: string) {
  switch (tone) {
    case "indigo":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800";
    case "emerald":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    case "amber":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    case "rose":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
    case "purple":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }
}

export function ContextChip({
  label,
  value,
  tone = "default",
  icon,
  className,
  ...props
}: ContextChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        getToneStyle(tone),
        className
      )}
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="font-semibold">{label}</span>
      {value !== undefined ? (
        <>
          <span className="opacity-40">•</span>
          <span>{value}</span>
        </>
      ) : null}
    </span>
  );
}
