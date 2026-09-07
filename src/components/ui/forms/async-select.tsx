"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../overlays/command";
import { Check, Loader2 } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface AsyncSelectProps<T> {
  value: string;
  onChange: (value: string, item: T | null) => void;
  fetchFn: (query: string) => Promise<T[]>;
  getOptionLabel: (option: T) => React.ReactNode;
  getOptionStringValue?: (option: T) => string;
  getOptionValue: (option: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  debounceMs?: number;
}

export function AsyncSelect<T>({
  value,
  onChange,
  fetchFn,
  getOptionLabel,
  getOptionStringValue,
  getOptionValue,
  placeholder = "Search...",
  searchPlaceholder = "Type to search...",
  emptyMessage = "No results found.",
  className,
  debounceMs = 300,
}: AsyncSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<T[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const latestRequestIdRef = React.useRef(0);

  const fetchFnRef = React.useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const getOptionLabelRef = React.useRef(getOptionLabel);
  getOptionLabelRef.current = getOptionLabel;

  const getOptionValueRef = React.useRef(getOptionValue);
  getOptionValueRef.current = getOptionValue;

  const getOptionStringValueRef = React.useRef(getOptionStringValue);
  getOptionStringValueRef.current = getOptionStringValue;

  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const getOptionSafeString = React.useCallback(
    (option: T): string => {
      if (getOptionStringValueRef.current) {
        return getOptionStringValueRef.current(option);
      }
      const label = getOptionLabelRef.current(option);
      if (typeof label === "string") {
        return label;
      }
      if (typeof label === "number") {
        return String(label);
      }
      return getOptionValueRef.current(option);
    },
    []
  );

  // Sync selected textual label representation with query
  const syncQueryWithSelection = React.useCallback(
    (opts: T[]) => {
      if (value) {
        const match = opts.find((o) => getOptionValueRef.current(o) === value);
        if (match) {
          setQuery(getOptionSafeString(match));
        }
      } else {
        setQuery("");
      }
    },
    [value, getOptionSafeString]
  );

  // Fetch with request sequencing to eliminate stale async race conditions
  React.useEffect(() => {
    let active = true;

    if (!open) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const requestId = ++latestRequestIdRef.current;

    const timeout = setTimeout(async () => {
      try {
        const results = await fetchFnRef.current(query);
        if (active && requestId === latestRequestIdRef.current) {
          setOptions(results);
        }
      } catch (err) {
        if (active && requestId === latestRequestIdRef.current) {
          console.error("AsyncSelect fetch error:", err);
        }
      } finally {
        if (active && requestId === latestRequestIdRef.current) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query, open, debounceMs]);

  // Sync query on external value change
  React.useEffect(() => {
    if (!open) {
      if (optionsRef.current.length > 0) {
        syncQueryWithSelection(optionsRef.current);
      } else if (!value) {
        setQuery("");
      }
    }
  }, [value, open, syncQueryWithSelection]);
  
  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        syncQueryWithSelection(optionsRef.current);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, syncQueryWithSelection]);

  return (
    <div className={cn("relative w-full z-50", className)} ref={containerRef}>
      <Command shouldFilter={false} className="overflow-visible bg-transparent border rounded-md">
        <CommandInput 
          placeholder={searchPlaceholder || placeholder} 
          value={query}
          onValueChange={(v) => {
            setQuery(v);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
             setOpen(true);
             if (value) setQuery(""); // clear selection to let them type full new search
          }}
          className="border-none focus:ring-0 w-full"
        />
        {open && (
           <div className="absolute top-full z-[100] w-full mt-1 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none">
            <CommandList className="max-h-60 overflow-y-auto w-full p-1">
              {loading && <div className="py-6 text-center text-sm"><Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" /></div>}
              {!loading && options.length === 0 && <CommandEmpty>{emptyMessage}</CommandEmpty>}
              <CommandGroup>
                {!loading && options.map((option) => {
                  const optVal = getOptionValue(option);
                  return (
                    <CommandItem
                      key={optVal}
                      value={optVal}
                      onSelect={() => {
                        onChange(optVal, option);
                        setOpen(false);
                        setQuery(getOptionSafeString(option));
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 flex-shrink-0",
                          value === optVal ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="truncate w-full">{getOptionLabel(option)}</div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
           </div>
        )}
      </Command>
    </div>
  );
}
