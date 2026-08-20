import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
}

export function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 8,
  className,
  color: colorOverride,
  showLabel = false,
  ...props
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const autoColor =
    clamped >= 80
      ? "text-emerald-500"
      : clamped >= 50
      ? "text-amber-500"
      : "text-rose-500";

  const color = colorOverride ?? autoColor;

  const bgColor =
    clamped >= 80
      ? "text-emerald-100 dark:text-emerald-950/60"
      : clamped >= 50
      ? "text-amber-100 dark:text-amber-950/60"
      : "text-rose-100 dark:text-rose-950/60";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      {...props}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className={bgColor}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(color, "transition-all duration-1000 ease-in-out")}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showLabel ? (
        <span className="absolute text-xs font-bold text-slate-800 dark:text-slate-200">
          {Math.round(clamped)}%
        </span>
      ) : null}
    </div>
  );
}
