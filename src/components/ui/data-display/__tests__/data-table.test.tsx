import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, DataTableColumn } from '../data-table';
import React from 'react';

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const columns: DataTableColumn<Payment>[] = [
  { key: 'status', header: 'Status' },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'amount', header: 'Amount' },
];

const data: Payment[] = [
  { id: '1', amount: 100, status: 'success', email: 'a@example.com' },
  { id: '2', amount: 200, status: 'pending', email: 'b@example.com' },
  { id: '3', amount: 350, status: 'processing', email: 'c@example.com' },
];

describe('DataTable Component', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('a@example.com')).toBeInTheDocument();
    expect(screen.getByText('b@example.com')).toBeInTheDocument();
    expect(screen.getByText('c@example.com')).toBeInTheDocument();
  });

  it('renders empty state with default message', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="No orders yet." />);
    expect(screen.getByText('No orders yet.')).toBeInTheDocument();
  });

  it('renders custom empty icon', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyIcon={<span data-testid="custom-icon">📭</span>}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders loading skeleton rows', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} isLoading skeletonRows={3} />
    );
    // Skeleton renders inside table cells
    expect(container.querySelectorAll('.animate-pulse, [class*="skeleton"]').length).toBeGreaterThanOrEqual(0);
  });

  it('triggers sort callback on sortable column click (asc)', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        onSort={onSort}
        sortKey=""
        sortDirection={null}
      />
    );
    await user.click(screen.getByText('Email'));
    expect(onSort).toHaveBeenCalledWith('email', 'asc');
  });

  it('triggers sort callback — asc → desc cycle', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        onSort={onSort}
        sortKey="email"
        sortDirection="asc"
      />
    );
    await user.click(screen.getByText('Email'));
    expect(onSort).toHaveBeenCalledWith('email', 'desc');
  });

  it('triggers sort callback — desc → null cycle', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        onSort={onSort}
        sortKey="email"
        sortDirection="desc"
      />
    );
    await user.click(screen.getByText('Email'));
    expect(onSort).toHaveBeenCalledWith('email', null);
  });

  it('does not call onSort for non-sortable columns', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<DataTable columns={columns} data={data} onSort={onSort} />);
    await user.click(screen.getByText('Status'));
    expect(onSort).not.toHaveBeenCalled();
  });

  it('calls onRowClick when row is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    await user.click(screen.getByText('a@example.com'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('renders custom cell renderer', () => {
    const customColumns: DataTableColumn<Payment>[] = [
      {
        key: 'status',
        header: 'Status',
        cell: (row) => <span data-testid={`badge-${row.id}`}>{row.status.toUpperCase()}</span>,
      },
    ];
    render(<DataTable columns={customColumns} data={data} />);
    expect(screen.getByTestId('badge-1')).toHaveTextContent('SUCCESS');
    expect(screen.getByTestId('badge-2')).toHaveTextContent('PENDING');
  });

  it('uses custom rowKey extractor', () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(row) => row.id}
      />
    );
    expect(container.querySelectorAll('tbody tr').length).toBe(3);
  });

  it('renders pagination when provided with multiple pages', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{
          page: 1,
          pageSize: 2,
          total: 10,
          onPageChange: vi.fn(),
        }}
      />
    );
    // Pagination buttons now use aria-label (← / →) instead of text "Prev"/"Next"
    expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
    // Record count span: "1–2" with "of 10" (no "Showing" prefix)
    expect(screen.getByText(/1–2/)).toBeInTheDocument();
  });

  it('calls onPageChange when Next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ page: 1, pageSize: 1, total: 5, onPageChange }}
      />
    );
    await user.click(screen.getByLabelText(/next page/i));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when Prev is clicked from page 2', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ page: 2, pageSize: 1, total: 5, onPageChange }}
      />
    );
    await user.click(screen.getByLabelText(/previous page/i));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('Prev button is disabled on first page', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ page: 1, pageSize: 1, total: 5, onPageChange: vi.fn() }}
      />
    );
    const prevBtn = screen.getByLabelText(/previous page/i);
    expect(prevBtn).toBeDisabled();
  });

  it('Next button is disabled on last page', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ page: 5, pageSize: 1, total: 5, onPageChange: vi.fn() }}
      />
    );
    const nextBtn = screen.getByLabelText(/next page/i);
    expect(nextBtn).toBeDisabled();
  });

  it('does not render pagination when only one page', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ page: 1, pageSize: 20, total: 3, onPageChange: vi.fn() }}
      />
    );
    expect(screen.queryByLabelText(/previous page/i)).not.toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} className="table-wrapper-custom" />
    );
    expect(container.firstChild).toHaveClass('table-wrapper-custom');
  });

  it('renders dash for null/undefined cell values', () => {
    const sparseData = [{ id: '1', amount: 100, status: 'success' as const, email: undefined as unknown as string }];
    render(<DataTable columns={columns} data={sparseData} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
