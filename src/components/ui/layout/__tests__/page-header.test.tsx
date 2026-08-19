import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PageHeader, PageHeaderSkeleton } from '../page-header';

describe('PageHeader', () => {
  it('renders the title as h1', () => {
    render(<PageHeader title="Partner Management" />);
    expect(screen.getByRole('heading', { name: /partner management/i })).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<PageHeader title="Orders" description="Manage all purchase orders" />);
    expect(screen.getByText('Manage all purchase orders')).toBeInTheDocument();
  });

  it('renders actions slot when provided', () => {
    render(
      <PageHeader title="Partners" actions={<button>Add Partner</button>} />
    );
    expect(screen.getByRole('button', { name: /add partner/i })).toBeInTheDocument();
  });

  it('does not render description paragraph when description is omitted', () => {
    const { container } = render(<PageHeader title="Simple Header" />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('does not render actions container when actions prop is omitted', () => {
    render(<PageHeader title="No Actions" description="Just a header" />);
    expect(screen.getByText('Just a header')).toBeInTheDocument();
    // actions container (flex shrink-0) should not exist
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders badge slot when provided', () => {
    render(
      <PageHeader title="Dashboard" badge={<span data-testid="badge">Active</span>} />
    );
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('renders breadcrumbs slot when provided', () => {
    render(
      <PageHeader title="Create Order" breadcrumbs={<nav aria-label="breadcrumb">Home</nav>} />
    );
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('applies custom className to the wrapper', () => {
    const { container } = render(
      <PageHeader title="Custom" className="my-header" />
    );
    expect(container.querySelector('.my-header')).toBeInTheDocument();
  });
});

describe('PageHeaderSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageHeaderSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders exactly 3 pulse animation divs (title + subtitle + action)', () => {
    const { container } = render(<PageHeaderSkeleton />);
    const pulses = container.querySelectorAll('[class*="animate-pulse"]');
    expect(pulses.length).toBe(3);
  });

  it('renders an h-7 title placeholder', () => {
    const { container } = render(<PageHeaderSkeleton />);
    expect(container.querySelector('.h-7')).toBeInTheDocument();
  });

  it('renders an h-9 action button placeholder', () => {
    const { container } = render(<PageHeaderSkeleton />);
    expect(container.querySelector('.h-9')).toBeInTheDocument();
  });
});
