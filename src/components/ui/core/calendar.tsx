import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useDayPicker } from "react-day-picker";

import { cn } from "../../../lib/utils";

import { buttonVariants } from "../forms/button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import "./calendar.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  showTodayDot?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  showTodayDot = true,
  ...props
}: CalendarProps) {
  const [direction, setDirection] = React.useState<"next" | "prev" | null>(
    null,
  );
  const baseYearRef = React.useRef<number>(new Date().getFullYear());
  const weeksRef = React.useRef<HTMLTableSectionElement | null>(null);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (weeksRef.current) {
      const newHeight = weeksRef.current.offsetHeight;
      setHeight(newHeight);
    }
    if (direction) {
      const timer = setTimeout(() => {
        setDirection(null);
      }, 220);

      return () => clearTimeout(timer);
    }
  }, [direction]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none relative", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month_caption:
          "flex justify-start w-full pt-1 items-center calendar-month-caption mb-2",

        nav: "space-x-1 flex items-center absolute right-3 top-3 z-10",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 rounded-full bg-transparent p-0 text-muted-foreground hover:text-foreground",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 rounded-full bg-transparent p-0 text-muted-foreground hover:text-foreground",
        ),

        month_grid: "w-full border-collapse mt-1",
        weekdays: "grid grid-cols-7",
        weekday:
          "text-muted-foreground text-[0.75rem] font-normal text-center h-10 w-9 flex items-center justify-center",

        week: "grid grid-cols-7",

        day: "relative flex items-center justify-center p-0 h-9 w-9",
        day_button: cn(
          "relative rdp-day_button h-9 w-9 rounded-full p-0 text-sm font-normal transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30",
        ),

        selected:
          "rdp-selected [&>button]:!bg-primary [&>button]:!text-primary-foreground [&>button]:rounded-full",

        today: cn("rdp-today font-medium", showTodayDot && "rdp-today-dot"),

        outside: "opacity-30",
        disabled: "text-muted-foreground opacity-30 pointer-events-none",
        hidden: "invisible",

        ...classNames,
      }}
      components={{
        MonthCaption: ({ calendarMonth }) => {
          const [openMonth, setOpenMonth] = React.useState(false);
          const [openYear, setOpenYear] = React.useState(false);
          const selectedYearRef = React.useRef<HTMLButtonElement | null>(null);
          const { goToMonth } = useDayPicker();
          const baseYear = baseYearRef.current;
          const displayMonth = calendarMonth.date;
          const currentYear = displayMonth.getFullYear();
          const currentMonth = displayMonth.getMonth();

          const minYear = props.startMonth
            ? props.startMonth.getFullYear()
            : baseYear - 100;

          const maxYear = props.endMonth
            ? props.endMonth.getFullYear()
            : baseYear + 100;

          const startYear = React.useMemo(
            () => Math.max(baseYear - 100, minYear),
            [baseYear, minYear],
          );
          const endYear = React.useMemo(
            () => Math.min(baseYear + 100, maxYear),
            [baseYear, maxYear],
          );

          const years = React.useMemo(
            () =>
              Array.from(
                { length: endYear - startYear + 1 },
                (_, i) => startYear + i,
              ),
            [startYear, endYear],
          );
          const months = React.useMemo(
            () =>
              Array.from({ length: 12 }).map((_, i) => ({
                label: new Date(0, i).toLocaleString("en-US", {
                  month: "long",
                }),
                value: i,
              })),
            [],
          );

          React.useEffect(() => {
            if (openYear) {
              setTimeout(() => {
                selectedYearRef.current?.scrollIntoView({
                  block: "center",
                  behavior: "smooth",
                });
              }, 50);
            }
          }, [openYear]);

          return (
            <div className="flex items-center gap-2 pl-1">
              {/* Month Popover */}
              <Popover
                open={openMonth}
                onOpenChange={(val) => {
                  setOpenMonth(val);
                  if (val) setOpenYear(false);
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="h-8 px-2 text-sm font-semibold hover:bg-accent rounded-md flex items-center gap-1"
                  >
                    {/* eslint-disable-next-line security/detect-object-injection */}
                    {months[currentMonth]?.label}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </PopoverTrigger>

                <PopoverContent forceMount className="w-48 p-2 z-50">
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => {
                          if (m.value !== currentMonth) {
                            setDirection(
                              m.value > currentMonth ? "next" : "prev",
                            );
                            goToMonth(new Date(currentYear, m.value, 1));
                          }
                          setOpenMonth(false);
                        }}
                        className={cn(
                          "text-sm p-2 rounded-md transition-colors",
                          currentMonth === m.value
                            ? "bg-primary text-primary-foreground hover:bg-primary"
                            : "hover:bg-accent",
                        )}
                      >
                        {m.label.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Year Popover */}
              <Popover
                open={openYear}
                onOpenChange={(val) => {
                  setOpenYear(val);
                  if (val) setOpenMonth(false);
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="h-8 px-2 text-sm font-semibold hover:bg-accent rounded-md flex items-center gap-1"
                  >
                    {currentYear}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  forceMount
                  className="w-56 h-60 overflow-y-auto p-2 z-50"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        ref={year === currentYear ? selectedYearRef : null}
                        onClick={() => {
                          if (year !== currentYear) {
                            setDirection(year > currentYear ? "next" : "prev");
                          }
                          goToMonth(new Date(year, currentMonth, 1));
                          setOpenYear(false);
                        }}
                        className={cn(
                          "text-sm p-2 rounded-md transition-colors",
                          year === currentYear
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent",
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          );
        },

        Weeks: ({ className, style, ...weekProps }) => {
          return (
            <tbody
              ref={weeksRef}
              className={className}
              {...weekProps}
              style={{
                ...style,
                height,
                overflow: "hidden",
                transition: "height 220ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {weekProps.children}
            </tbody>
          );
        },

        Month: ({ children }) => {
          return (
            <div
              className={cn(
                "flex flex-col gap-2 calendar-month-wrapper",
                direction && `rdp-month direction-${direction}`,
              )}
            >
              {children}
            </div>
          );
        },

        Chevron: ({ orientation, className }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;

          return (
            <Icon
              className={cn("h-4 w-4 cursor-pointer", className)}
              onClick={() =>
                setDirection(orientation === "left" ? "prev" : "next")
              }
            />
          );
        },
      }}
      formatters={{
        formatWeekdayName: (date) =>
          date.toLocaleDateString("en-US", { weekday: "narrow" }),
        ...props.formatters,
      }}
      startMonth={
        props.startMonth || new Date(new Date().getFullYear() - 100, 0)
      }
      endMonth={props.endMonth || new Date(new Date().getFullYear() + 100, 11)}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
