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

  // Sync selected textual label representation with query!
  const syncQueryWithSelection = React.useCallback(
    (opts: T[]) => {
      if (value) {
        const match = opts.find((o) => getOptionValue(o) === value);
        if (match) {
          const strValue = getOptionStringValue
            ? getOptionStringValue(match)
            : String(getOptionLabel(match));
          setQuery(strValue);
        }
      } else {
        setQuery("");
      }
    },
    [value, getOptionValue, getOptionStringValue, getOptionLabel]
  );

  React.useEffect(() => {
    let active = true;

    if (!open) {
      return;
    }
    
    // We only fetch if open and there is some query logic
    // Wait, if it opens by default we want to fetch with current query (maybe empty)
    
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await fetchFn(query);
        if (active) {
          setOptions(results);
        }
      } catch (err) {
        console.error("AsyncSelect fetch error:", err);
      } finally {
        if (active) setLoading(false);
      }
    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query, open, fetchFn, debounceMs]);

  // Sync query on external value change
  React.useEffect(() => {
    if (!open) {
      if (options.length > 0) syncQueryWithSelection(options);
      else {
        // If options not loaded but value provided, we will just fetch 1 off initially if needed OR just clear it.
        // Usually parent provides text fallback, or we fetch initial batch
        if (!value) setQuery("");
      }
    }
  }, [value, open, options, syncQueryWithSelection]);
  
  // Close on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        syncQueryWithSelection(options);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [options, syncQueryWithSelection]);

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
           <div className="absolute top-full z-[100] w-full mt-1 rounded-md border bg-white shadow-md outline-none">
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
                        const strValue = getOptionStringValue
                          ? getOptionStringValue(option)
                          : String(getOptionLabel(option));
                        setQuery(strValue);
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
