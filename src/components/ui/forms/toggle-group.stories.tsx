// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "storybook/test";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const meta = {
  title: "UI/Forms/ToggleGroup",
  component: ToggleGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A grouped set of toggle buttons built on Radix UI Toggle Group. Use `type="single"` for mutually exclusive choices like alignment, or `type="multiple"` for independent formatting options.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      description:
        "Selection mode for the group. `single` allows one active item, while `multiple` allows many.",
      table: { category: "Behavior" },
    },
    variant: {
      control: "radio",
      options: ["default", "outline"],
      description:
        "Visual style applied to all items unless overridden per item.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    size: {
      control: "radio",
      options: ["default", "sm", "lg"],
      description: "Size applied to all items unless overridden per item.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction for the entire toggle group.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    rovingFocus: {
      control: "boolean",
      description:
        "Enables Radix roving focus so arrow keys move focus between items.",
      table: { category: "Accessibility", defaultValue: { summary: "true" } },
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Layout and keyboard navigation axis for the group.",
      table: { category: "Layout", defaultValue: { summary: "horizontal" } },
    },
    loop: {
      control: "boolean",
      description: "Whether keyboard navigation wraps from last item to first.",
      table: { category: "Accessibility" },
    },
    dir: {
      control: "radio",
      options: ["ltr", "rtl"],
      description: "Text direction used by keyboard navigation.",
      table: { category: "Layout", defaultValue: { summary: "ltr" } },
    },
    defaultValue: {
      control: "object",
      description:
        "Initial selected value for `single`, or array of values for `multiple` mode.",
      table: { category: "State" },
    },
    value: {
      control: "object",
      description:
        "Controlled selected value for `single`, or array of values for `multiple` mode.",
      table: { category: "State" },
    },
    className: {
      control: "text",
      description: "Additional classes applied to the group root.",
      table: { category: "Styling" },
    },
    onValueChange: {
      action: "onValueChange",
      description:
        "Called when the selected value changes. Emits a string in `single` mode and an array in `multiple` mode.",
      table: { category: "Events" },
    },
  },
  args: {
    type: "single",
    variant: "default",
    size: "default",
    disabled: false,
    rovingFocus: true,
    orientation: "horizontal",
    dir: "ltr",
    defaultValue: "center",
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

type ToggleGroupStoryProps = React.ComponentProps<typeof ToggleGroup>;

const AlignmentToggleGroupDemo = ({
  value: controlledValue,
  defaultValue = "center",
  onValueChange,
  ...args
}: ToggleGroupStoryProps) => {
  const [value, setValue] = React.useState(controlledValue ?? defaultValue);

  React.useEffect(() => {
    setValue(controlledValue ?? defaultValue);
  }, [controlledValue, defaultValue]);

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className="p-4 flex items-center justify-center">
      <ToggleGroup
        {...args}
        type={args.type}
        value={value}
        onValueChange={handleValueChange}
      >
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

const FormattingToggleGroupDemo = ({
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  ...args
}: ToggleGroupStoryProps) => {
  const [value, setValue] = React.useState(controlledValue ?? defaultValue);

  React.useEffect(() => {
    setValue(controlledValue ?? defaultValue);
  }, [controlledValue, defaultValue]);

  const handleValueChange = (nextValue: string[]) => {
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className="p-4 flex items-center justify-center">
      <ToggleGroup
        {...args}
        type="multiple"
        value={value}
        onValueChange={handleValueChange}
      >
        <ToggleGroupItem value="bold" aria-label="Bold">
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic" className="italic">
          I
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-label="Underline"
          className="underline"
        >
          U
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export const Default: Story = {
  args: {
    type: "single",
    defaultValue: "center",
  },
  render: (args) => <AlignmentToggleGroupDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // ToggleGroup type="single" renders items as role="radio" inside a radiogroup
    const leftBtn = canvas.getByRole("radio", { name: /align left/i });
    const centerBtn = canvas.getByRole("radio", { name: /align center/i });

    // Center is default
    expect(centerBtn).toHaveAttribute("data-state", "on");

    // Click left
    await userEvent.click(leftBtn);
    expect(leftBtn).toHaveAttribute("data-state", "on");
    expect(centerBtn).toHaveAttribute("data-state", "off");

    // Click center
    await userEvent.click(centerBtn);
    expect(centerBtn).toHaveAttribute("data-state", "on");
  },
};

export const MultipleSelection: Story = {
  args: {
    type: "multiple",
    defaultValue: [],
  },
  render: (args) => <FormattingToggleGroupDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const boldBtn = canvas.getByRole("button", { name: /bold/i });
    const italicBtn = canvas.getByRole("button", { name: /italic/i });
    await userEvent.click(boldBtn);
    await userEvent.click(italicBtn);
    expect(boldBtn).toHaveAttribute("data-state", "on");
    expect(italicBtn).toHaveAttribute("data-state", "on");
  },
};
