// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { RoleEmptyState } from './role-empty-state';

/**
 * A rich empty-state with icon, title, subtitle, CTA button, and a help slide-out Sheet.
 * Shows a skeleton loader for `loadingMs` milliseconds before revealing content.
 */
const meta = {
  title: 'UI/Feedback/RoleEmptyState',
  component: RoleEmptyState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Rich empty-state card with skeleton loading, contextual CTA button, and a help Sheet. ' +
          'Pass `loadingMs={0}` in stories to skip the skeleton delay. ' +
          'All text is supplied via props — wrap per role in your app.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Main heading text.', table: { category: 'Content' } },
    subtitle: { control: 'text', description: 'Supporting description.', table: { category: 'Content' } },
    actionLabel: { control: 'text', description: 'CTA button label. Omit to hide button.', table: { category: 'Content' } },
    loadingMs: { control: { type: 'number', min: 0, max: 5000 }, description: 'Skeleton duration in ms. `0` = no skeleton.', table: { category: 'Behaviour' } },
    isPrimary: { control: 'boolean', description: 'Use filled primary style for CTA.', table: { category: 'Appearance' } },
  },
  args: { loadingMs: 0 },
} satisfies Meta<typeof RoleEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — no action, no loading delay. */
export const Default: Story = {
  args: { loadingMs: 0 },
  render: (args) => <div className="w-full max-w-[480px]"><RoleEmptyState {...args} /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Default title is "Nothing here yet"
    expect(canvas.getByText('Nothing here yet')).toBeInTheDocument();
  },
};

/** Admin view — button that opens the help sheet. */
export const WithAction: Story = {
  args: {
    loadingMs: 0,
    title: 'No partners yet',
    subtitle: 'Add your first partner to start managing procurement.',
    actionLabel: 'Get Started',
  },
  render: (args) => <div className="w-full max-w-[480px]"><RoleEmptyState {...args} /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('No partners yet')).toBeInTheDocument());
    const btn = canvas.getByRole('button', { name: /get started/i });
    expect(btn).toBeInTheDocument();
    // Click opens the help Sheet (renders into portal — query document.body)
    await userEvent.click(btn);
    await waitFor(() =>
      expect(within(document.body).getByText('Need Help?')).toBeInTheDocument()
    );
  },
};

/** Partner view — read-only guidance, no CTA. */
export const ReadOnly: Story = {
  args: {
    loadingMs: 0,
    title: 'No purchase orders',
    subtitle: 'Orders placed by your buyers will appear here.',
  },
  render: (args) => <div className="w-full max-w-[480px]"><RoleEmptyState {...args} /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('No purchase orders')).toBeInTheDocument();
    expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

/** Loading skeleton — shows for 50ms then reveals content. */
export const WithSkeleton: Story = {
  args: {
    loadingMs: 50,
    title: 'Loading state demo',
  },
  render: (args) => <div className="w-full max-w-[480px]"><RoleEmptyState {...args} /></div>,
  play: async ({ canvasElement }) => {
    // Skeleton is visible initially
    // We use waitFor because the first render might take a tick
    await waitFor(() => {
      const pulses = canvasElement.querySelectorAll('[aria-hidden="true"]');
      expect(pulses.length).toBeGreaterThan(0);
    });

    // After 50ms, content appears
    await waitFor(
      () => expect(within(canvasElement).getByText('Loading state demo')).toBeInTheDocument(),
      { timeout: 2000 }
    );
  },
};
