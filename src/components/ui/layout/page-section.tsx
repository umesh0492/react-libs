import * as React from "react";
import { cn } from "../../../lib/utils";

export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function PageSection({ className, ...props }: PageSectionProps) {
  return <section className={cn("space-y-4", className)} {...props} />;
}
