// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Skeleton } from './skeleton';

/**
 * Pulsing placeholder animation for loading states.
 *
 * **Phase 4 fix:**
 * - `aria-hidden="true"` added — screen readers skip skeletons entirely
 * - `bg-muted/80` (slightly more opaque than before) for better contrast on white backgrounds
 */
const meta = {
  title: 'UI/Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pulsing `<div>` placeholder. Size it to match the content it replaces. ' +
          '`aria-hidden="true"` ensures screen readers skip the skeleton. ' +
          'Compose multiple for full loading screens.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Tailwind classes for width, height, border-radius.',
      table: { category: 'Styling' },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <div className="p-4 w-[320px]"><Skeleton className="h-4 w-full" /></div>,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[aria-hidden="true"]');
    expect(el).toBeTruthy();
  },
};

/** Partner card skeleton — placeholder for grid cards. */
export const Card: Story = {
  render: () => (
    <div className="p-4 space-y-3 border rounded-xl w-[280px] bg-card">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  ),
};

/** Table row skeletons — for `DataTable` loading state with soft dividers. */
export const TableRows: Story = {
  render: () => (
    <div className="p-4 w-[560px] border rounded-xl bg-card overflow-hidden">
      {/* Fake table header */}
      <div className="flex items-center gap-3 py-2 px-3 border-b border-border/60 bg-muted/30">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 flex-1" />
        <Skeleton className="h-3 w-16 shrink-0" />
        <Skeleton className="h-3 w-16 shrink-0" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 px-3 border-b border-border/60 last:border-b-0">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <Skeleton className="h-3.5 flex-1" />
          <Skeleton className="h-3.5 w-20 shrink-0" />
          <Skeleton className="h-5 w-16 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const skeletons = canvasElement.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(5);
  },
};

/** Profile page skeleton — avatar + name + body text lines. */
export const Profile: Story = {
  render: () => (
    <div className="p-4 space-y-4 w-[360px]">
      <div className="flex items-center gap-3">
        <Skeleton className="h-14 w-14 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  ),
};

/** Dashboard stat cards — 4 metric cards in a grid. */
export const DashboardStats: Story = {
  render: () => (
    <div className="p-4 grid grid-cols-2 gap-3 w-[500px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4 bg-card space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Dashboard metric card grid skeleton — 4 cards with icon, value, and label.' } },
  },
};
