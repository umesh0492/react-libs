// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { PageHeader } from './page-header';
import { Button } from '../forms/button';
import { Badge } from '../data-display/badge';

/**
 * Standard top-of-page layout used across all pages.
 * Slots for breadcrumbs, title, badge, description, and action buttons.
 */
const meta = {
  title: 'UI/Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Standardized page header with `title`, `description`, `breadcrumbs`, `badge`, and `actions` slots. ' +
          'Place at the top of every page for consistent navigation affordance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Primary page title (h1).',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Optional subtitle below the title.',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the root element.',
      table: { category: 'Styling' },
    },
  },
  args: { title: 'Dashboard Overview' },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <PageHeader {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Dashboard Overview')).toBeInTheDocument();
  },
};

/** With description subtitle. */
export const WithDescription: Story = {
  args: {
    title: 'Partner Management',
    description: 'Manage supplier profiles, approvals, and compliance documents.',
  },
  render: (args) => <PageHeader {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Partner Management')).toBeInTheDocument();
    expect(canvas.getByText(/supplier profiles/i)).toBeInTheDocument();
  },
};

/** Full header with breadcrumbs, badge, and action buttons. */
export const FullFeatured: Story = {
  render: () => (
    <PageHeader
      title="Purchase Orders"
      description="Create and track procurement orders across all partners."
      badge={<Badge variant="secondary">47 pending</Badge>}
      breadcrumbs={
        <nav className="flex text-xs text-muted-foreground gap-1">
          <span>Home</span><span>/</span><span>Procurement</span><span>/</span>
          <span className="text-foreground font-medium">Purchase Orders</span>
        </nav>
      }
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button size="sm">+ New Order</Button>
        </div>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 'Purchase Orders' appears in both the h1 and breadcrumb span — target the heading specifically
    expect(canvas.getByRole('heading', { name: /purchase orders/i })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: /new order/i })).toBeInTheDocument();
  },
};
