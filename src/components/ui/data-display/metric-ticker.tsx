"use client";

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
  const [isPaused, setIsPaused] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  // Duplicate list to create seamless infinite scroll loop
  const duplicatedItems = [...items, ...items];

  return (
    <div
      role="region"
      aria-label={props["aria-label"] || "Metrics ticker"}
      tabIndex={props.tabIndex ?? 0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "group overflow-hidden border-y border-indigo-500/20 bg-indigo-950/20 py-2 backdrop-blur-xs select-none",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-max gap-8 animate-[marquee_linear_infinite]",
          "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
          "hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]",
          "motion-reduce:animate-none motion-reduce:transform-none"
        )}
        style={{
          animationDuration: `${speedSeconds}s`,
          animationPlayState: isPaused ? "paused" : undefined,
          animationName: prefersReducedMotion ? "none" : undefined,
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
