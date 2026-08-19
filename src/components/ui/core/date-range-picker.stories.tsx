import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateRange } from "react-day-picker";
import { expect, within, userEvent, waitFor } from "storybook/test";
import { DatePickerWithRange } from "./date-range-picker";

type DateRangePickerStoryArgs = React.ComponentProps<
  typeof DatePickerWithRange
>;

function formatRangeLabel(range: DateRange | undefined) {
  if (!range?.from) return "No range selected";
  if (!range.to)
    return `Selected from ${range.from.toLocaleDateString("en-IN")}`;

  return `${range.from.toLocaleDateString("en-IN")} - ${range.to.toLocaleDateString("en-IN")}`;
}

function CenteredStory({ children }: { children: React.ReactNode }) {
  return <div className="p-8 flex items-center justify-center">{children}</div>;
}

function ControlledDateRangeStory(args: DateRangePickerStoryArgs) {
  const [date, setDate] = React.useState<DateRange | undefined>(args.date);

  React.useEffect(() => {
    setDate(args.date);
  }, [args.date]);

  return (
    <CenteredStory>
      <div className="grid gap-3">
        <DatePickerWithRange
          {...args}
          date={date}
          setDate={setDate}
          showOutsideDays={args.showOutsideDays}
        />
        <p className="text-sm text-muted-foreground">
          {formatRangeLabel(date)}
        </p>
      </div>
    </CenteredStory>
  );
}

/**
 * A pre-composed date range picker with a trigger button that opens a calendar popover.
 *
 * The trigger supports button variants and range changes are committed only when users click Apply.
 */
const meta = {
  title: "UI/Core/DateRangePicker",
  component: DatePickerWithRange,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A composed date range picker built from the library `Popover`, `Calendar`, and `Button` primitives. " +
          "Users preview a temporary range inside the popover and the committed value updates only when they click Apply.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    defaultDate: {
      from: new Date(2026, 0, 20),
      to: new Date(2026, 1, 9),
    },
    variant: "outline",
    placeholder: "Pick a date",
    cancelLabel: "Cancel",
    applyLabel: "Apply Range",
    align: "start",
    numberOfMonths: 2,
    triggerClassName: "",
    calendarClassName: "",
    showOutsideDays: false,
    dialogAriaLabel: "Date range picker dialog",
  },
  argTypes: {
    date: {
      control: false,
      description:
        "Controlled committed range value. When provided, the trigger label reflects this range and the parent component is responsible for updating it.",
      table: { category: "State" },
    },
    defaultDate: {
      control: false,
      description:
        "Initial uncontrolled range used when `date` is not provided. This is applied only on first render or when the uncontrolled story resets.",
      table: { category: "State" },
    },
    setDate: {
      control: false,
      description:
        "Controlled state setter for the committed range. Use together with `date` for controlled usage.",
      table: { category: "Events" },
    },
    onSelect: {
      control: false,
      description:
        "Callback fired with the committed range when the user clicks Apply.",
      table: { category: "Events" },
    },
    variant: {
      control: "select",
      options: [
        "primary",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "Visual variant for the trigger button.",
      table: { category: "Appearance", defaultValue: { summary: "outline" } },
    },
    placeholder: {
      control: "text",
      description:
        "Placeholder text shown in the trigger when no committed range is selected.",
      table: { category: "Content" },
    },
    cancelLabel: {
      control: "text",
      description: "Label used for the secondary footer action.",
      table: { category: "Content" },
    },
    applyLabel: {
      control: "text",
      description:
        "Label used for the primary footer action that commits the temporary range.",
      table: { category: "Content" },
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Horizontal alignment of the popover content.",
      table: { category: "Layout", defaultValue: { summary: "start" } },
    },
    numberOfMonths: {
      control: { type: "number", min: 1, max: 3, step: 1 },
      description:
        "Number of calendar months shown inside the popover calendar.",
      table: { category: "Layout", defaultValue: { summary: "2" } },
    },
    showOutsideDays: {
      control: "boolean",
      description:
        "Whether to render days from adjacent months inside the current month grid.",
      table: { category: "Appearance", defaultValue: { summary: "false" } },
    },
    triggerAriaLabel: {
      control: "text",
      description: "Accessible name applied to the trigger button.",
      table: { category: "Accessibility" },
    },
    dialogAriaLabel: {
      control: "text",
      description: "Accessible name applied to the popover dialog surface.",
      table: { category: "Accessibility" },
    },
    disabled: {
      control: false,
      description:
        "DayPicker matcher used to disable specific dates or ranges in the calendar.",
      table: { category: "Behavior" },
    },
    defaultMonth: {
      control: false,
      description:
        "Month shown when the popover opens before any date has been selected.",
      table: { category: "Behavior" },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the outer wrapper.",
      table: { category: "Styling" },
    },
    triggerClassName: {
      control: "text",
      description: "Additional CSS classes applied to the trigger button.",
      table: { category: "Styling" },
    },
    calendarClassName: {
      control: "text",
      description: "Additional CSS classes passed to the internal calendar.",
      table: { category: "Styling" },
    },
    children: { table: { disable: true } },
    id: { table: { disable: true } },
    style: { table: { disable: true } },
    title: { table: { disable: true } },
    role: { table: { disable: true } },
    onClick: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onSelectCapture: { table: { disable: true } },
  },
} satisfies Meta<DateRangePickerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opens the popover and exposes the calendar footer actions. */
export const Default: Story = {
  args: {
    defaultDate: undefined,
  },
  render: (args) => (
    <CenteredStory>
      <DatePickerWithRange {...args} showOutsideDays={args.showOutsideDays} />
    </CenteredStory>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /pick a date/i });

    expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(
        within(document.body).getByRole("button", { name: /apply range/i }),
      ).toBeInTheDocument();
      expect(
        within(document.body).getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });
  },
};

