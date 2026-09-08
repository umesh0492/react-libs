"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../overlays/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../core/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  value?: string;
  defaultValue?: string;
  options: ComboboxOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
  searchPlaceholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      value: valueProp,
      defaultValue,
      options = [],
      onChange,
      placeholder = "Select an option",
      disabled = false,
      emptyText = "No options found.",
      searchPlaceholder,
      triggerClassName,
      contentClassName,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [uncontrolledValue, setUncontrolledValue] = React.useState<
      string | undefined
    >(defaultValue);

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (optionValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(optionValue);
      }
      onChange?.(optionValue);
      setOpen(false);
    };

    return (
      <Popover modal={false} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between bg-white font-normal text-left dark:bg-slate-950 dark:border-slate-800",
              !selectedOption && "text-slate-500 dark:text-slate-400",
              triggerClassName
            )}
          >
            <span className="truncate">
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={cn(
            "w-[var(--radix-popover-trigger-width)] p-0",
            contentClassName
          )}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <Command>
            <CommandInput
              placeholder={
                searchPlaceholder ?? `Search ${placeholder.toLowerCase()}...`
              }
            />
            <CommandList className="max-h-72 overflow-y-auto">
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
Combobox.displayName = "Combobox";
