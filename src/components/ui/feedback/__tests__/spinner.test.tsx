import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../spinner';

describe('Spinner component', () => {
  it('renders with role="status" and default aria-label', () => {
    render(<Spinner data-testid="spinner" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('merges custom className and custom aria-label', () => {
    render(
      <Spinner
        className="size-8 text-primary"
        aria-label="Loading custom data"
      />
    );
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading custom data');
    expect(spinner).toHaveClass('size-8');
    expect(spinner).toHaveClass('text-primary');
  });
});