/** Starts with a committed March 2026 range. */
export const PreFilled: Story = {
  render: (args) => (
    <CenteredStory>
      <DatePickerWithRange {...args} />
    </CenteredStory>
  ),
  args: {
    date: {
      from: new Date(2026, 2, 1),
      to: new Date(2026, 2, 31),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", {
        name: /selected date range from march 1, 2026 to march 31, 2026/i,
      }),
    ).toBeInTheDocument();
  },
};

/** Controlled example with an external value readout below the trigger. */
export const Controlled: Story = {
  render: (args) => (
    <ControlledDateRangeStory
      {...args}
      showOutsideDays={args.showOutsideDays}
    />
  ),
  args: {
    date: {
      from: new Date(2026, 0, 20),
      to: new Date(2026, 1, 9),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Uses controlled state so the committed range is reflected in a readout below the trigger.",
      },
    },
  },
};

/** Cancel closes the popover without committing a temporary range selection. */
export const CancelDoesNotCommit: Story = {
  render: (args) => (
    <ControlledDateRangeStory
      {...args}
      showOutsideDays={args.showOutsideDays}
    />
  ),
  args: {
    date: {
      from: new Date(2026, 2, 1),
      to: new Date(2026, 2, 31),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");
    const initialLabel = trigger.textContent;

    await userEvent.click(trigger);

    const body = within(document.body);
    
    // Wait for the popover to be fully open
    const dialog = await body.findByRole("dialog", { name: /date range picker/i });
    const dialogScope = within(dialog);

    // Verify correct month and year are shown in the dialog
    await dialogScope.findByText(/march/i);
    // Find all 2026 text/buttons in dialog and ensure at least one exists
    const years = await dialogScope.findAllByText(/2026/i);
    expect(years.length).toBeGreaterThan(0);
    
    await dialogScope.findByRole("button", { name: /apply range/i });

    // Find day buttons specifically within the dialog
    // We use findAllByRole and take the first match to ensure we get March (the first month)
    const day10s = await dialogScope.findAllByRole("button", { name: /^10$|10th/ });
    const day15s = await dialogScope.findAllByRole("button", { name: /^15$|15th/ });
    
    await userEvent.click(day10s[0]);
    await userEvent.click(day15s[0]);
    await userEvent.click(dialogScope.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(canvas.getByRole("button").textContent).toBe(initialLabel);
    });
  },
};




