// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateRange } from "react-day-picker";
import { expect, within, userEvent } from "storybook/test";
import { Calendar } from "./calendar";

const DEFAULT_MONTH = new Date(2026, 3);
type CalendarStoryArgs = React.ComponentProps<typeof Calendar>;

function toDate(value: unknown, fallback = new Date()) {
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string" && value) return new Date(value);
  return fallback;
}

function SingleCalendarStory(args: CalendarStoryArgs) {
  const [selected, setSelected] = React.useState<Date | undefined>(
    args.selected as Date | undefined,
  );

  React.useEffect(() => {
    setSelected(args.selected as Date | undefined);
  }, [args.selected]);

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-card">
      <Calendar
        {...args}
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
      {selected && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Selected:{" "}
          {selected.toLocaleDateString("en-IN", { dateStyle: "medium" })}
        </p>
      )}
    </div>
  );
}
function RangeCalendarStory(args: CalendarStoryArgs) {
  const [range, setRange] = React.useState<DateRange | undefined>(
    args.selected as DateRange | undefined,
  );

  React.useEffect(() => {
    setRange(args.selected as DateRange | undefined);
  }, [args.selected]);

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-card">
      <Calendar {...args} mode="range" selected={range} onSelect={setRange} />
      {range?.from && range?.to && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {range.from.toLocaleDateString()} to {range.to.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function MultipleCalendarStory(args: CalendarStoryArgs) {
  const [days, setDays] = React.useState<Date[]>(
    (args.selected as Date[]) ?? [],
  );

  React.useEffect(() => {
    setDays((args.selected as Date[]) ?? []);
  }, [args.selected]);

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-card">
      <Calendar {...args} mode="multiple" selected={days} onSelect={setDays} />
      {days.length > 0 && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {days.length} day{days.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}

function DisabledPastCalendarStory(
  args: CalendarStoryArgs & { minDate?: Date | number | string },
) {
  const { minDate, ...calendarArgs } = args;

  return (
    <SingleCalendarStory
      {...calendarArgs}
      disabled={{ before: toDate(minDate) }}
    />
  );
}
function DisabledFutureCalendarStory(
  args: CalendarStoryArgs & { maxDate?: Date | number | string },
) {
  const { maxDate, ...calendarArgs } = args;

  return (
    <SingleCalendarStory
      {...calendarArgs}
      disabled={{ after: toDate(maxDate) }}
    />
  );
}

/**
 * Monthly calendar widget built on `react-day-picker` v9.
 *
 * **Phase 2 fixes (complete v9 classNames rewrite):**
 * - 7-column grid alignment — weekday headers now align perfectly with date rows
 * - Navigation `[← Month Year →]` — arrows flank the label via `nav: absolute inset-x-0`
 * - Selected date is a **perfect circle** (`rounded-full`)
 * - Today's date shows a **dot indicator** below the number (via `calendar.css ::after`)
 * - `captionLayout="dropdown"` enables direct month/year jump menus
 * - Range styling: start/end = filled circles; middle = soft accent fill, no radius
 */
const meta = {
  title: "UI/Core/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Full monthly calendar from `react-day-picker` v9 with Tailwind theming. " +
          'Pass `mode="single"` for a date input, `mode="range"` for date ranges. ' +
          'Use `captionLayout="dropdown"` to let users jump directly to a month/year.',
      },
    },
  },
  tags: ["autodocs"],
  args: {
    showOutsideDays: true,
    defaultMonth: DEFAULT_MONTH,
    initialFocus: true,
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "range", "multiple"],
      description: "Selection mode.",
      table: { category: "Behaviour", defaultValue: { summary: "single" } },
    },
    showOutsideDays: {
      control: "boolean",
      description: "Show days from adjacent months.",
      table: { category: "Appearance", defaultValue: { summary: "true" } },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single-day picker — click any date to select.
 * Today shows a dot indicator; selected date is a perfect circle.
 */
export const SingleDay: Story = {
  render: (args) => <SingleCalendarStory {...args} today={Date.now()} />,
  args: {
    mode: "single",
  },
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  },
};

/**
 * Today is pre-selected and highlighted as a circle.
 * The dot indicator (from `calendar.css`) appears below today's date number.
 */
export const TodaySelected: Story = {
  render: (args) => <SingleCalendarStory {...args} />,
  args: {
    mode: "single",
    selected: new Date(),
    defaultMonth: new Date(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Today is selected (filled circle). The dot below today's number is always visible.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[aria-selected="true"]')).toBeTruthy();
  },
};

/**
 * Range selection — two-month view with start/end circles and soft middle fill.
 * Fix: start and end are `rounded-full` circles; middle days use `bg-primary/10`.
 */
export const RangeSelection: Story = {
  render: (args) => <RangeCalendarStory {...args} />,
  args: {
    mode: "range",
    numberOfMonths: 2,
    selected: {
      from: new Date(2026, 3, 5),
      to: new Date(2026, 3, 18),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Range mode; start/end are filled circles, middle days use a soft `bg-primary/10`.",
      },
    },
  },
};

/**
 * Dropdown navigation — `captionLayout="dropdown"` renders native select elements
 * for month and year so users can jump directly to any date without paging.
 */
export const WithDropdownNavigation: Story = {
  render: (args) => <SingleCalendarStory {...args} />,
  args: {
    mode: "single",
    captionLayout: "dropdown",
    startMonth: new Date(2025, 0),
    endMonth: new Date(2026, 11),
  },
  parameters: {
    docs: {
      description: {
        story:
          '`captionLayout="dropdown"` — Month and Year are native `<select>` dropdowns ' +
          "so users can jump directly to any month between `startMonth` and `endMonth`. " +
          "Styled via `.rdp-dropdown` in `calendar.css`.",
      },
    },
  },
};

/** Disable all past dates (booking / scheduling use-case). */
export const DisabledPast: Story = {
  render: (args) => <DisabledPastCalendarStory {...args} />,
  args: {
    mode: "single",
    minDate: new Date(),
  },
  argTypes: {
    minDate: {
      control: "date",
      description: "Disable all dates before this date.",
      table: {
        category: "Behaviour",
        defaultValue: { summary: "today" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dates before the chosen control date are disabled (dimmed and unclickable). If no date is provided, it defaults to today.",
      },
    },
  },
};
export const DisabledFuture: Story = {
  render: (args) => <DisabledFutureCalendarStory {...args} />,
  args: {
    mode: "single",
    maxDate: new Date(),
  },
  argTypes: {
    maxDate: {
      control: "date",
      description: "Disable all dates after this date.",
      table: {
        category: "Behaviour",
        defaultValue: { summary: "today" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dates after the chosen control date are disabled (dimmed and unclickable). If no date is provided, it defaults to today.",
      },
    },
  },
};

/** Multiple independent day selection. */
export const MultipleSelection: Story = {
  render: (args) => <MultipleCalendarStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: "Click multiple dates to select them independently.",
      },
    },
  },
};
