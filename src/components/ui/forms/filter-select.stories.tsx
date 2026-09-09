import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent, waitFor } from "storybook/test";
import { FilterSelect } from "./filter-select";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Archived", value: "archived" },
  { label: "Suspended", value: "suspended" },
];

const meta = {
  title: "UI/Forms/FilterSelect",
  component: FilterSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    options: statusOptions,
    onChange: () => {},
  },
} satisfies Meta<typeof FilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-8 w-[280px]">
      <FilterSelect
        placeholder="Filter by Status..."
        options={statusOptions}
        onChange={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dropdown
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);

    // Wait for options
    await waitFor(
      () =>
        expect(
          document.querySelector('[role="listbox"]') ||
            document.querySelector('[role="option"]'),
        ).toBeTruthy(),
    );
  },
};
export const NoOptionsPassed: Story = {
  render: () => (
    <div className="p-8 w-[280px]">
      <FilterSelect
        placeholder="Filter by Status..."
        options={[]}
        onChange={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dropdown
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);

    // Wait for options
    await waitFor(
      () =>
        expect(
          document.querySelector('[role="listbox"]') ||
            document.querySelector('[role="option"]'),
        ).toBeTruthy(),
    );
  },
};

export const WithPreselected: Story = {
  render: () => (
    <div className="p-8 w-[280px]">
      <FilterSelect
        placeholder="Filter by Status..."
        options={statusOptions}
        value="active"
        onChange={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Active")).toBeInTheDocument();
  },
};
