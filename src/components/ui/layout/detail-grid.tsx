import * as React from "react";
import { cn } from "../../../lib/utils";

export interface DetailGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

export function DetailGrid({ columns = 3, className, ...props }: DetailGridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn("grid gap-4", colClasses[columns] || colClasses[3], className)}
      {...props}
    />
  );
}
