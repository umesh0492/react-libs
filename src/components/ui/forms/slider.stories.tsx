// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "storybook/test";
import { Slider } from "./slider";
import { cn } from "../../../lib/utils";

/**
 * A range slider built on Radix UI Slider.
 *
 * The component renders one thumb per entry in the `value` or `defaultValue`
 * array, so single-value and multi-value sliders share the same API.
 */
const meta = {
  title: "UI/Forms/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Radix UI Slider with touch support and keyboard navigation. " +
          "Pass `value={[n]}` for a single-thumb slider and `value={[min, max]}` for a range slider.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "object",
      description:
        "Initial thumb value array for uncontrolled usage. Pass one value for a single slider or multiple values for range sliders.",
      table: { category: "State" },
    },
    value: {
      control: "object",
      description:
        "Controlled thumb value array. Use with `onValueChange` when the parent owns the slider state.",
      table: { category: "State" },
    },
    min: {
      control: "number",
      description: "Minimum allowed value.",
      table: { category: "Range", defaultValue: { summary: 0 } },
    },
    max: {
      control: "number",
      description: "Maximum allowed value.",
      table: { category: "Range", defaultValue: { summary: 100 } },
    },
    step: {
      control: "number",
      description:
        "Amount the value changes by during keyboard or pointer interaction.",
      table: { category: "Range", defaultValue: { summary: 1 } },
    },
    minStepsBetweenThumbs: {
      control: "number",
      description:
        "Minimum number of steps enforced between thumbs in multi-value sliders.",
      table: { category: "Range", defaultValue: { summary: 0 } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the slider and all of its thumbs.",
      table: { category: "State", defaultValue: { summary: false } },
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Sets the slider axis.",
      table: { category: "Layout", defaultValue: { summary: "horizontal" } },
    },
    dir: {
      control: "radio",
      options: ["ltr", "rtl"],
      description: "Text direction used for keyboard and pointer movement.",
      table: { category: "Layout", defaultValue: { summary: "ltr" } },
    },
    inverted: {
      control: "boolean",
      description: "Reverses the filled range direction.",
      table: { category: "Layout", defaultValue: { summary: false } },
    },
    name: {
      control: "text",
      description:
        "HTML form name used when the slider participates in form submission.",
      table: { category: "HTML" },
    },
    className: {
      control: "text",
      description: "Additional classes applied to the slider root.",
      table: { category: "Styling" },
    },
    thumbLabels: {
      control: "object",
      description:
        "Accessible labels applied to each rendered thumb. Provide one label per thumb for screen reader support.",
      table: { category: "Accessibility" },
    },
    onValueChange: {
      action: "onValueChange",
      description:
        "Called whenever the slider value changes during interaction.",
      table: { category: "Events" },
    },
    onValueCommit: {
      action: "onValueCommit",
      description:
        "Called when the user finishes an interaction and commits the new value.",
      table: { category: "Events" },
    },
  },
  args: {
    defaultValue: [50],
    thumbLabels: ["Volume"],
    min: 0,
    max: 100,
    step: 1,
    minStepsBetweenThumbs: 0,
    disabled: false,
    orientation: "horizontal",
    dir: "ltr",
    inverted: false,
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

type SliderDemoProps = React.ComponentProps<typeof Slider> & {
  label?: string;
  format?: (v: number) => string;
};

const SliderDemo = ({
  value: controlledValue,
  defaultValue = [50],
  label = "Volume",
  format = (v: number) => `${v}%`,
  onValueChange,
  orientation = "horizontal",
  ...props
}: SliderDemoProps) => {
  const [value, setValue] = React.useState(controlledValue ?? defaultValue);
  const isVertical = orientation === "vertical";

  React.useEffect(() => {
    setValue(controlledValue ?? defaultValue);
  }, [controlledValue, defaultValue]);

  const handleValueChange = (nextValue: number[]) => {
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div
      className={cn(
        "p-6",
        isVertical ? "flex h-80 items-center gap-6" : "w-80 space-y-3",
      )}
    >
      <div
        className={cn(
          "text-sm",
          isVertical
            ? "flex min-w-28 flex-col gap-1"
            : "flex justify-between",
        )}
      >
        <span>{label}</span>
        <span className="font-medium tabular-nums text-muted-foreground">
          {value.map(format).join(" - ")}
        </span>
      </div>
      <div className={cn(isVertical ? "flex h-full items-center" : "")}>
        <Slider
          {...props}
          orientation={orientation}
          className={cn(isVertical ? "h-full" : "", props.className)}
          value={value}
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
};

/** Single-thumb volume slider. */
export const Default: Story = {
  render: (args) => <SliderDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
    await userEvent.click(slider);
    await userEvent.keyboard("[ArrowRight][ArrowRight][ArrowRight]");
    const newVal = parseInt(slider.getAttribute("aria-valuenow") || "50");
    expect(newVal).toBeGreaterThan(50);
  },
};

/** Dual-thumb range slider for min/max selection. */
export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    thumbLabels: ["Minimum price", "Maximum price"],
    min: 0,
    max: 100,
    step: 5,
    minStepsBetweenThumbs: 0,
    disabled: false,
    orientation: "horizontal",
    dir: "ltr",
    inverted: false,
  },
  render: (args) => (
    <div className="w-80 space-y-3 p-6">
      <SliderDemo {...args} label="Price Range" format={(v) => `Rs ${v}k`} />
      <p className="text-center text-xs text-muted-foreground">
        Drag either handle independently
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sliders = canvas.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "20");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "80");
  },
};

/** Keyboard-navigable full-range slider (Home -> 0, End -> 100). */
export const Stepped: Story = {
  args: {
    defaultValue: [0],
    thumbLabels: ["Brightness"],
    min: 0,
    max: 100,
    step: 1,
    minStepsBetweenThumbs: 0,
    disabled: false,
    orientation: "horizontal",
    dir: "ltr",
    inverted: false,
  },
  render: (args) => <SliderDemo {...args} label="Brightness" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider");
    await userEvent.click(slider);
    await userEvent.keyboard("[End]");
    expect(parseInt(slider.getAttribute("aria-valuenow") || "0")).toBe(100);
    await userEvent.keyboard("[Home]");
    expect(parseInt(slider.getAttribute("aria-valuenow") || "50")).toBe(0);
  },
};

/** Triple-thumb story to demonstrate more than two handles. */
export const TripleHandle: Story = {
  args: {
    defaultValue: [20, 50, 80],
    thumbLabels: [
      "Lower temperature threshold",
      "Target temperature",
      "Upper temperature threshold",
    ],
    min: 0,
    max: 100,
    step: 1,
    minStepsBetweenThumbs: 0,
    disabled: false,
    orientation: "horizontal",
    dir: "ltr",
    inverted: false,
  },
  render: (args) => (
    <div className="w-80 space-y-3 p-6">
      <SliderDemo
        {...args}
        label="Temperature Bands"
        format={(v) => `${v} deg`}
      />
      <p className="text-center text-xs text-muted-foreground">
        Three thumbs from value={`[20, 50, 80]`}
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("slider")).toHaveLength(3);
  },
};
