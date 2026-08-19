// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { DataTable } from './data-table';
import { StatusBadge } from './status-badge';

/**
 * Generic sortable data table with loading skeletons, empty state, and pagination.
 *
 * **Phase 5 — Pagination single-row fix:**
 * - Removed `flex-col gap-3 sm:flex-row` — now always `flex items-center justify-between`
 * - Record count is on the left, prev/page-numbers/next stay on the right — **one line always**
 * - Page window: max 5 visible pages with smart leading/trailing `…` ellipsis
 * - `←` / `→` arrow buttons (not "← Prev" / "Next →" text) to save horizontal space
 * - `aria-label` on Prev/Next + `aria-current="page"` on active page button
 */
const meta = {
  title: 'UI/Data-display/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'TanStack Table-compatible generic DataTable. Supports sortable columns, skeleton loading, ' +
          'empty state, row click, and **single-row pagination** with ellipsis windowing.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Sample data ─────────────────────────────────────────────────────────────

type Partner = {
  id: string;
  name: string;
  category: string;
  status: string;
  city: string;
  score: number;
};

const PARTNERS: Partner[] = [
  { id: 'VND-001', name: 'Agro Supplies Co.',   category: 'Produce',  status: 'active',    city: 'Delhi',     score: 4.8 },
  { id: 'VND-002', name: 'Metro Grains Ltd.',   category: 'Grains',   status: 'pending',   city: 'Mumbai',    score: 3.9 },
  { id: 'VND-003', name: 'South Agrotech',     category: 'Spices',   status: 'active',    city: 'Chennai',   score: 4.5 },
  { id: 'VND-004', name: 'Punjab Farms',        category: 'Dairy',    status: 'inactive',  city: 'Ludhiana',  score: 3.2 },
  { id: 'VND-005', name: 'Deccan Organic',      category: 'Organic',  status: 'active',    city: 'Pune',      score: 4.7 },
  { id: 'VND-006', name: 'Sunrise Traders',     category: 'Spices',   status: 'suspended', city: 'Hyderabad', score: 2.8 },
  { id: 'VND-007', name: 'GreenLeaf Exports',   category: 'Produce',  status: 'active',    city: 'Bangalore', score: 4.6 },
  { id: 'VND-008', name: 'Coastal Fisheries',   category: 'Seafood',  status: 'active',    city: 'Kochi',     score: 4.3 },
];

// Generate 20 rows for pagination demo
const MANY_PARTNERS: Partner[] = Array.from({ length: 20 }, (_, i) => ({
  ...PARTNERS[i % PARTNERS.length],
  id: `VND-${String(i + 1).padStart(3, '0')}`,
  name: `${PARTNERS[i % PARTNERS.length].name} ${i >= 8 ? `(${Math.floor(i / 8) + 1})` : ''}`.trim(),
}));

const partnerColumns = [
  { key: 'id',       header: 'Partner ID',  className: 'font-mono text-xs text-muted-foreground w-24' },
  { key: 'name',     header: 'Name',       className: 'font-medium' },
  { key: 'category', header: 'Category' },
  { key: 'city',     header: 'City' },
  {
    key: 'status',
    header: 'Status',
    cell: (row: Partner) => <StatusBadge status={row.status as any} size="sm" />,
  },
  {
    key: 'score',
    header: 'Score',
    sortable: true,
    className: 'text-right tabular-nums',
    cell: (row: Partner) => (
      <span className={row.score >= 4.5 ? 'text-emerald-600 font-medium' : row.score < 3.5 ? 'text-red-500' : ''}>
        {row.score.toFixed(1)}
      </span>
    ),
  },
];

// ── Stories ──────────────────────────────────────────────────────────────────

/** Default — static data, no pagination. */
export const Default: Story = {
  render: () => (
    <DataTable
      columns={partnerColumns}
      data={PARTNERS}
      rowKey={(r) => r.id}
      emptyMessage="No partners found."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Partner ID')).toBeInTheDocument();
    expect(canvas.getByText('Agro Supplies Co.')).toBeInTheDocument();
  },
};

/**
 * Pagination — single-row layout fix.
 *
 * The pagination bar is always **one line**: left = record range, right = ← · pages · →
 * Page 5 of 10 shows `1 … 3 4 [5] 6 7 … 10` with ellipsis.
 */
export const WithPagination: Story = {
  render: () => {
    const PAGE_SIZE = 3;
    const [page, setPage] = React.useState(1);
    const [sortKey, setSortKey] = React.useState<string | undefined>();
    const [sortDir, setSortDir] = React.useState<'asc' | 'desc' | null>(null);

    const sorted = React.useMemo(() => {
      if (!sortKey || !sortDir) return MANY_PARTNERS;
      return [...MANY_PARTNERS].sort((a, b) => {
        const av = a[sortKey as keyof Partner];
        const bv = b[sortKey as keyof Partner];
        if (typeof av === 'number' && typeof bv === 'number')
          return sortDir === 'asc' ? av - bv : bv - av;
        return 0;
      });
    }, [sortKey, sortDir]);

    const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground px-0.5">
          Pagination is always <strong>single-row</strong>: record count left, ← pages → right.
        </p>
        <DataTable
          columns={partnerColumns}
          data={pageData}
          rowKey={(r) => r.id}
          sortKey={sortKey}
          sortDirection={sortDir}
          onSort={(k, d) => { setSortKey(k); setSortDir(d); setPage(1); }}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total: MANY_PARTNERS.length,
            onPageChange: setPage,
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '20 rows, 3 per page = 7 pages. Pagination is always a single row — record count left, nav right. ' +
          'Page window shows max 5 pages with `…` ellipsis at edges. Sort by Score toggles asc/desc/none.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextBtn = canvasElement.querySelector('[aria-label="Next page"]');
    const prevBtn = canvasElement.querySelector('[aria-label="Previous page"]');
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();

    await userEvent.click(nextBtn as Element);
    await waitFor(() => {
      const activePage = canvasElement.querySelector('[aria-current="page"]');
      expect(activePage?.textContent).toContain('2');
    });
  },
};

/** Loading state — skeleton rows. */
export const Loading: Story = {
  render: () => (
    <DataTable
      columns={partnerColumns}
      data={[]}
      isLoading
      skeletonRows={6}
    />
  ),
  parameters: {
    docs: { description: { story: '6 skeleton rows while data is loading.' } },
  },
  play: async ({ canvasElement }) => {
    const skeletons = canvasElement.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  },
};

/** Empty state. */
export const Empty: Story = {
  render: () => (
    <DataTable
      columns={partnerColumns}
      data={[]}
      emptyMessage="No partners match your search. Try removing filters."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/no partners match/i)).toBeInTheDocument();
  },
};

