import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface StageProgressionItem {
  id: number | string;
  name: string;
  sublabel?: string;
  target?: string;
}

export interface StageProgressionProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: StageProgressionItem[];
  activeStage: number | string;
  onSelectStage?: (stageId: number | string) => void;
  orientation?: "horizontal" | "vertical";
}

export function StageProgression({
  stages = [],
  activeStage,
  onSelectStage,
  orientation = "horizontal",
  className,
  ...props
}: StageProgressionProps) {
  if (orientation === "vertical") {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {stages.map((st, idx) => {
          const isActive = st.id === activeStage;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectStage?.(st.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all",
                isActive
                  ? "border-indigo-500 bg-indigo-50/50 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40"
                  : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  )}
                >
                  {idx + 1}
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {st.name}
                  </h5>
                  {st.sublabel && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {st.sublabel}
                    </p>
                  )}
                </div>
              </div>
              {st.target && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  {st.target}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar select-none",
        className
      )}
      {...props}
    >
      {stages.map((st, idx) => {
        const isActive = st.id === activeStage;
        return (
          <button
            key={st.id}
            type="button"
            onClick={() => onSelectStage?.(st.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
              isActive
                ? "border-indigo-500 bg-indigo-600 text-white shadow-xs"
                : "border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
              )}
            >
              {idx + 1}
            </span>
            <span>{st.name}</span>
          </button>
        );
      })}
    </div>
  );
}
