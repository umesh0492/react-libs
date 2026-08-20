import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { MultiSelect, Option } from "./multi-select";

const meta: Meta<typeof MultiSelect> = {
  title: "Forms/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const sampleOptions: Option[] = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Solid", value: "solid" },
  { label: "Next.js", value: "nextjs" },
  { label: "Remix", value: "remix" },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(["react", "nextjs"]);
    return (
      <div className="w-[360px]">
        <MultiSelect
          options={sampleOptions}
          value={selected}
          onChange={setSelected}
          placeholder="Choose frameworks..."
        />
      </div>
    );
  },
};

export const MaxCountOverflow: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([
      "react",
      "vue",
      "svelte",
      "angular",
      "solid",
    ]);
    return (
      <div className="w-[360px]">
        <MultiSelect
          options={sampleOptions}
          value={selected}
          onChange={setSelected}
          maxCount={2}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    value: ["react"],
    disabled: true,
  },
  render: (args) => (
    <div className="w-[360px]">
      <MultiSelect {...args} />
    </div>
  ),
};
