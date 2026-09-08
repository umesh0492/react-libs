import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { Inbox } from 'lucide-react';
import { RoleEmptyState } from '../role-empty-state';

describe('RoleEmptyState component', () => {
  it('renders title, subtitle, and action button', () => {
    const handleAction = vi.fn();
    render(
      <RoleEmptyState
        title="No Orders Found"
        subtitle="You do not have any active orders."
        icon={Inbox}
        actionLabel="Create Order"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No Orders Found')).toBeInTheDocument();
    expect(screen.getByText('You do not have any active orders.')).toBeInTheDocument();

    const actionBtn = screen.getByRole('button', { name: /create order/i });
    expect(actionBtn).toBeInTheDocument();

    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('opens help sheet when onAction is not provided', () => {
    render(
      <RoleEmptyState
        title="Empty Section"
        subtitle="Explore docs to learn more."
        icon={Inbox}
        actionLabel="View Documentation"
        helpTitle="Help & Knowledge Base"
        helpDescription="Learn how to manage this section."
        helpLinks={[
          { label: "API Reference", href: "https://example.com/api" },
        ]}
      />
    );

    const actionBtn = screen.getByRole('button', { name: /view documentation/i });
    fireEvent.click(actionBtn);

    expect(screen.getByText('Help & Knowledge Base')).toBeInTheDocument();
    expect(screen.getByText('Learn how to manage this section.')).toBeInTheDocument();
    expect(screen.getByText('API Reference')).toBeInTheDocument();
  });

  it('renders skeleton loading state when loadingMs is set', () => {
    const { container } = render(
      <RoleEmptyState
        title="Loaded Title"
        subtitle="Loaded Subtitle"
        icon={Inbox}
        loadingMs={5000}
      />
    );

    // Should display skeleton indicators
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Loaded Title')).toBeNull();
  });
});
