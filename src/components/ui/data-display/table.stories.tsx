// @ts-nocheck
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

const PARTNERS = [
  { id: 'VND-001', name: 'Agro Supplies Co.', category: 'Produce',       status: 'active',   due: '₹1,24,500' },
  { id: 'VND-002', name: 'Metro Grains Ltd.', category: 'Grains',        status: 'pending',  due: '₹87,200' },
  { id: 'VND-003', name: 'South Agrotech',     category: 'Spices',        status: 'active',   due: '₹2,08,750' },
  { id: 'VND-004', name: 'Punjab Farms',      category: 'Dairy',         status: 'inactive', due: '₹0' },
  { id: 'VND-005', name: 'Deccan Organic',    category: 'Organic',       status: 'suspended', due: '₹56,300' },
];

/**
 * Standard partner list table.
 * Notice:
 * - Muted header background (bg-muted/30) ← fix
 * - Soft border lines (border-border/60) ← fix
 */
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Partner registry — FY 2025–26</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Partner ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Outstanding Due</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PARTNERS.map((v) => (
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
          <TableCell className="text-right font-semibold tabular-nums">₹4,76,750</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('table')).toBeInTheDocument();
    expect(canvas.getAllByRole('row').length).toBeGreaterThanOrEqual(6);
    // Header should be present
    expect(canvas.getByText('Partner ID')).toBeInTheDocument();
  },
};

/**
 * Row selection — selected rows use `data-[state=selected]` → `bg-primary/5`.
 */
export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Set<string>>(new Set(['VND-002']));
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
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PARTNERS.map(v => (
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
          <TableHead>SKU</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Price (₹/kg)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { sku: 'SKU-101', name: 'Basmati Rice', price: '92.00' },
          { sku: 'SKU-102', name: 'Toor Dal',     price: '145.50' },
          { sku: 'SKU-103', name: 'Turmeric',     price: '310.00' },
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
