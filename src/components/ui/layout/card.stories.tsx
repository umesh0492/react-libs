// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent } from "storybook/test";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardSeparator,
} from "./card";
import { Button } from "../forms/button";
import { StatusBadge } from "../data-display/status-badge";
import { Avatar, AvatarImage, AvatarFallback } from "../data-display/avatar";

/**
 * A rounded card container with header, content, and footer regions.
 *
 * **Phase 5 fixes:**
 * - `CardHeader` now has `border-b border-border/60` — line separator (not a dot)
 * - `CardFooter` now has `border-t border-border/60`
 * - `CardContent` padding changed from `p-6 pt-0` to `p-5` (consistent with header)
 * - NEW: `CardSeparator` — explicit inline divider for card body sections
 */
const meta = {
  title: "UI/Layout/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Flexible card wrapper. `CardHeader` and `CardFooter` get line separators (border-b/t). " +
          "Use `CardSeparator` inside `CardContent` for mid-body dividers.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — header with border separator, content, footer with border separator.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Invoice #INV-2026-001</CardTitle>
        <CardDescription>Due on April 15, 2026 · 30-day terms</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm py-1">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Partner</dt>
            <dd className="font-medium">Agro Supplies Co.</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-semibold">₹ 48,000</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <StatusBadge status="pending" size="sm" />
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" className="flex-1">
          Approve
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          Reject
        </Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Invoice #INV-2026-001")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: /approve/i }));
  },
};

/**
 * CardSeparator — inline divider within CardContent.
 * Phase 5 fix: new component, replaces `<Separator />` usage inside cards.
 */
export const WithSeparator: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Partner Profile</CardTitle>
        <CardDescription>Agro Supplies Co. · VND-001</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 py-1">
          <Avatar size="lg">
            <AvatarImage src="" alt="Partner" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">Agro Supplies Co.</p>
            <p className="text-xs text-muted-foreground">
              Fresh produce · Delhi NCR
            </p>
          </div>
        </div>
        <CardSeparator />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Category</p>
            <p className="font-medium">Produce</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Status</p>
            <StatusBadge status="active" size="sm" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Rating</p>
            <p className="font-medium">4.8 / 5.0</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">POs (YTD)</p>
            <p className="font-medium">47</p>
          </div>
        </div>
        <CardSeparator />
        <p className="text-xs text-muted-foreground">
          Last activity: Mar 28, 2026
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" className="w-full">
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`CardSeparator` used inside CardContent to separate avatar, details, and metadata.",
      },
    },
  },
};

/** KPI stat cards — compact numbers for dashboards. */
export const StatCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3 p-4 w-[600px]">
      {[
        {
          label: "Total Orders",
          value: "1,284",
          change: "+12.4%",
          positive: true,
        },
        { label: "Revenue", value: "₹ 2.4M", change: "+8.1%", positive: true },
        { label: "Returns", value: "34", change: "+2.3%", positive: false },
      ].map(({ label, value, change, positive }) => (
        <Card key={label}>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p
              className={`text-xs mt-1 font-medium ${positive ? "text-emerald-600" : "text-red-500"}`}
            >
              {change} vs last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Total Orders")).toBeInTheDocument();
    expect(canvas.getByText("₹ 2.4M")).toBeInTheDocument();
  },
};

/** Header only — title + description with line separator. */
export const HeaderSeparator: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
          <CardDescription>
            Notice the line separator below — not a dot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            `CardHeader` now has `border-b border-border/60` — a clean
            horizontal rule instead of the old mid-dot separator pattern.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Phase 5 fix: `CardHeader` has `border-b` (not dot separator) between title and content.",
      },
    },
  },
};
