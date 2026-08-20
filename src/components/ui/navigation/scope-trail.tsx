import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface ScopeTrailItem {
  id?: string;
  label: string;
  value?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface ScopeTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ScopeTrailItem[];
}

export function ScopeTrail({ items, className, ...props }: ScopeTrailProps) {
  return (
    <nav
      aria-label="Scope Hierarchy"
      className={cn("flex flex-wrap items-center gap-1.5 text-xs", className)}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          {index > 0 && (
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          )}
          {item.onClick && !item.active ? (
            <button
              type="button"
              onClick={item.onClick}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span>{item.label}</span>
              {item.value && <span className="text-slate-400">• {item.value}</span>}
            </button>
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold",
                item.active
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              )}
            >
              <span>{item.label}</span>
              {item.value && <span className="opacity-60">• {item.value}</span>}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
