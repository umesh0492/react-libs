import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { StatusBadge } from './status-badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

/**
 * A semantic HTML table with styled sub-components.
 *
 * **Phase 3 fixes:**
 * - `TableHeader` now has `bg-muted/30` background — visually distinct from body rows
 * - Row borders softened to `border-border/60` (lighter, less aggressive grid lines)
 * - Row hover changed to `hover:bg-muted/40` (slightly more visible on white bg)
 * - Selected Row now uses `bg-primary/5` (subtle primary tint) instead of `bg-muted`
 */
const meta = {
  title: 'UI/Data-display/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Styled HTML `<table>` primitives. `TableHeader` has a muted bg; rows have soft borders. ' +
          'For sorting/filtering/pagination use the `DataTable` component.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const INVOICES = [
  { id: 'INV-001', name: 'Acme Corporation',   category: 'Enterprise Cloud', status: 'active',    due: '$12,450' },
  { id: 'INV-002', name: 'Globex Industries',  category: 'Hardware',         status: 'pending',   due: '$8,720' },
  { id: 'INV-003', name: 'Initech Software',   category: 'Developer Tools',  status: 'active',    due: '$20,875' },
  { id: 'INV-004', name: 'Starlight Media',    category: 'Media Streaming',  status: 'inactive',  due: '$0' },
  { id: 'INV-005', name: 'Nexus Technologies', category: 'Security Services',status: 'suspended', due: '$5,630' },
];

/**
 * Standard data list table.
 * Notice:
 * - Muted header background (bg-muted/30)
 * - Soft border lines (border-border/60)
 */
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Invoice summary — Q3 Operations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Service Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Outstanding Due</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((v) => (
          <TableRow key={v.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">{v.id}</TableCell>
            <TableCell className="font-medium">{v.name}</TableCell>
            <TableCell>{v.category}</TableCell>
            <TableCell>
              <StatusBadge status={v.status as any} size="sm" />
            </TableCell>
            <TableCell className="text-right tabular-nums">{v.due}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total Outstanding</TableCell>
          <TableCell className="text-right font-semibold tabular-nums">$47,675</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('table')).toBeInTheDocument();
    expect(canvas.getAllByRole('row').length).toBeGreaterThanOrEqual(6);
    // Header should be present
    expect(canvas.getByText('Invoice ID')).toBeInTheDocument();
  },
};

/**
 * Row selection — selected rows use `data-[state=selected]` → `bg-primary/5`.
 */
export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Set<string>>(new Set(['INV-002']));
    const toggle = (id: string) => setSelected(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" aria-hidden="true"></TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVOICES.map(v => (
            <TableRow
              key={v.id}
              data-state={selected.has(v.id) ? 'selected' : undefined}
              onClick={() => toggle(v.id)}
              className="cursor-pointer"
            >
              <TableCell>
                <input type="checkbox" checked={selected.has(v.id)} onChange={() => toggle(v.id)} onClick={e => e.stopPropagation()} />
              </TableCell>
              <TableCell className="font-medium">{v.name}</TableCell>
              <TableCell><StatusBadge status={v.status as any} size="sm" /></TableCell>
              <TableCell className="text-right tabular-nums">{v.due}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
  parameters: {
    docs: { description: { story: 'Click rows to toggle selection. Selected rows use `bg-primary/5` tint (fix: was `bg-muted`).' } },
  },
};

/** Minimal table without caption or footer. */
export const Minimal: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resource ID</TableHead>
          <TableHead>Service Plan</TableHead>
          <TableHead className="text-right">Rate ($/mo)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { sku: 'RES-101', name: 'Compute Instance XL',  price: '92.00' },
          { sku: 'RES-102', name: 'Postgres High-Avail', price: '145.50' },
          { sku: 'RES-103', name: 'Global CDN Ingress',   price: '310.00' },
        ].map(p => (
          <TableRow key={p.sku}>
            <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell className="text-right tabular-nums">{p.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
