// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { EmptyState } from './empty-state';
import { PackageOpen, SearchX, ShieldAlert, FileX2, Plus, RefreshCcw } from 'lucide-react';

/**
 * Empty-state placeholder for zero-data views.
 *
 * **Phase 4 fixes:**
 * - Replaced all hardcoded `bg-slate-50/50`, `border-slate-200`, `text-slate-900` with design tokens
 * - `bordered` prop (default `true`) — set `false` when embedded inside a card or panel
 * - `actionIcon` prop — add a `<Plus />` or `<RefreshCcw />` icon inside the CTA
 * - Title uses `font-semibold text-foreground` (not `font-bold text-slate-900`)
 * - Description uses `text-muted-foreground`
 */
const meta = {
  title: 'UI/Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Full-page or section empty state. Design-token aware — no hardcoded colors. ' +
          'Pass `bordered={false}` when nesting inside a card. Use `actionIcon` for icon-prefixed CTA.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Primary heading.',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Supporting text.',
      table: { category: 'Content' },
    },
    actionLabel: {
      control: 'text',
      description: 'CTA button label.',
      table: { category: 'Content' },
    },
    bordered: {
      control: 'boolean',
      description: 'Show dashed border + muted background.',
      table: { category: 'Appearance', defaultValue: { summary: 'true' } },
    },
  },
  args: {
    title: 'No Items Found',
    description: 'Create an item to get started.',
    bordered: true,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="p-8 w-[480px]">
      <EmptyState {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('No Items Found')).toBeInTheDocument();
  },
};

/**
 * With CTA and icon — `actionIcon` renders a `<Plus />` before the label.
 */
export const WithAction: Story = {
  render: () => (
    <div className="p-8 w-[480px]">
      <EmptyState
        icon={<PackageOpen className="w-6 h-6" />}
        title="No partners yet"
        description="Add your first partner to start managing your procurement network."
        actionLabel="Add Partner"
        actionIcon={<Plus className="h-4 w-4" />}
        onAction={() => console.log('Create partner clicked')}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /add partner/i });
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
  },
};

/** No-results search state. */
export const NoSearchResults: Story = {
  render: () => (
    <div className="p-8 w-[480px]">
      <EmptyState
        icon={<SearchX className="w-6 h-6" />}
        title="No results found"
        description="Try adjusting your search query or removing active filters."
        actionLabel="Clear filters"
        actionIcon={<RefreshCcw className="h-4 w-4" />}
        onAction={() => {}}
      />
    </div>
  ),
};

/** Suspended account state — no border, suitable inside a panel. */
export const Borderless: Story = {
  render: () => (
    <div className="w-[480px] border rounded-xl bg-card p-6">
      <h3 className="font-semibold text-sm mb-4">Partner Documents</h3>
      <EmptyState
        icon={<FileX2 className="w-5 h-5" />}
        title="No documents uploaded"
        description="Upload GST certificate, PAN card, and FSSAI license to complete verification."
        actionLabel="Upload Documents"
        bordered={false}
      />
    </div>
  ),
  parameters: {
    docs: { description: { story: '`bordered={false}` removes dashed border — for inline panel use.' } },
  },
};

/** Access-denied state. */
export const Restricted: Story = {
  render: () => (
    <div className="p-8 w-[480px]">
      <EmptyState
        icon={<ShieldAlert className="w-6 h-6" />}
        title="Access Restricted"
        description="You don't have permission to view this page. Contact your administrator to request access."
      />
    </div>
  ),
};
