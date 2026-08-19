// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './sheet';
import { Button } from '../forms/button';
import { Input } from '../forms/input';
import { Label } from '../forms/label';

/**
 * A side-panel drawer that slides in from any edge of the viewport.
 * Built on Radix UI Dialog. The `side` prop controls which edge the sheet
 * slides from (`right`, `left`, `top`, `bottom`). Focus is trapped inside.
 * Use for detail panels, settings, and filter drawers.
 */
const meta = {
  title: 'UI/Overlays/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A slide-in panel built on Radix UI Dialog. The `side` prop on ' +
          '`SheetContent` controls the entry edge. Compose `SheetHeader`, ' +
          '`SheetTitle`, `SheetDescription`, `SheetFooter`, and `SheetClose` ' +
          'for consistent internal layout. Pairs well with edit forms and filters.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Right-side sheet — the standard detail/edit panel pattern. */
export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button id="sheet-right-trigger">Edit Partner</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Agro Supplies Co.</SheetTitle>
          <SheetDescription>
            Update partner details. Changes are saved immediately.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-1.5">
            <Label htmlFor="sh-name">Company Name</Label>
            <Input id="sh-name" defaultValue="Agro Supplies Co." />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sh-gst">GST Number</Label>
            <Input id="sh-gst" defaultValue="22AGRSP0000A1Z5" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sh-contact">Contact Email</Label>
            <Input id="sh-contact" type="email" defaultValue="contact@agrosupplies.in" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('#sheet-right-trigger') as Element;
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(document.body.querySelector('[role="dialog"]')).toBeTruthy()
    );
    await userEvent.keyboard('{Escape}');
  },
};

/** Left-side sheet — useful for navigation or filter sidebars. */
export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button id="sheet-left-trigger" variant="outline">Open Sidebar</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the purchase order list.</SheetDescription>
        </SheetHeader>
        <div className="py-4 flex flex-col gap-3 text-sm">
          {['All Orders', 'Pending Approval', 'Approved', 'Dispatched', 'Delivered'].map((s) => (
            <div key={s} className="px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">{s}</div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/** Top sheet — useful for banner-style notifications or quick actions. */
export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button id="sheet-top-trigger" variant="secondary">Show Banner</Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-auto">
        <SheetHeader>
          <SheetTitle>System Maintenance Scheduled</SheetTitle>
          <SheetDescription>
            Planned downtime on Apr 5, 2025 from 02:00–04:00 AM IST.
            All in-progress orders will be saved automatically.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button size="sm" variant="outline">Dismiss</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
