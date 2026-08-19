import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '../empty';
import { PackageSearch } from 'lucide-react';

describe('Empty Component Suite', () => {
  it('renders Empty container', () => {
    const { container } = render(<Empty>No data</Empty>);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty"]')).toBeInTheDocument();
  });

  it('applies custom className to Empty', () => {
    const { container } = render(<Empty className="my-empty" />);
    expect(container.firstChild).toHaveClass('my-empty');
  });

  it('renders EmptyHeader', () => {
    const { container } = render(<EmptyHeader><span>Header</span></EmptyHeader>);
    expect(container.querySelector('[data-slot="empty-header"]')).toBeInTheDocument();
  });

  it('renders EmptyTitle', () => {
    render(<EmptyTitle>No Results Found</EmptyTitle>);
    expect(screen.getByText('No Results Found')).toBeInTheDocument();
  });

  it('renders EmptyDescription', () => {
    render(<EmptyDescription>Try adjusting your filters to find what you're looking for.</EmptyDescription>);
    expect(screen.getByText(/Try adjusting/)).toBeInTheDocument();
  });

  it('renders EmptyMedia with default variant', () => {
    const { container } = render(
      <EmptyMedia>
        <PackageSearch />
      </EmptyMedia>
    );
    expect(container.querySelector('[data-slot="empty-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-variant="default"]')).toBeInTheDocument();
  });

  it('renders EmptyMedia with icon variant', () => {
    const { container } = render(
      <EmptyMedia variant="icon">
        <PackageSearch />
      </EmptyMedia>
    );
    expect(container.querySelector('[data-variant="icon"]')).toBeInTheDocument();
  });

  it('renders EmptyContent', () => {
    const { container } = render(<EmptyContent><button>Add Item</button></EmptyContent>);
    expect(container.querySelector('[data-slot="empty-content"]')).toBeInTheDocument();
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('renders a full composed Empty state', () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageSearch />
          </EmptyMedia>
          <EmptyTitle>No Orders Found</EmptyTitle>
          <EmptyDescription>
            You haven't placed any orders yet. Start by browsing products.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button>Browse Products</button>
        </EmptyContent>
      </Empty>
    );
    expect(screen.getByText('No Orders Found')).toBeInTheDocument();
    expect(screen.getByText(/haven't placed/)).toBeInTheDocument();
    expect(screen.getByText('Browse Products')).toBeInTheDocument();
  });

  it('renders EmptyHeader with multiple children', () => {
    render(
      <EmptyHeader>
        <EmptyTitle>Empty State</EmptyTitle>
        <EmptyDescription>Nothing here yet.</EmptyDescription>
      </EmptyHeader>
    );
    expect(screen.getByText('Empty State')).toBeInTheDocument();
    expect(screen.getByText('Nothing here yet.')).toBeInTheDocument();
  });

  it('applies custom className to EmptyTitle', () => {
    const { container } = render(<EmptyTitle className="custom-title">Title</EmptyTitle>);
    const el = container.querySelector('[data-slot="empty-title"]');
    expect(el).toHaveClass('custom-title');
  });
});
