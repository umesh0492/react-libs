// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu';
import { Button } from '../forms/button';
import {
  Download, Edit, Eye, MoreHorizontal, Trash2,
  UserCheck, UserX, ChevronDown, Filter, ArrowUpDown,
  Bell, Settings, LogOut, User,
} from 'lucide-react';

/**
 * A floating menu that appears below or beside a trigger element.
 *
 * **Phase 5 fixes:**
 * - `bg-popover` replaces hardcoded `bg-white dark:bg-slate-950` in `DropdownMenuContent` and `DropdownMenuSubContent`
 * - Added enter animations: `animate-in fade-in-0 zoom-in-95 slide-in-from-*`
 * - Radio indicator upgraded from `h-2 w-2` → `h-2.5 w-2.5` for better visibility
 */
const meta = {
  title: 'UI/Overlays/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radix DropdownMenu — theme-aware (`bg-popover`), animated enter/exit. ' +
          'Supports checkbox items, radio groups, nested sub-menus, and keyboard shortcuts.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Row actions menu — standard table row ⋯ button. */
export const RowActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button id="ddm-trigger" variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>PO-2025-0421</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />View Details
          <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />Edit Order
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />Export PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserCheck className="mr-2 h-4 w-4" />Change Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem><UserCheck className="mr-2 h-4 w-4" />Approve</DropdownMenuItem>
            <DropdownMenuItem><UserX className="mr-2 h-4 w-4" />Reject</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />Cancel Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /open actions/i }));
    await waitFor(() => expect(document.body.querySelector('[role="menu"]')).toBeTruthy());
    await userEvent.keyboard('{Escape}');
  },
};

/**
 * Column visibility toggles — `DropdownMenuCheckboxItem`.
 * Phase 5 fix: `bg-popover` ensures these render correctly in dark mode.
 */
export const ColumnVisibility: Story = {
  render: () => {
    const [cols, setCols] = React.useState({ partner: true, amount: true, date: true, status: true, actions: false });
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button id="ddm-cols-trigger" variant="outline">
            <Filter className="mr-2 h-4 w-4" />Columns <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(Object.entries(cols) as [string, boolean][]).map(([key, checked]) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={checked}
              onCheckedChange={(v) => setCols(c => ({ ...c, [key]: v }))}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /columns/i }));
    await waitFor(() => expect(document.body.querySelector('[role="menu"]')).toBeTruthy());
    await userEvent.keyboard('{Escape}');
  },
};

/**
 * Sort by — `DropdownMenuRadioGroup`.
 * Phase 5 fix: radio indicator upgraded from h-2w-2 → h-2.5w-2.5.
 */
export const RadioGroupSort: Story = {
  render: () => {
    const [sort, setSort] = React.useState('newest');
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button id="ddm-sort-trigger" variant="outline">
            <ArrowUpDown className="mr-2 h-4 w-4" />Sort: {sort} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="amount-desc">Amount (high–low)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="amount-asc">Amount (low–high)</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
  parameters: {
    docs: { description: { story: 'Radio group indicator is now `h-2.5 w-2.5` for better visual fill.' } },
  },
};

/** User profile dropdown — common header pattern. */
export const UserProfile: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">PS</div>
          Priya Sharma <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <div>
            <p className="font-semibold text-sm">Priya Sharma</p>
            <p className="text-xs font-normal text-muted-foreground">priya@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
        <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
        <DropdownMenuItem><Bell className="mr-2 h-4 w-4" />Notifications</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
