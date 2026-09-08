// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader,
  DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose,
} from './drawer';
import { Button } from '../forms/button';
import { Filter } from 'lucide-react';

/**
 * A bottom-sheet drawer built on Vaul.
 *
 * **Phase 5 fix:**
 * - `bg-white dark:bg-slate-950` → `bg-background` (theme-aware)
 * - Drag handle pill changed from `h-2 w-[100px]` to `h-1.5 w-12` (standard mobile handle)
 * - `rounded-t-[10px]` → `rounded-t-[12px]` for softer top edge
 */
const meta = {
  title: 'UI/Overlays/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Vaul bottom-sheet. `bg-background` replaces hardcoded `bg-white`. ' +
          'Standard drag handle pill (12px wide). Drag-to-dismiss gesture built in.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Filter drawer — standard filtering use case. */
export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button id="drawer-trigger" variant="outline">
          <Filter className="mr-2 h-4 w-4" />Open Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filter Records</DrawerTitle>
          <DrawerDescription>Narrow down the list by status, date range, and category.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2 flex flex-col gap-0">
          {[
            { label: 'Status',     value: 'All' },
            { label: 'Date Range', value: 'Last 30 days' },
            { label: 'Category',   value: 'All categories' },
            { label: 'Amount',     value: '$0 – $5,000' },
          ].map(({ label, value }, i, arr) => (
            <div key={label} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-border/60' : ''}`}>
              <span className="text-sm font-medium">{label}</span>
              <span className="text-sm text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <Button>Apply Filters</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /open filters/i }));
    await waitFor(
      () => expect(document.body.querySelector('[data-vaul-drawer]')).toBeTruthy()
    );
  },
};

/** Item detail drawer — inline detail panel without page navigation. */
export const DetailPanel: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button id="drawer-detail-trigger" variant="secondary">View Order Details</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>ORD-2026-0981 — Acme Corporation</DrawerTitle>
          <DrawerDescription>Processed 14 Mar 2026 · Central Facility</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 space-y-0">
          {[
            { label: 'Compute Instance XL',    qty: '2 units', value: '$1,840' },
            { label: 'Object Storage 10TB',    qty: '1 unit',  value: '$1,455' },
            { label: 'Load Balancer Add-on',   qty: '3 units', value: '$1,550' },
          ].map((item, i, arr) => (
            <div key={item.label} className={`flex justify-between py-2.5 text-sm ${i < arr.length - 1 ? 'border-b border-border/60' : ''}`}>
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">{item.qty}</span>
              <span className="tabular-nums">{item.value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-semibold text-sm border-t border-border/60">
            <span>Total</span>
            <span>$4,845</span>
          </div>
        </div>
        <DrawerFooter>
          <Button>Approve Order</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
