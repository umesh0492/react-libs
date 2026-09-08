import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Plus } from 'lucide-react';
import { EmptyState } from '../empty-state';

describe('EmptyState component', () => {
  it('renders default icon, title, and description', () => {
    render(
      <EmptyState
        title="No Results"
        description="Try adjusting your search criteria."
      />
    );
    expect(screen.getByText('No Results')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria.')).toBeInTheDocument();
  });

  it('renders action button with icon and handles click', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No Projects"
        actionLabel="Create Project"
        actionIcon={<Plus data-testid="plus-icon" />}
        onAction={handleAction}
      />
    );

    const button = screen.getByRole('button', { name: /create project/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders custom icon component and unbordered style', () => {
    const CustomIcon = ({ className }: { className?: string }) => (
      <span data-testid="custom-icon" className={className}>★</span>
    );

    const { container } = render(
      <EmptyState
        icon={CustomIcon}
        title="Starred Items"
        bordered={false}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(container.firstChild).not.toHaveClass('border-2');
  });
});
