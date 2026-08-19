import { X } from "lucide-react";
import { Button } from "../forms/button";

interface ActiveFilterBadgeProps {
  label: string;
  onClear: () => void;
  className?: string;
}

export function ActiveFilterBadge({
  label,
  onClear,
  className = "",
}: ActiveFilterBadgeProps) {
  if (!label) return null;

  return (
    <div
      className={`flex items-center gap-2 mb-4 p-2 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 animate-in fade-in slide-in-from-top-2 ${className}`}
    >
      <span className="font-medium flex-1">Showing: {label}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-blue-100 text-blue-600 rounded-full shrink-0"
        onClick={onClear}
        aria-label="Clear filter"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
