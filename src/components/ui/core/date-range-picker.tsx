import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "../../../lib/utils";
import { Button, type ButtonProps } from "../forms/button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
type CalendarComponentProps = React.ComponentProps<typeof Calendar>;
type PopoverContentProps = React.ComponentProps<typeof PopoverContent>;

export interface DatePickerWithRangeProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  date?: DateRange;
  defaultDate?: DateRange;
  setDate?: (date: DateRange | undefined) => void;
  onSelect?: (date: DateRange | undefined) => void;
  variant?: ButtonProps["variant"];
  placeholder?: string;
  triggerClassName?: string;
  calendarClassName?: string;
  cancelLabel?: string;
  applyLabel?: string;
  align?: PopoverContentProps["align"];
  numberOfMonths?: number;
  disabled?: CalendarComponentProps["disabled"];
  defaultMonth?: Date;
  showOutsideDays?: CalendarComponentProps["showOutsideDays"];
  triggerAriaLabel?: string;
  dialogAriaLabel?: string;
}

export function DatePickerWithRange({
  className,
  date,
  defaultDate,
  setDate,
  onSelect,
  variant = "outline",
  placeholder = "Pick a date range",
  triggerClassName,
  calendarClassName,
  cancelLabel = "Cancel",
  applyLabel = "Apply Range",
  align = "start",
  numberOfMonths = 2,
  disabled,
  defaultMonth,
  showOutsideDays = false,
  triggerAriaLabel,
  dialogAriaLabel = "Date range picker",
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    defaultDate,
  );

  // Keep track of the selected date while popover is open
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(
    date !== undefined ? date : internalDate,
  );
  //Date picker unique ID
  const datePickerID = React.useId();

  const activeDate = date !== undefined ? date : internalDate;

  React.useEffect(() => {
    if (date === undefined) {
      setInternalDate(defaultDate);
    }
  }, [date, defaultDate]);

  // Update temp date when popover opens
  React.useEffect(() => {
    if (isOpen) {
      setTempDate(activeDate);
    }
  }, [isOpen, activeDate]);

  const handleApply = () => {
    if (setDate) setDate(tempDate);
    if (!date) setInternalDate(tempDate);
    if (onSelect) onSelect(tempDate);
    setIsOpen(false);
  };

  const computedTriggerAriaLabel = React.useMemo(() => {
    if (triggerAriaLabel) return triggerAriaLabel;
    if (activeDate?.from && activeDate?.to) {
      return `Selected date range from ${format(activeDate.from, "MMMM d, yyyy")} to ${format(activeDate.to, "MMMM d, yyyy")}`;
    }
    if (activeDate?.from) {
      return `Selected start date ${format(activeDate.from, "MMMM d, yyyy")}`;
    }
    return placeholder;
  }, [triggerAriaLabel, activeDate, placeholder]);

  const activeDateLabel = React.useMemo(() => {
    if (activeDate?.from && activeDate?.to) {
      return (
        <>
          {format(activeDate.from, "LLL dd, y")} -{" "}
          {format(activeDate.to, "LLL dd, y")}
        </>
      );
    }
    if (activeDate?.from) {
      return format(activeDate.from, "LLL dd, y");
    }
    return <span>{placeholder}</span>;
  }, [activeDate, placeholder]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id={`date-${datePickerID}`}
            variant={variant}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !activeDate && "text-muted-foreground",
              triggerClassName,
            )}
            aria-label={computedTriggerAriaLabel}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {activeDateLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          forceMount
          className="w-auto p-0"
          align={align}
          aria-label={dialogAriaLabel}
        >
          <Calendar
            showOutsideDays={showOutsideDays}
            className={calendarClassName}
            mode="range"
            defaultMonth={defaultMonth ?? tempDate?.from ?? activeDate?.from}
            selected={tempDate}
            onSelect={setTempDate}
            numberOfMonths={numberOfMonths}
            disabled={disabled}
          />
          <div className="p-3 border-t flex justify-end gap-2 bg-muted/30">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              {cancelLabel}
            </Button>
            <Button size="sm" onClick={handleApply} className="gap-2">
              <Check className="w-4 h-4" /> {applyLabel}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
