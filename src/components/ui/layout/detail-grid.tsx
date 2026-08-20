import * as React from "react";
import { cn } from "../../../lib/utils";

export interface DetailGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

function getGridColClass(columns: 1 | 2 | 3 | 4) {
  switch (columns) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-1 md:grid-cols-2";
    case 4:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    default:
      return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
  }
}

export function DetailGrid({ columns = 3, className, ...props }: DetailGridProps) {
  return (
    <div
      className={cn("grid gap-4", getGridColClass(columns), className)}
      {...props}
    />
  );
}
