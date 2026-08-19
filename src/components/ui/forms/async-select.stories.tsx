import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AsyncSelect } from "./async-select";

const meta = {
  title: "Forms/AsyncSelect",
  component: AsyncSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AsyncSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data and fetcher
interface MockUser {
  id: string;
  name: string;
  email: string;
}

const mockUsers: MockUser[] = [
  { id: "1", name: "Alice Smith", email: "alice@example.com" },
  { id: "2", name: "Bob Johnson", email: "bob@example.com" },
  { id: "3", name: "Charlie Davis", email: "charlie@example.com" },
  { id: "4", name: "Diana Prince", email: "diana@example.com" },
  { id: "5", name: "Evan Wright", email: "evan@example.com" },
];

const mockFetch = async (query: string): Promise<MockUser[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve(mockUsers);
      } else {
        const lowerQ = query.toLowerCase();
        resolve(
          mockUsers.filter(
            (u) => u.name.toLowerCase().includes(lowerQ) || u.email.toLowerCase().includes(lowerQ)
          )
        );
      }
    }, 500); // simulate network delay
  });
};

export const Default: Story = {
  args: {} as any,
  render: () => {
    const [val, setVal] = React.useState("");
    return (
      <div className="w-[400px]">
        <div className="mb-4 text-sm text-slate-500">Selected ID: {val || "None"}</div>
        <AsyncSelect<MockUser>
          value={val}
          onChange={(v) => setVal(v)}
          fetchFn={mockFetch}
          getOptionValue={(u) => u.id}
          getOptionLabel={(u) => (
            <div className="flex flex-col">
              <span className="font-medium text-slate-900">{u.name}</span>
              <span className="text-xs text-slate-500">{u.email}</span>
            </div>
          )}
          getOptionStringValue={(u) => u.name}
          placeholder="Search users..."
          searchPlaceholder="Type name or email..."
        />
      </div>
    );
  },
};

export const InitialValue: Story = {
  args: {} as any,
  render: () => {
    const [val, setVal] = React.useState("3"); // Charlie Davis
    return (
      <div className="w-[400px]">
        <div className="mb-4 text-sm text-slate-500">Selected ID: {val || "None"}</div>
        <AsyncSelect<MockUser>
          value={val}
          onChange={(v) => setVal(v)}
          fetchFn={mockFetch}
          getOptionValue={(u) => u.id}
          getOptionLabel={(u) => (
            <div className="flex flex-col">
              <span className="font-medium text-slate-900">{u.name}</span>
              <span className="text-xs text-slate-500">{u.email}</span>
            </div>
          )}
          getOptionStringValue={(u) => u.name}
          placeholder="Search users..."
        />
      </div>
    );
  },
};
