"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface KanbanCardItem {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  score?: number;
  /** Optional custom score/metric badge label (e.g., "94%", "$50k", "Priority High"). Overrides score display. */
  scoreLabel?: string;
  avatarUrl?: string;
  /** Optional arbitrary metadata attached to the card item. */
  metadata?: Record<string, unknown>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  /**
   * Explicit count for the column badge (useful for paginated/virtualized stage items).
   * If omitted, defaults to `items.length`.
   */
  count?: number;
  items: KanbanCardItem[];
  tone?: "default" | "indigo" | "emerald" | "amber" | "rose" | "purple";
  /** Optional empty state label when the column has 0 items. Defaults to "No items". */
  emptyMessage?: string;
}

export interface PipelineKanbanProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn[];
  onCardClick?: (item: KanbanCardItem, columnId: string) => void;
  onAddCard?: (columnId: string) => void;
  /** Global empty state message for columns with 0 items. Defaults to "No items". */
  emptyMessage?: string;
}

export function PipelineKanban({
  columns = [],
  onCardClick,
  onAddCard,
  emptyMessage = "No items",
  className,
  ...props
}: PipelineKanbanProps) {
  const getHeaderTone = (tone?: string) => {
    switch (tone) {
      case "emerald":
        return "border-emerald-500 text-emerald-700 dark:text-emerald-300";
      case "amber":
        return "border-amber-500 text-amber-700 dark:text-amber-300";
      case "rose":
        return "border-rose-500 text-rose-700 dark:text-rose-300";
      case "purple":
        return "border-purple-500 text-purple-700 dark:text-purple-300";
      case "indigo":
        return "border-indigo-500 text-indigo-700 dark:text-indigo-300";
      default:
        return "border-slate-400 text-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div
      className={cn("flex gap-4 overflow-x-auto pb-4 custom-scrollbar", className)}
      {...props}
    >
      {columns.map((col) => {
        const displayCount = col.count !== undefined ? col.count : col.items.length;
        const colEmptyMessage = col.emptyMessage ?? emptyMessage;

        return (
          <div
            key={col.id}
            className="flex flex-col min-w-[280px] max-w-[320px] shrink-0 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/40"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "border-l-[3px] pl-2 font-bold text-xs uppercase tracking-wider",
                    getHeaderTone(col.tone)
                  )}
                >
                  {col.title}
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {displayCount}
                </span>
              </div>
              {onAddCard && (
                <button
                  type="button"
                  onClick={() => onAddCard(col.id)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800"
                  aria-label={`Add item to ${col.title}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Cards Stack */}
            <div className="space-y-2.5 flex-1 min-h-32">
              {col.items.map((item) => {
                const metricBadge = item.scoreLabel ?? (item.score !== undefined ? `${item.score}%` : null);

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onCardClick?.(item, col.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onCardClick?.(item, col.id);
                      }
                    }}
                    className="cursor-pointer rounded-lg border border-slate-200/80 bg-white p-3 shadow-2xs transition-all hover:border-indigo-400 hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {item.title}
                      </h5>
                      {metricBadge ? (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                          {metricBadge}
                        </span>
                      ) : null}
                    </div>

                    {item.subtitle ? (
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.subtitle}
                      </p>
                    ) : null}

                    {item.tag ? (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {item.tag}
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {col.items.length === 0 && (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 text-center text-xs text-slate-400 dark:border-slate-800">
                  {colEmptyMessage}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
