import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DataTablePagination, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '../pagination';

describe('Pagination Primitives', () => {
  it('renders Pagination as nav', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(container.querySelector('nav[aria-label="pagination"]')).toBeInTheDocument();
  });

  it('renders PaginationPrevious with aria-label', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('renders PaginationPrevious with showText={false}', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" showText={false} /></PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });

  it('renders PaginationNext with aria-label', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders PaginationNext with showText={false}', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationNext href="#" showText={false} /></PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('renders PaginationLink with isActive', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>3</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('3')).toHaveAttribute('aria-current', 'page');
  });

  it('renders PaginationEllipsis', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationEllipsis /></PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('More pages')).toBeInTheDocument();
  });
});

describe('DataTablePagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    onPageChange: vi.fn(),
  };

  it('renders showing range text', () => {
    render(<DataTablePagination {...defaultProps} />);
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });

  it('shows correct range on page 1', () => {
    render(<DataTablePagination {...defaultProps} itemsPerPage={10} />);
    // The range spans are inside the showing text
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    // Check the summary contains the expected numbers via the Showing text region
    const allSpans = screen.getAllByText('1');
    expect(allSpans.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('10').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('50').length).toBeGreaterThanOrEqual(1);
  });

  it('shows correct range on page 2', () => {
    render(
      <DataTablePagination
        currentPage={2}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('handles totalItems=0 gracefully', () => {
    render(
      <DataTablePagination
        currentPage={1}
        totalPages={0}
        totalItems={0}
        onPageChange={vi.fn()}
      />
    );
    // When 0 items, the start is shown as 0
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onPageChange with previous page', async () => {
    const user = userEvent.setup({ delay: null });
    const onPageChange = vi.fn();
    render(
      <DataTablePagination currentPage={3} totalPages={5} totalItems={50} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText('Go to previous page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with next page', async () => {
    const user = userEvent.setup({ delay: null });
    const onPageChange = vi.fn();
    render(
      <DataTablePagination currentPage={2} totalPages={5} totalItems={50} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText('Go to next page'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('previous button is disabled on page 1', async () => {
    const user = userEvent.setup({ delay: null });
    const onPageChange = vi.fn();
    render(
      <DataTablePagination currentPage={1} totalPages={5} totalItems={50} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText('Go to previous page'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('next button is disabled on last page', async () => {
    const user = userEvent.setup({ delay: null });
    const onPageChange = vi.fn();
    render(
      <DataTablePagination currentPage={5} totalPages={5} totalItems={50} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText('Go to next page'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('renders page numbers when totalPages <= 5', () => {
    render(
      <DataTablePagination currentPage={1} totalPages={3} totalItems={30} onPageChange={vi.fn()} />
    );
    // Page 1 should appear (may appear multiple times with the range display)
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
  });

  it('renders ellipsis for large page counts near start', () => {
    render(
      <DataTablePagination currentPage={2} totalPages={10} totalItems={100} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('More pages')).toBeInTheDocument();
  });

  it('renders ellipsis for large page counts near end', () => {
    render(
      <DataTablePagination currentPage={9} totalPages={10} totalItems={100} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('More pages')).toBeInTheDocument();
  });

  it('renders current page number as active', () => {
    render(
      <DataTablePagination currentPage={3} totalPages={5} totalItems={50} onPageChange={vi.fn()} />
    );
    const activeLink = screen.getAllByText('3').find(
      el => el.getAttribute('aria-current') === 'page'
    );
    expect(activeLink).toBeDefined();
  });

  it('calls onPageChange when page number is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onPageChange = vi.fn();
    render(
      <DataTablePagination currentPage={1} totalPages={4} totalItems={40} onPageChange={onPageChange} />
    );
    // Get all page links and click page 2
    const page2Links = screen.getAllByText('2');
    if (page2Links.length > 0) {
      await user.click(page2Links[0]);
      expect(onPageChange).toHaveBeenCalledWith(2);
    }
  });
});
