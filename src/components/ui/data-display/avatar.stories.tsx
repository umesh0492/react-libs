// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "./avatar";

/**
 * User avatar with image and fallback initials.
 *
 * **Phase 3 fixes:**
 * - Added `size` prop (`xs` | `sm` | `default` | `lg` | `xl`) via CVA — no longer need manual className sizes
 * - `AvatarFallback` text scales automatically with parent `size` (inherits `text-[1em]`)
 * - Added `AvatarGroup` component with `ring-2 ring-background` gap and overflow `+N` badge
 */
const meta = {
  title: "UI/Data-display/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Radix UI Avatar with 5 size variants. Fallback text scales with size automatically. " +
          "Use `AvatarGroup` for stacked overlap with ring gap.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl"],
      description: "Pre-set size from the CVA size token.",
      table: { category: "Appearance", defaultValue: { summary: "default" } },
    },
    className: {
      control: "text",
      description: "Additional CSS classes.",
      table: { category: "Styling" },
    },
  },
  args: { size: "default" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Avatar with an image source. */
export const WithImage: Story = {
  render: (args) => (
    <div className="p-4 flex items-center gap-3">
      <Avatar {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SC")).toBeInTheDocument();
  },
};

/** Fallback initials — shown when the image fails to load. */
export const Fallback: Story = {
  render: (args) => (
    <div className="p-4 flex items-center gap-3">
      <Avatar {...args}>
        <AvatarImage src="" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("JD")).toBeInTheDocument();
  },
};

/**
 * All five sizes — fallback text scales with size (no manual text-xs override needed).
 * Fix: `AvatarFallback` now uses `text-[1em]` to inherit the parent's font-size.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="p-4 flex items-end gap-4">
      {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <Avatar size={size}>
            <AvatarImage src="" alt="" />
            <AvatarFallback>{size.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Size prop replaces manual `className` sizing. Text auto-scales.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("XS")).toBeInTheDocument();
    expect(canvas.getByText("XL")).toBeInTheDocument();
  },
};

/**
 * AvatarGroup — overlaps avatars with ring-2 gap.
 * Fix: `ring-2 ring-background` creates a visible gap so circles don't visually merge.
 * `max` prop hides excess avatars and shows `+N` overflow badge.
 */
export const GroupWithOverflow: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">
          5 avatars, max=3 → shows +2
        </p>
        <AvatarGroup max={3}>
          {["AK", "BJ", "CM", "DN", "EP"].map((initials) => (
            <Avatar key={initials}>
              <AvatarImage src="" alt="" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">All shown (no max)</p>
        <AvatarGroup>
          {["AK", "BJ", "CM"].map((initials) => (
            <Avatar key={initials}>
              <AvatarImage src="" alt="" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 'AK' appears in both groups (overflow group hidden + all-shown group visible)
    // use getAllByText since multiple instances exist
    expect(canvas.getAllByText("AK").length).toBeGreaterThan(0);
    expect(canvas.getByText("+2")).toBeInTheDocument();
  },
};

/** Large avatar in a user profile card context. */
export const ProfileCard: Story = {
  render: (args) => (
    <div className="p-5 border rounded-xl bg-card flex items-center gap-4 w-[320px]">
      <Avatar size={args.size}>
        <AvatarImage src="https://github.com/shadcn.png" alt="Priya Sharma" />
        <AvatarFallback>PS</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-sm">Priya Sharma</p>
        <p className="text-xs text-muted-foreground">
          Senior Procurement Manager
        </p>
      </div>
    </div>
  ),
};
