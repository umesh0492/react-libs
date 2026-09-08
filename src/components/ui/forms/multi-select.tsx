"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../data-display/badge";

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "defaultValue" | "onChange"> {
  options: Option[];
  value?: string[];
  defaultValue?: string[];
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
      value: valueProp,
      defaultValue,
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
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(defaultValue ?? []);
    const value = isControlled ? valueProp : uncontrolledValue;

    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState<number>(-1);

    const generatedId = React.useId();
    const listboxId = `${generatedId}-listbox`;
    const searchInputId = `${generatedId}-search`;

    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const updateValue = React.useCallback(
      (nextValue: string[]) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onChange?.(nextValue);
      },
      [isControlled, onChange]
    );

    // Reset active index when dropdown closes
    React.useEffect(() => {
      if (!isOpen) {
        setActiveIndex(-1);
      }
    }, [isOpen]);

    // Close when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setActiveIndex(-1);
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

    const moveActiveIndex = (direction: 1 | -1) => {
      if (filteredOptions.length === 0) return;
      setActiveIndex((prev) => {
        let next = prev + direction;
        if (next < 0) next = filteredOptions.length - 1;
        if (next >= filteredOptions.length) next = 0;
        return next;
      });
    };

    const handleCloseAndRestoreFocus = () => {
      setIsOpen(false);
      setActiveIndex(-1);
      triggerRef.current?.focus();
    };

    const handleToggle = (optionValue: string) => {
      if (disabled) return;
      const isSelected = value.includes(optionValue);
      const nextValue = isSelected
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      updateValue(nextValue);
    };

    const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      updateValue(value.filter((v) => v !== optionValue));
    };

    const handleClearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      updateValue([]);
    };

    const handleSelectAll = () => {
      if (disabled) return;
      const enabledValues = options.filter((o) => !o.disabled).map((o) => o.value);
      updateValue(enabledValues);
    };

    const selectedOptions = options.filter((o) => value.includes(o.value));
    const visibleTags = selectedOptions.slice(0, maxCount);
    const hiddenCount = selectedOptions.length - maxCount;

    const handleEnterOrSpace = (e: React.KeyboardEvent) => {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(0);
        return;
      }
      // eslint-disable-next-line security/detect-object-injection
      const activeOpt = filteredOptions[activeIndex];
      if (activeIndex >= 0 && activeOpt && !activeOpt.disabled) {
        handleToggle(activeOpt.value);
      } else {
        setIsOpen(false);
      }
    };

    const handleArrowKey = (e: React.KeyboardEvent, direction: 1 | -1) => {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(direction === 1 ? 0 : filteredOptions.length - 1);
      } else {
        moveActiveIndex(direction);
      }
    };

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        handleEnterOrSpace(e);
      } else if (e.key === "ArrowDown") {
        handleArrowKey(e, 1);
      } else if (e.key === "ArrowUp") {
        handleArrowKey(e, -1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCloseAndRestoreFocus();
      }
    };

    // eslint-disable-next-line security/detect-object-injection
    const currentActiveOption = filteredOptions[activeIndex];
    const activeOptionId =
      isOpen && activeIndex >= 0 && currentActiveOption
        ? `${generatedId}-option-${activeIndex}`
        : undefined;

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <div ref={containerRef} className="relative">
          <div
            ref={triggerRef}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            aria-disabled={disabled}
            aria-label={props["aria-label"] || placeholder}
            tabIndex={disabled ? -1 : 0}
            onClick={() => {
              if (!disabled) {
                setIsOpen((prev) => !prev);
              }
            }}
            onKeyDown={handleTriggerKeyDown}
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
                  ref={searchInputRef}
                  id={searchInputId}
                  type="text"
                  aria-label={searchPlaceholder || "Search options"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      moveActiveIndex(1);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      moveActiveIndex(-1);
                    } else if (e.key === "Enter") {
                      // eslint-disable-next-line security/detect-object-injection
                      const opt = filteredOptions[activeIndex];
                      if (activeIndex >= 0 && opt && !opt.disabled) {
                        e.preventDefault();
                        handleToggle(opt.value);
                      }
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      handleCloseAndRestoreFocus();
                    }
                  }}
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

              <ul
                id={listboxId}
                role="listbox"
                aria-label={placeholder || "Options"}
                aria-multiselectable="true"
                className="max-h-60 overflow-y-auto p-1 text-sm"
              >
                {filteredOptions.length === 0 ? (
                  <li role="presentation" className="py-6 text-center text-xs text-muted-foreground">
                    No options found.
                  </li>
                ) : (
                  filteredOptions.map((option, idx) => {
                    const isSelected = value.includes(option.value);
                    const isCurrentActive = activeIndex === idx;
                    return (
                      <li
                        key={option.value}
                        id={`${generatedId}-option-${idx}`}
                        role="option"
                        tabIndex={-1}
                        aria-selected={isSelected}
                        aria-disabled={option.disabled}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => !option.disabled && handleToggle(option.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (!option.disabled) handleToggle(option.value);
                          }
                        }}
                        className={cn(
                          "relative flex items-center justify-between rounded-sm px-2 py-1.5 text-sm cursor-pointer select-none transition-colors",
                          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:outline-none",
                          (isSelected || isCurrentActive) && "bg-accent/50 font-medium",
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
