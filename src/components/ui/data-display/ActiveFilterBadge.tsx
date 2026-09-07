import { X } from "lucide-react";
import { Button } from "../forms/button";
import { cn } from "../../../lib/utils";

export interface ActiveFilterBadgeProps {
  label: string;
  onClear: () => void;
  className?: string;
}

export function ActiveFilterBadge({
  label,
  onClear,
  className,
}: ActiveFilterBadgeProps) {
  if (!label) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 mb-4 p-2 bg-blue-50/80 border border-blue-200 rounded-md text-sm text-blue-900 animate-in fade-in slide-in-from-top-2 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200",
        className
      )}
    >
      <span className="font-medium flex-1">Showing: {label}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 rounded-full shrink-0"
        onClick={onClear}
        aria-label="Clear filter"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
