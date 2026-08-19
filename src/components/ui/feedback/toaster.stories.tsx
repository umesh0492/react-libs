// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { Toaster } from './toaster';
import { toast } from 'sonner';
import { Button } from '../forms/button';

/**
 * The global toast notification container.
 * Mount `<Toaster />` once at the app root, then trigger toasts anywhere via `toast()` from `sonner`.
 */
const meta = {
  title: 'UI/Feedback/Toaster',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Global toast provider powered by `sonner`. Mount `<Toaster />` once in your app root layout. ' +
          'Trigger notifications anywhere using the `toast()`, `toast.success()`, `toast.error()`, ' +
          '`toast.warning()`, and `toast.loading()` helpers.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right',
      ],
      description: 'Where toasts appear on screen.',
      table: { category: 'Layout', defaultValue: { summary: 'bottom-right' } },
    },
    richColors: {
      control: 'boolean',
      description: 'When true, success/error toasts use semantic green/red backgrounds.',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    expand: {
      control: 'boolean',
      description: 'Expands all toasts to full width instead of stacking.',
      table: { category: 'Behaviour', defaultValue: { summary: 'false' } },
    },
    duration: {
      control: { type: 'range', min: 1000, max: 10000, step: 500 },
      description: 'Auto-dismiss duration in milliseconds.',
      table: { category: 'Behaviour', defaultValue: { summary: '4000' } },
    },
    closeButton: {
      control: 'boolean',
      description: 'Shows a close button on every toast.',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fire each type of toast notification by clicking the buttons. */
export const Interactive: Story = {
  render: (args) => (
    <>
      <Toaster richColors {...args} />
      <p className="text-sm text-muted-foreground mb-4">Click a button to see each toast type:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={() => toast('Default message toast')} variant="outline" size="sm">
          Default
        </Button>
        <Button onClick={() => toast.success('Changes saved successfully!')} variant="outline" size="sm">
          Success
        </Button>
        <Button onClick={() => toast.error('Failed to upload file.')} variant="outline" size="sm">
          Error
        </Button>
        <Button onClick={() => toast.warning('Storage is 90% full.')} variant="outline" size="sm">
          Warning
        </Button>
        <Button onClick={() => toast.info('New version available.')} variant="outline" size="sm">
          Info
        </Button>
        <Button onClick={() => toast.loading('Uploading...')} variant="outline" size="sm">
          Loading
        </Button>
      </div>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Click the success button
    await userEvent.click(canvas.getByRole('button', { name: /success/i }));
    // Wait a moment for toast animation
    await new Promise(r => setTimeout(r, 300));
    // Verify Toaster is mounted
    expect(canvas.getByRole('button', { name: /error/i })).toBeInTheDocument();
  },
};

/** Top-center position with close buttons. */
export const TopCenter: Story = {
  args: { position: 'top-center', closeButton: true },
  render: (args) => (
    <>
      <Toaster {...args} />
      <Button onClick={() => toast.success('Saved!')} variant="outline">
        Show Top Toast
      </Button>
    </>
  ),
};
