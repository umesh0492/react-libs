// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Copy, Pencil, Trash2, Link, ExternalLink, Star, Eye, EyeOff, Download } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './context-menu';

/**
 * A right-click context menu that appears at the cursor position.
 * Built on Radix UI ContextMenu.
 *
 * **Phase 5 stories:**
 * - `WithCheckboxItems` — toggle column visibility per row
 * - `WithRadioGroup` — single selection (e.g. priority)
 * - `TableRow` — realistic table row right-click menu
 */
const meta = {
  title: 'UI/Overlays/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Right-click (or long-press on touch) to open. All items support `disabled` and keyboard navigation. ' +
          'Use `ContextMenuCheckboxItem` for multi-select and `ContextMenuRadioGroup` for single selection.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Right-click the area to open the context menu. */
export const Default: Story = {
  render: () => (
    <div className="p-8">
      <ContextMenu>
        <ContextMenuTrigger id="cm-trigger">
          <div className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 text-sm text-muted-foreground select-none">
            Right-click anywhere in this area
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52">
          <ContextMenuLabel>PO-2025-0421</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Pencil className="mr-2 h-4 w-4" />Edit Order
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />Duplicate
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Link className="mr-2 h-4 w-4" />Copy Link
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ExternalLink className="mr-2 h-4 w-4" />Open in…
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>New Tab</ContextMenuItem>
              <ContextMenuItem>New Window</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />Cancel Order
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

/**
 * Column visibility — `ContextMenuCheckboxItem` for multi-select.
 * Phase 5 story: demonstrates checkbox toggle pattern.
 */
export const WithCheckboxItems: Story = {
  render: () => {
    const [cols, setCols] = React.useState({ partner: true, amount: true, date: false, status: true });
    return (
      <div className="p-8">
        <ContextMenu>
          <ContextMenuTrigger id="cm-cols-trigger">
            <div className="flex h-20 w-72 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 text-sm text-muted-foreground select-none">
              Right-click to toggle columns
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            <ContextMenuLabel>Toggle Columns</ContextMenuLabel>
            <ContextMenuSeparator />
            {(Object.keys(cols) as Array<keyof typeof cols>).map(key => (
              <ContextMenuCheckboxItem
                key={key}
                checked={cols[key]}
                onCheckedChange={(v) => setCols(c => ({ ...c, [key]: v }))}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ContextMenuCheckboxItem>
            ))}
          </ContextMenuContent>
        </ContextMenu>
        <div className="mt-4 p-3 rounded-lg border bg-muted/30 text-xs text-muted-foreground">
          Visible: {Object.entries(cols).filter(([,v]) => v).map(([k]) => k).join(', ')}
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: '`ContextMenuCheckboxItem` — mutiple items can be checked simultaneously.' } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/visible:/i)).toBeInTheDocument();
  },
};

/**
 * Priority radio — `ContextMenuRadioGroup` for single-selection.
 */
export const WithRadioGroup: Story = {
  render: () => {
    const [priority, setPriority] = React.useState('medium');
    return (
      <div className="p-8">
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="flex h-20 w-72 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 text-sm text-muted-foreground select-none">
              Right-click to set priority
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-44">
            <ContextMenuLabel>Set Priority</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value={priority} onValueChange={setPriority}>
              <ContextMenuRadioItem value="urgent">🔴 Urgent</ContextMenuRadioItem>
              <ContextMenuRadioItem value="high">🟠 High</ContextMenuRadioItem>
              <ContextMenuRadioItem value="medium">🟡 Medium</ContextMenuRadioItem>
              <ContextMenuRadioItem value="low">🟢 Low</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
        <div className="mt-4 p-3 rounded-lg border bg-muted/30 text-xs text-muted-foreground">
          Priority: <strong>{priority}</strong>
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: '`ContextMenuRadioGroup` — only one item selected at a time.' } },
  },
};

/** Realistic partner table row right-click. */
export const TableRowMenu: Story = {
  render: () => {
    const [starred, setStarred] = React.useState(false);
    const [hidden, setHidden] = React.useState(false);
    return (
      <div className="p-8">
        <ContextMenu>
          <ContextMenuTrigger>
            <div className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer select-none transition-colors hover:bg-muted/40 ${hidden ? 'opacity-40' : ''}`}>
              <div>
                <p className="font-medium text-sm">Agro Supplies Co.</p>
                <p className="text-xs text-muted-foreground">VND-001 · Produce · Delhi</p>
              </div>
              <div className="flex items-center gap-2">
                {starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                <span className="text-xs font-medium text-emerald-600">Active</span>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuLabel>VND-001</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</ContextMenuItem>
            <ContextMenuItem><Pencil className="mr-2 h-4 w-4" />Edit Partner</ContextMenuItem>
            <ContextMenuItem><Download className="mr-2 h-4 w-4" />Export Data</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked={starred} onCheckedChange={setStarred}>
              <Star className="mr-2 h-4 w-4" />Star Partner
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>
              {hidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
              {hidden ? 'Show Row' : 'Hide Row'}
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />Remove Partner
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'Realistic partner row with star/hide checkbox items. State is reflected on the row.' } },
  },
};
