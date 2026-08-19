// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { StatusBadge } from './status-badge';

/**
 * Semantic status indicator for partner/order/approval states.
 *
 * **Phase 3 fix:**
 * - Added `suspended` status with **orange** palette (distinct from `inactive` grey)
 * - `inactive` = slate/grey (idle, not actively engaged)
 * - `suspended` = orange (blocked, needs attention, ≠ just inactive)
 */
const meta = {
  title: 'UI/Data-display/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Domain-specific badge that maps semantic values to color automatically. ' +
          '`suspended` (orange) is now distinct from `inactive` (grey). ' +
          'Falls back to a grey pill with the raw value for unknown statuses.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'active', 'pending', 'inactive', 'suspended', 'draft',
        'approved', 'rejected', 'completed', 'cancelled',
        'in_progress', 'overdue', 'on_hold',
        'open', 'closed', 'awarded', 'expired',
        'paid', 'unpaid', 'partially_paid',
        'delivered', 'dispatched', 'confirmed',
        'under_review', 'resolved', 'escalated',
      ],
      description: 'The semantic status value.',
      table: { category: 'State' },
    },
    showDot: {
      control: 'boolean',
      description: 'Show the colored dot indicator.',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
    size: {
      control: 'radio',
      options: ['sm', 'default'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    label: {
      control: 'text',
      description: 'Override the auto-generated label.',
      table: { category: 'Content' },
    },
  },
  args: { status: 'active', showDot: true, size: 'default' },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { status: 'active' },
  render: (args) => <div className="p-4 flex items-center justify-center"><StatusBadge {...args} /></div>,
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText(/active/i)).toBeInTheDocument();
  },
};

export const Pending: Story = {
  args: { status: 'pending' },
  render: (args) => <div className="p-4 flex items-center justify-center"><StatusBadge {...args} /></div>,
};

export const Rejected: Story = {
  args: { status: 'rejected' },
  render: (args) => <div className="p-4 flex items-center justify-center"><StatusBadge {...args} /></div>,
};

/**
 * Suspended vs Inactive — must be visually distinct.
 * Fix: `suspended` is orange (blocked), `inactive` is slate/grey (idle).
 */
export const SuspendedVsInactive: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <StatusBadge status="inactive" />
        <span className="text-xs text-muted-foreground">Inactive — grey/slate, account is idle</span>
      </div>
      <div className="flex items-center gap-4">
        <StatusBadge status="suspended" />
        <span className="text-xs text-muted-foreground">Suspended — orange, account is blocked</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`suspended` now uses orange (blocking signal), `inactive` stays grey (neutral). ' +
          'Previously both rendered as the same slate palette.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Suspended')).toBeInTheDocument();
    expect(canvas.getByText('Inactive')).toBeInTheDocument();
  },
};

/** All partner lifecycle statuses. */
export const PartnerStatuses: Story = {
  render: () => (
    <div className="p-4 flex flex-wrap gap-2">
      {(['active', 'pending', 'approved', 'rejected', 'suspended', 'inactive', 'draft'] as const).map(s => (
        <StatusBadge key={s} status={s} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Active')).toBeInTheDocument();
    expect(canvas.getByText('Suspended')).toBeInTheDocument();
    expect(canvas.getByText('Inactive')).toBeInTheDocument();
  },
};

/** All RFQ statuses. */
export const RFQStatuses: Story = {
  render: () => (
    <div className="p-4 flex flex-wrap gap-2">
      {(['open', 'closed', 'awarded', 'expired', 'in_progress', 'cancelled'] as const).map(s => (
        <StatusBadge key={s} status={s} />
      ))}
    </div>
  ),
};

/** Payment statuses. */
export const PaymentStatuses: Story = {
  render: () => (
    <div className="p-4 flex flex-wrap gap-2">
      {(['paid', 'unpaid', 'partially_paid', 'overdue_payment'] as const).map(s => (
        <StatusBadge key={s} status={s} />
      ))}
    </div>
  ),
};

/** Small size for tight table cells. */
export const SmallSize: Story = {
  render: () => (
    <div className="p-4 flex flex-wrap gap-2">
      {(['active', 'pending', 'suspended', 'rejected'] as const).map(s => (
        <StatusBadge key={s} status={s} size="sm" />
      ))}
    </div>
  ),
};

/** Fallback for unknown enum values — renders raw value in grey. */
export const UnknownFallback: Story = {
  render: () => (
    <div className="p-4 flex flex-wrap gap-2">
      <StatusBadge status={'unknown_status' as any} />
      <StatusBadge status={'custom_value' as any} label="Custom Label" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Unknown `status` falls back to a grey pill showing the raw value.' } },
  },
};
