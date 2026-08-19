// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarLabel,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from './menubar';

/**
 * A horizontal application menu bar for top-level navigation.
 *
 * **Phase 5 fix:**
 * - Added `hover:bg-accent hover:text-accent-foreground` to `MenubarTrigger`
 *   (previously only focus/open states were styled — no hover feedback)
 * - Chevron `ChevronRight` is already on `MenubarSubTrigger`
 */
const meta = {
  title: 'UI/Navigation/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Application menu bar. `MenubarTrigger` now has explicit `hover:bg-accent` state. ' +
          'Keyboard: Tab to move between menus, ↑↓ to navigate items, → to open submenu.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full app menubar — File, Edit, View, Help menus. */
export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Open File <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
          <MenubarItem>Save As <MenubarShortcut>⇧⌘S</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Appearance</MenubarLabel>
          <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Status Bar</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Zoom</MenubarLabel>
          <MenubarRadioGroup value="100%">
            <MenubarRadioItem value="75%">75%</MenubarRadioItem>
            <MenubarRadioItem value="100%">100%</MenubarRadioItem>
            <MenubarRadioItem value="125%">125%</MenubarRadioItem>
            <MenubarRadioItem value="150%">150%</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>More</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Report Bug</MenubarItem>
              <MenubarItem>Changelog</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('menubar')).toBeInTheDocument();
    // Verify trigger labels
    expect(canvas.getByText('File')).toBeInTheDocument();
    expect(canvas.getByText('View')).toBeInTheDocument();
  },
};

/** Partner Portal menubar — domain-specific example. */
export const PartnerPortal: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Procurement</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>All RFQs <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
          <MenubarItem>Create RFQ</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Purchase Orders</MenubarItem>
          <MenubarItem>GRN Register</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Contracts</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Partners</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Partner Registry <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
          <MenubarItem>Onboarding Queue</MenubarItem>
          <MenubarItem>Compliance</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Reports</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Performance Report</MenubarItem>
              <MenubarItem>Spend Analysis</MenubarItem>
              <MenubarItem>Risk Assessment</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Settings</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Display</MenubarLabel>
          <MenubarCheckboxItem checked>Dense Tables</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Avatars</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>Account Settings</MenubarItem>
          <MenubarItem>Notifications</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  parameters: {
    docs: { description: { story: 'Partner portal domain — Procurement, Partners, Settings menus with submenus.' } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Procurement')).toBeInTheDocument();
    expect(canvas.getByText('Partners')).toBeInTheDocument();
  },
};
