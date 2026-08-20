import * as React from "react";
import { cn } from "../../../lib/utils";

export interface PageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageActions({ className, ...props }: PageActionsProps) {
  return <div className={cn("flex shrink-0 flex-wrap items-center gap-2", className)} {...props} />;
}
