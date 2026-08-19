// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import {
  FileText,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart3,
  Search,
} from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

/**
 * A filterable command palette built on `cmdk`. Renders a searchable list of
 * commands grouped by category. Use as an inline panel or inside `CommandDialog`
 * for a full-screen overlay experience. Filter results update in real time as
 * the user types.
 */
const meta = {
  title: 'UI/Overlays/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`Command` is an inline filterable list (cmdk). Mount it standalone for ' +
          'inline search or wrap with `CommandDialog` for a global command palette. ' +
          'Groups items with `CommandGroup` and `CommandSeparator`. Keyboard: ' +
          '↑↓ to navigate, Enter to select, Escape to clear/close.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Inline command palette — embedded directly on the page. */
export const Inline: Story = {
  render: () => (
    <div className="p-4 w-[380px] border rounded-lg shadow-md">
      <Command>
        <CommandInput placeholder="Search commands…" id="cmd-input" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Purchase Orders">
            <CommandItem>
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Purchase Order
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              View All Orders
              <CommandShortcut>⌘O</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Catalog">
            <CommandItem>
              <Package className="mr-2 h-4 w-4" />
              Stock Overview
            </CommandItem>
            <CommandItem>
              <BarChart3 className="mr-2 h-4 w-4" />
              Catalog Analytics
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <Users className="mr-2 h-4 w-4" />
              Manage Partners
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              System Settings
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    expect(input).toBeInTheDocument();
    await userEvent.type(input, 'order');
    await userEvent.clear(input);
  },
};

/** `CommandDialog` — full-screen overlay palette triggered by a keyboard shortcut. */
export const AsDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setOpen((o) => !o);
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, []);
    return (
      <>
        <button
          id="cmd-open-btn"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <Search className="h-4 w-4" />
          Search commands…
          <kbd className="ml-2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs opacity-100 sm:flex">
            ⌘K
          </kbd>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => setOpen(false)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                New Purchase Order
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Package className="mr-2 h-4 w-4" />
                Record GRN
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};
