import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "../../../lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  /** The currently selected value */
  value?: string;
  /** Function to call when the value changes */
  onChange?: (value: string) => void;
  /** The list of options to display */
  options: FilterOption[];
  /** Optional placeholder text when no value is selected */
  placeholder?: string;
  /** Optional custom CSS classes for the trigger */
  className?: string;
  /** Optional id or name for the select */
  id?: string;
  /** Optional disabled state */
  disabled?: boolean;
}

/**
 * FilterSelect - A standardized wrapper over Radix Select
 * designed specifically for quickly replacing native <select> elements
 * used frequently in filter bars and tables.
 */
export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  id,
  disabled,
}: FilterSelectProps) {
  const safeValue = value === "" ? "_empty" : value;

  const handleValueChange = React.useCallback((v: string) => {
    if (onChange) {
      onChange(v === "_empty" ? "" : v);
    }
  }, [onChange]);

  return (
    <Select
      value={safeValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn("bg-white", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.length ? (
          options?.map((option) => {
            const optValue = option.value === "" ? "_empty" : option.value;
            return (
              <SelectItem key={optValue} value={optValue}>
                {option.label}
              </SelectItem>
            );
          })
        ) : (
          <SelectItem value="_empty" disabled>
            No options available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
