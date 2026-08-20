import * as React from "react";
import { cn } from "../../../lib/utils";

export interface TickerItem {
  id?: string;
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface MetricTickerProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TickerItem[];
  speedSeconds?: number;
}

export function MetricTicker({
  items = [],
  speedSeconds = 30,
  className,
  ...props
}: MetricTickerProps) {
  // Duplicate list to create seamless infinite scroll loop
  const duplicatedItems = [...items, ...items];

  return (
    <div
      className={cn(
        "overflow-hidden border-y border-indigo-500/20 bg-indigo-950/20 py-2 backdrop-blur-xs select-none",
        className
      )}
      {...props}
    >
      <div
        className="flex w-max gap-8 animate-[marquee_linear_infinite]"
        style={{
          animationDuration: `${speedSeconds}s`,
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={item.id || `${item.label}-${idx}`}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400"
          >
            <span>{item.label}:</span>
            <span
              className={cn(
                "font-bold text-slate-200",
                item.highlight && "text-indigo-400 font-extrabold"
              )}
            >
              {item.value}
            </span>
            <span className="text-slate-600 ml-3">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
