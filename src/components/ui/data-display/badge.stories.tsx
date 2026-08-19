// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Badge, badgeVariants } from './badge';

/**
 * A compact label for status, category, or count display.
 * Supports `default`, `secondary`, `destructive`, and `outline` variants.
 */
const meta = {
  title: 'UI/Data-display/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inline badge component for short metadata labels. ' +
          'Use `variant` to express semantic meaning (status, warning, etc.).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    children: {
      control: 'text',
      description: 'Label text inside the badge.',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes.',
      table: { category: 'Styling' },
    },
  },
  args: { children: 'Badge', variant: 'default' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Active' },
  render: (args) => <div className="p-4 flex items-center justify-center"><Badge {...args} /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Active')).toBeInTheDocument();
  },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Pending' },
  render: (args) => <div className="p-4 flex items-center justify-center"><Badge {...args} /></div>,
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Rejected' },
  render: (args) => <div className="p-4 flex items-center justify-center"><Badge {...args} /></div>,
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Draft' },
  render: (args) => <div className="p-4 flex items-center justify-center"><Badge {...args} /></div>,
};

/** All four variants for visual reference. */
export const AllVariants: Story = {
  render: () => (
    <div className="p-4 flex flex-wrap gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Rejected</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Active')).toBeInTheDocument();
    expect(canvas.getByText('Pending')).toBeInTheDocument();
    expect(canvas.getByText('Rejected')).toBeInTheDocument();
    expect(canvas.getByText('Draft')).toBeInTheDocument();
  },
};
