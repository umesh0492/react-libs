import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { StatusBadge } from '../status-badge';

describe('StatusBadge component', () => {
  it('renders known status with default label and dot indicator', () => {
    render(<StatusBadge status="confirmed" />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    const dot = document.querySelector('.rounded-full.shrink-0');
    expect(dot).toBeInTheDocument();
  });

  it('renders custom label when provided', () => {
    render(<StatusBadge status="pending" label="Awaiting Approval" />);
    expect(screen.getByText('Awaiting Approval')).toBeInTheDocument();
  });

  it('renders unknown status fallback gracefully', () => {
    render(<StatusBadge status={"custom_unrecognized" as any} />);
    expect(screen.getByText('custom_unrecognized')).toBeInTheDocument();
  });

  it('hides dot indicator when showDot is false', () => {
    render(<StatusBadge status="delivered" showDot={false} />);
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    const dot = document.querySelector('.rounded-full.shrink-0');
    expect(dot).toBeNull();
  });

  it('applies sm size styles', () => {
    const { container } = render(<StatusBadge status="active" size="sm" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('py-0.5');
  });
});
