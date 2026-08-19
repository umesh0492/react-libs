import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
} from '../item';

describe('Item Component Suite', () => {
  it('renders Item with default variant', () => {
    const { container } = render(<Item>Item content</Item>);
    expect(screen.getByText('Item content')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="item"]')).toBeInTheDocument();
  });

  it('renders Item with outline variant', () => {
    const { container } = render(<Item variant="outline">Outline Item</Item>);
    expect(container.querySelector('[data-variant="outline"]')).toBeInTheDocument();
  });

  it('renders Item with muted variant', () => {
    const { container } = render(<Item variant="muted">Muted Item</Item>);
    expect(container.querySelector('[data-variant="muted"]')).toBeInTheDocument();
  });

  it('renders Item with sm size', () => {
    const { container } = render(<Item size="sm">Small Item</Item>);
    expect(container.querySelector('[data-size="sm"]')).toBeInTheDocument();
  });

  it('renders Item asChild using Slot', () => {
    render(<Item asChild><a href="/link">Link Item</a></Item>);
    const link = screen.getByRole('link', { name: 'Link Item' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/link');
  });

  it('applies custom className to Item', () => {
    const { container } = render(<Item className="custom-class">Content</Item>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders ItemGroup with list role', () => {
    render(
      <ItemGroup>
        <Item>Item A</Item>
        <Item>Item B</Item>
      </ItemGroup>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
  });

  it('renders ItemSeparator', () => {
    const { container } = render(
      <ItemGroup>
        <Item>First</Item>
        <ItemSeparator />
        <Item>Second</Item>
      </ItemGroup>
    );
    expect(container.querySelector('[data-slot="item-separator"]')).toBeInTheDocument();
  });

  it('renders ItemMedia with default variant', () => {
    const { container } = render(
      <ItemMedia>
        <span>Icon</span>
      </ItemMedia>
    );
    expect(container.querySelector('[data-slot="item-media"]')).toBeInTheDocument();
  });

  it('renders ItemMedia with icon variant', () => {
    const { container } = render(<ItemMedia variant="icon"><span>🔔</span></ItemMedia>);
    expect(container.querySelector('[data-variant="icon"]')).toBeInTheDocument();
  });

  it('renders ItemMedia with image variant', () => {
    const { container } = render(<ItemMedia variant="image"><img src="#" alt="thumb" /></ItemMedia>);
    expect(container.querySelector('[data-variant="image"]')).toBeInTheDocument();
  });

  it('renders ItemContent slot', () => {
    const { container } = render(<ItemContent>Content goes here</ItemContent>);
    expect(container.querySelector('[data-slot="item-content"]')).toBeInTheDocument();
  });

  it('renders ItemTitle', () => {
    render(<ItemTitle>Order #1234</ItemTitle>);
    expect(screen.getByText('Order #1234')).toBeInTheDocument();
  });

  it('renders ItemDescription', () => {
    render(<ItemDescription>Placed on 27 Mar 2026</ItemDescription>);
    expect(screen.getByText('Placed on 27 Mar 2026')).toBeInTheDocument();
  });

  it('renders ItemActions', () => {
    render(
      <ItemActions>
        <button>Edit</button>
        <button>Delete</button>
      </ItemActions>
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders ItemHeader', () => {
    render(<ItemHeader><span>Header content</span></ItemHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('renders ItemFooter', () => {
    render(<ItemFooter><span>Footer content</span></ItemFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders a full composed Item', () => {
    render(
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon"><span>📦</span></ItemMedia>
          <ItemContent>
            <ItemTitle>Widget A</ItemTitle>
            <ItemDescription>SKU-001 · In Stock</ItemDescription>
          </ItemContent>
          <ItemActions>
            <button>View</button>
          </ItemActions>
        </Item>
      </ItemGroup>
    );
    expect(screen.getByText('Widget A')).toBeInTheDocument();
    expect(screen.getByText('SKU-001 · In Stock')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });
});
