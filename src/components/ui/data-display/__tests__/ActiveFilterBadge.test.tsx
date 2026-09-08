import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveFilterBadge } from '../ActiveFilterBadge';

describe('ActiveFilterBadge component', () => {
  it('renders label and handles onClear callback', () => {
    const handleClear = vi.fn();
    render(<ActiveFilterBadge label="Status: Active" onClear={handleClear} />);

    expect(screen.getByText('Showing: Status: Active')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /clear filter/i });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('returns null if label is empty', () => {
    const { container } = render(<ActiveFilterBadge label="" onClear={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('merges custom className', () => {
    const { container } = render(
      <ActiveFilterBadge
        label="Category: Electronics"
        onClear={vi.fn()}
        className="custom-filter-class"
      />
    );
    expect(container.firstChild).toHaveClass('custom-filter-class');
  });
});
