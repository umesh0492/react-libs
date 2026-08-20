import * as React from "react";
import { Check, ChevronsUpDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/data-display/badge";

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  maxCount?: number;
  disabled?: boolean;
  className?: string;
  error?: boolean | string;
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onChange,
      placeholder = "Select options...",
      searchPlaceholder = "Search options...",
      maxCount = 3,
      disabled = false,
      className,
      error,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Close when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery.trim()) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    const handleToggle = (optionValue: string) => {
      if (disabled) return;
      const isSelected = value.includes(optionValue);
      const nextValue = isSelected
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange?.(nextValue);
    };

    const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onChange?.(value.filter((v) => v !== optionValue));
    };

    const handleClearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onChange?.([]);
    };

    const handleSelectAll = () => {
      if (disabled) return;
      const enabledValues = options.filter((o) => !o.disabled).map((o) => o.value);
      onChange?.(enabledValues);
    };

    const selectedOptions = options.filter((o) => value.includes(o.value));
    const visibleTags = selectedOptions.slice(0, maxCount);
    const hiddenCount = selectedOptions.length - maxCount;

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <div ref={containerRef} className="relative">
          <div
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="multiselect-listbox"
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
              } else if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
            className={cn(
              "flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
              disabled && "cursor-not-allowed opacity-50 bg-muted",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <div className="flex flex-wrap items-center gap-1.5 min-w-0 pr-2">
              {selectedOptions.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {visibleTags.map((opt) => (
                    <Badge
                      key={opt.value}
                      variant="secondary"
                      className="gap-1 py-0.5 px-2 text-xs font-normal"
                    >
                      <span>{opt.label}</span>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveTag(opt.value, e)}
                        disabled={disabled}
                        aria-label={`Remove ${opt.label}`}
                        className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {hiddenCount > 0 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{hiddenCount} more
                    </Badge>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
              {selectedOptions.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  aria-label="Clear all selections"
                  className="rounded p-0.5 hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </div>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
              <div className="flex items-center border-b border-border px-3 py-2">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="flex h-6 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex items-center justify-between border-b border-border/50 px-3 py-1.5 text-xs text-muted-foreground">
                <span>{selectedOptions.length} of {options.length} selected</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="hover:text-foreground hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="hover:text-foreground hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <ul id="multiselect-listbox" className="max-h-60 overflow-y-auto p-1 text-sm" role="listbox">
                {filteredOptions.length === 0 ? (
                  <li className="py-6 text-center text-xs text-muted-foreground">
                    No options found.
                  </li>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = value.includes(option.value);
                    return (
                      <li
                        key={option.value}
                        role="option"
                        tabIndex={0}
                        aria-selected={isSelected}
                        onClick={() => !option.disabled && handleToggle(option.value)}
                        onKeyDown={(e) => {
                          if ((e.key === "Enter" || e.key === " ") && !option.disabled) {
                            e.preventDefault();
                            handleToggle(option.value);
                          }
                        }}
                        className={cn(
                          "relative flex items-center justify-between rounded-sm px-2 py-1.5 text-sm cursor-pointer select-none transition-colors",
                          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:outline-none",
                          isSelected && "bg-accent/50 font-medium",
                          option.disabled && "pointer-events-none opacity-50"
                        )}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>

        {typeof error === "string" && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
