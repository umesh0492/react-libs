import * as React from "react";
import { cn } from "../../../lib/utils";

export interface MatchScoreGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number; // 0 - 100
  label?: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  showGrade?: boolean;
}

export function MatchScoreGauge({
  score,
  label = "Match Score",
  sublabel,
  size = 110,
  strokeWidth = 9,
  showGrade = true,
  className,
  ...props
}: MatchScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  let color = "text-rose-500 stroke-rose-500";
  let grade = "C";
  if (clamped >= 85) {
    color = "text-emerald-500 stroke-emerald-500";
    grade = "A+";
  } else if (clamped >= 70) {
    color = "text-indigo-500 stroke-indigo-500";
    grade = "A";
  } else if (clamped >= 50) {
    color = "text-amber-500 stroke-amber-500";
    grade = "B";
  }

  return (
    <div
      className={cn("inline-flex flex-col items-center justify-center text-center", className)}
      {...props}
    >
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={cn(color, "transition-all duration-1000 ease-out")}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {Math.round(clamped)}%
          </span>
          {showGrade ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Grade {grade}
            </span>
          ) : null}
        </div>
      </div>
      {label ? (
        <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>
      ) : null}
      {sublabel ? (
        <span className="text-[11px] text-slate-400 leading-tight">
          {sublabel}
        </span>
      ) : null}
    </div>
  );
}
