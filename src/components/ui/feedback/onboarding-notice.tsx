import * as React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "../../../lib/utils";

export type OnboardingNoticeTone = "error" | "info" | "success" | "warning";

export interface OnboardingNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: React.ReactNode;
  tone?: OnboardingNoticeTone;
  children?: React.ReactNode;
}

function getNoticeStyle(tone: OnboardingNoticeTone) {
  switch (tone) {
    case "error":
      return "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300";
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300";
    default:
      return "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200";
  }
}

function renderNoticeIcon(tone: OnboardingNoticeTone) {
  switch (tone) {
    case "error":
      return <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />;
    case "success":
      return <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />;
    case "warning":
      return <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />;
    default:
      return <Info className="mt-0.5 h-4 w-4 shrink-0" />;
  }
}

export function OnboardingNotice({
  message,
  tone = "info",
  children,
  className,
  ...props
}: OnboardingNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs font-medium leading-relaxed shadow-xs",
        getNoticeStyle(tone),
        className
      )}
      role={tone === "error" ? "alert" : "status"}
      {...props}
    >
      {renderNoticeIcon(tone)}
      <div className="flex-1">{message || children}</div>
    </div>
  );
}
