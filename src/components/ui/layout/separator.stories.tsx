// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { Separator } from './separator';

/**
 * A thin horizontal or vertical dividing line.
 * Use to group related content or create visual hierarchy.
 */
const meta = {
  title: 'UI/Layout/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible separator from Radix UI. Renders as `<hr>` (horizontal) or ' +
          'a vertical `<div>` based on the `orientation` prop.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction of the divider.',
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },
    decorative: {
      control: 'boolean',
      description: 'When true, hidden from assistive technology (`role="none"`).',
      table: { category: 'Accessibility', defaultValue: { summary: 'true' } },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes.',
      table: { category: 'Styling' },
    },
  },
  args: { orientation: 'horizontal' },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="p-4 w-[320px] space-y-3">
      <p className="text-sm font-medium">Section A</p>
      <Separator />
      <p className="text-sm font-medium">Section B</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-orientation="horizontal"]')).toBeTruthy();
  },
};

export const Vertical: Story = {
  render: () => (
    <div className="p-4 flex items-center gap-4">
      <span className="text-sm">Home</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm">About</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm">Contact</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-orientation="vertical"]')).toBeTruthy();
  },
};

/** Section divider in a settings page layout. */
export const InSettings: Story = {
  render: () => (
    <div className="p-4 w-[360px] space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Profile</h3>
        <p className="text-xs text-muted-foreground">Manage your personal settings.</p>
      </div>
      <Separator />
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <p className="text-xs text-muted-foreground">Configure alert preferences.</p>
      </div>
      <Separator />
      <div className="space-y-0.5">
        <h3 className="text-sm font-semibold">Security</h3>
        <p className="text-xs text-muted-foreground">Password and 2FA settings.</p>
      </div>
    </div>
  ),
};
