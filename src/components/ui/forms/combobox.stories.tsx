import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Combobox } from "./combobox";

const meta: Meta<typeof Combobox> = {
  title: "Forms/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const frameworks = [
  { label: "Next.js", value: "next" },
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("react");
    return (
      <div className="w-[300px]">
        <Combobox
          options={frameworks}
          value={value}
          onChange={setValue}
          placeholder="Select framework..."
        />
      </div>
    );
  },
};
