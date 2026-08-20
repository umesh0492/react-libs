import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Input } from "./input";

export interface SearchFieldProps extends React.ComponentProps<typeof Input> {
  onClear?: () => void;
  showClear?: boolean;
}

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, value, onChange, onClear, showClear = true, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <Input
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn("pl-9", hasValue && showClear && "pr-9", className)}
          {...props}
        />
        {hasValue && showClear && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClear?.();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);
SearchField.displayName = "SearchField";
