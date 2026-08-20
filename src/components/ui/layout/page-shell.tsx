import * as React from "react";
import { cn } from "../../../lib/utils";

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageShell({ className, ...props }: PageShellProps) {
  return <div className={cn("space-y-6 max-w-7xl mx-auto w-full", className)} {...props} />;
}
