import * as React from "react";
import { Loader2 } from "lucide-react";
import { Card } from "../layout/card";
import { cn } from "../../../lib/utils";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  spinnerSize?: number;
}

export function LoadingState({
  label = "Loading data...",
  spinnerSize = 28,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <Card
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-10 text-slate-500 dark:text-slate-400",
        className
      )}
      {...props}
    >
      <Loader2
        className="animate-spin text-indigo-600 dark:text-indigo-400"
        style={{ width: spinnerSize, height: spinnerSize }}
      />
      <p className="text-sm font-medium">{label}</p>
    </Card>
  );
}
