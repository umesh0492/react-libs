// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { SkeletonList } from './skeleton-list';

/**
 * A pre-composed list of skeleton rows.
 * Use as a drop-in replacement for data lists while loading.
 */
const meta = {
  title: 'UI/Feedback/SkeletonList',
  component: SkeletonList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A ready-made vertical list of skeleton rows. Control the number of rows via `count`. ' +
          'Use as a loading placeholder for table rows, list items, or feed cards.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Number of skeleton rows to render.',
      table: { category: 'Content', defaultValue: { summary: '5' } },
    },
  },
  args: { count: 5 },
} satisfies Meta<typeof SkeletonList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[480px] p-4 border rounded-xl">
      <SkeletonList {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const pulses = canvasElement.querySelectorAll('[class*="animate-pulse"], [class*="skeleton"]');
    expect(pulses.length).toBeGreaterThan(0);
  },
};

export const ThreeRows: Story = { args: { count: 3 }, render: (args) => <div className="w-[480px] p-4 border rounded-xl"><SkeletonList {...args} /></div> };
export const TenRows: Story = { args: { count: 10 }, render: (args) => <div className="w-[480px] p-4 border rounded-xl"><SkeletonList {...args} /></div> };
