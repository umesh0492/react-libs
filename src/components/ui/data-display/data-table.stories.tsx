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

type RecordItem = {
  id: string;
  name: string;
  category: string;
  status: string;
  city: string;
  score: number;
};

const SAMPLE_RECORDS: RecordItem[] = [
  { id: 'REC-001', name: 'Acme Corporation',   category: 'Cloud Services', status: 'active',    city: 'New York',      score: 4.8 },
  { id: 'REC-002', name: 'Globex Industries',  category: 'Hardware',       status: 'pending',   city: 'San Francisco', score: 3.9 },
  { id: 'REC-003', name: 'Initech Software',   category: 'Developer Tools',status: 'active',    city: 'Austin',        score: 4.5 },
  { id: 'REC-004', name: 'Starlight Media',    category: 'Media',          status: 'inactive',  city: 'Los Angeles',   score: 3.2 },
  { id: 'REC-005', name: 'Nexus Technologies', category: 'Security',       status: 'active',    city: 'Seattle',       score: 4.7 },
  { id: 'REC-006', name: 'Soylent Solutions',  category: 'Analytics',      status: 'suspended', city: 'Chicago',       score: 2.8 },
  { id: 'REC-007', name: 'Umbrella Systems',   category: 'Cloud Services', status: 'active',    city: 'Boston',        score: 4.6 },
  { id: 'REC-008', name: 'Massive Dynamics',   category: 'Robotics',       status: 'active',    city: 'Denver',        score: 4.3 },
];

// Generate 20 rows for pagination demo
const MANY_RECORDS: RecordItem[] = Array.from({ length: 20 }, (_, i) => ({
  ...SAMPLE_RECORDS[i % SAMPLE_RECORDS.length],
  id: `REC-${String(i + 1).padStart(3, '0')}`,
  name: `${SAMPLE_RECORDS[i % SAMPLE_RECORDS.length].name} ${i >= 8 ? `(${Math.floor(i / 8) + 1})` : ''}`.trim(),
}));

const recordColumns = [
  { key: 'id',       header: 'Record ID',  className: 'font-mono text-xs text-muted-foreground w-24' },
  { key: 'name',     header: 'Name',       className: 'font-medium' },
  { key: 'category', header: 'Category' },
  { key: 'city',     header: 'City' },
  {
    key: 'status',
    header: 'Status',
    cell: (row: RecordItem) => <StatusBadge status={row.status as any} size="sm" />,
  },
  {
    key: 'score',
    header: 'Score',
    sortable: true,
    className: 'text-right tabular-nums',
    cell: (row: RecordItem) => (
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
      columns={recordColumns}
      data={SAMPLE_RECORDS}
      rowKey={(r) => r.id}
      emptyMessage="No records found."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Record ID')).toBeInTheDocument();
    expect(canvas.getByText('Acme Corporation')).toBeInTheDocument();
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
      if (!sortKey || !sortDir) return MANY_RECORDS;
      return [...MANY_RECORDS].sort((a, b) => {
        const av = a[sortKey as keyof RecordItem];
        const bv = b[sortKey as keyof RecordItem];
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
          columns={recordColumns}
          data={pageData}
          rowKey={(r) => r.id}
          sortKey={sortKey}
          sortDirection={sortDir}
          onSort={(k, d) => { setSortKey(k); setSortDir(d); setPage(1); }}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total: MANY_RECORDS.length,
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
      columns={recordColumns}
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
      columns={recordColumns}
      data={[]}
      emptyMessage="No records match your search. Try removing filters."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/no records match/i)).toBeInTheDocument();
  },
};

/** Sortable columns with click handler. */
export const Sortable: Story = {
  render: () => {
    const [sortKey, setSortKey] = React.useState<string>('score');
    const [sortDir, setSortDir] = React.useState<'asc' | 'desc' | null>('desc');

    const sortedData = React.useMemo(() => {
      if (!sortKey || !sortDir) return SAMPLE_RECORDS;
      return [...SAMPLE_RECORDS].sort((a, b) => {
        const av = a[sortKey as keyof RecordItem];
        const bv = b[sortKey as keyof RecordItem];
        if (typeof av === 'number' && typeof bv === 'number')
          return sortDir === 'asc' ? av - bv : bv - av;
        return 0;
      });
    }, [sortKey, sortDir]);

    return (
      <DataTable
        columns={recordColumns}
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
          columns={recordColumns}
          data={SAMPLE_RECORDS.slice(0, 4)}
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