/** Sortable columns with click handler. */
export const Sortable: Story = {
  render: () => {
    const [sortKey, setSortKey] = React.useState<string>('score');
    const [sortDir, setSortDir] = React.useState<'asc' | 'desc' | null>('desc');

    const sortedData = React.useMemo(() => {
      if (!sortKey || !sortDir) return PARTNERS;
      return [...PARTNERS].sort((a, b) => {
        const av = a[sortKey as keyof Partner];
        const bv = b[sortKey as keyof Partner];
        if (typeof av === 'number' && typeof bv === 'number')
          return sortDir === 'asc' ? av - bv : bv - av;
        return 0;
      });
    }, [sortKey, sortDir]);

    return (
      <DataTable
        columns={partnerColumns}
        data={sortedData}
        rowKey={(r) => r.id}
        sortKey={sortKey}
        sortDirection={sortDir}
        onSort={(k, d) => { setSortKey(k); setSortDir(d); }}
      />
    );
  },
  parameters: {
    docs: { description: { story: 'Click the Score header to toggle asc → desc → unsorted.' } },
  },
};

/** Row click — navigates to detail. */
export const ClickableRows: Story = {
  render: () => {
    const [clicked, setClicked] = React.useState<string | null>(null);
    return (
      <div className="space-y-3">
        <DataTable
          columns={partnerColumns}
          data={PARTNERS.slice(0, 4)}
          rowKey={(r) => r.id}
          onRowClick={(row) => setClicked(row.id as string)}
        />
        {clicked && (
          <p className="text-sm text-muted-foreground px-1">
            Clicked: <strong className="text-foreground">{clicked}</strong>
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'Rows get `cursor-pointer` when `onRowClick` is set.' } },
  },
};
