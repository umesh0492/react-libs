// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Spinner } from './spinner';

/**
 * Loading spinner (Loader2 icon from Lucide) with `animate-spin`.
 * Size is controlled via `className` (Tailwind `size-*`), not a `size` prop.
 */
const meta = {
  title: 'UI/Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A `Loader2` icon with `animate-spin` and `role="status"`. ' +
          'Size via Tailwind `className` (e.g. `size-4`, `size-8`). ' +
          'Color inherits from `currentColor` — use text-* utilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Tailwind classes for size and color (e.g. `size-8 text-primary`).',
      table: { category: 'Styling' },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8 flex items-center justify-center">
      <Spinner {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Spinner renders with role="status" aria-label="Loading"
    const canvas = within(canvasElement);
    expect(canvas.getByRole('status')).toBeInTheDocument();
  },
};

export const Small: Story = {
  args: { className: 'size-3' },
  render: (args) => <div className="p-6 flex items-center justify-center"><Spinner {...args} /></div>,
};

export const Large: Story = {
  args: { className: 'size-10' },
  render: (args) => <div className="p-6 flex items-center justify-center"><Spinner {...args} /></div>,
};

export const Colored: Story = {
  args: { className: 'size-6 text-blue-500' },
  render: (args) => <div className="p-6 flex items-center justify-center"><Spinner {...args} /></div>,
};

/** Common inline loading pattern. */
export const InlineLoading: Story = {
  render: () => (
    <div className="p-4 flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner className="size-4" />
      <span>Loading data...</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Loading data...')).toBeInTheDocument();
    expect(canvas.getByRole('status')).toBeInTheDocument();
  },
};
