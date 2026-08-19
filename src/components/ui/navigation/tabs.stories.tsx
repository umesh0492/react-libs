// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

/**
 * A tabbed interface to switch between related content panels.
 * Built on Radix UI Tabs — fully keyboard navigable with arrow keys.
 */
const meta = {
  title: 'UI/Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Keyboard-navigable tab interface from Radix UI. Use `TabsList` as the container, ' +
          '`TabsTrigger` for each tab button, and `TabsContent` for each panel. ' +
          'Arrow keys switch between tabs; `Space` or `Enter` select the focused tab.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Value of the initially selected tab (uncontrolled).',
      table: { category: 'State' },
    },
    value: {
      control: 'text',
      description: 'Controlled active tab value.',
      table: { category: 'State' },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction of the tab list.',
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },
    activationMode: {
      control: 'radio',
      options: ['automatic', 'manual'],
      description: '`automatic` selects on focus; `manual` requires Enter/Space.',
      table: { category: 'Behaviour', defaultValue: { summary: 'automatic' } },
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Fires with the newly selected tab value.',
      table: { category: 'Events' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the root Tabs element.',
      table: { category: 'Styling' },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dashboard tabs — the most common UI pattern. */
export const Default: Story = {
  render: () => (
    <div className="w-[520px] p-4">
      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">Project Overview</h3>
          <p className="text-sm text-muted-foreground">Summary of your project's health and recent activity.</p>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[['Issues', '12'], ['PRs', '4'], ['Members', '8']].map(([label, val]) => (
              <div key={label} className="border rounded p-2 text-center">
                <p className="text-lg font-bold">{val}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4 p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-muted-foreground">Traffic, conversions, and engagement metrics.</p>
          <div className="h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
            Chart placeholder
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-4 p-4 border rounded-lg space-y-3">
          <h3 className="font-semibold">Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your project and team preferences.</p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project name</label>
            <input className="w-full border rounded px-2 py-1 text-sm" defaultValue="My Project" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Initial tab — check a unique word from the overview copy
    expect(canvas.getByText(/project.*health/i)).toBeVisible();
    await userEvent.click(canvas.getByRole('tab', { name: 'Analytics' }));
    await waitFor(() => expect(canvas.getByText(/Traffic, conversions/i)).toBeVisible());
    await userEvent.click(canvas.getByRole('tab', { name: 'Settings' }));
    await waitFor(() => expect(canvas.getByText(/Configure your project/i)).toBeVisible());
    await userEvent.click(canvas.getByRole('tab', { name: 'Overview' }));
    await waitFor(() => expect(canvas.getByText(/project.*health/i)).toBeVisible());
  },
};

/** Vertical tabs layout — useful for sidebars. */
export const Vertical: Story = {
  render: () => (
    <div className="p-4 flex gap-4" style={{ width: 520 }}>
      <Tabs defaultValue="account" orientation="vertical" className="flex gap-4">
        <TabsList className="flex-col h-auto items-start w-36">
          <TabsTrigger value="account" className="w-full justify-start">Account</TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start">Security</TabsTrigger>
          <TabsTrigger value="billing" className="w-full justify-start">Billing</TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="account" className="mt-0 p-3 border rounded-lg">
            <h3 className="font-semibold">Account</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage your profile information.</p>
          </TabsContent>
          <TabsContent value="security" className="mt-0 p-3 border rounded-lg">
            <h3 className="font-semibold">Security</h3>
            <p className="text-sm text-muted-foreground mt-1">Password, 2FA, and sessions.</p>
          </TabsContent>
          <TabsContent value="billing" className="mt-0 p-3 border rounded-lg">
            <h3 className="font-semibold">Billing</h3>
            <p className="text-sm text-muted-foreground mt-1">Subscription and payment methods.</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Security' }));
    await waitFor(() =>
      expect(canvas.getByText('Password, 2FA, and sessions.')).toBeInTheDocument()
    );
    await userEvent.click(canvas.getByRole('tab', { name: 'Billing' }));
    await waitFor(() =>
      expect(canvas.getByText('Subscription and payment methods.')).toBeInTheDocument()
    );
  },
};
