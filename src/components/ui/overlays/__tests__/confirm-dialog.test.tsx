import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ConfirmDialog } from '../confirm-dialog';

describe('ConfirmDialog', () => {
  const baseProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Delete Partner?',
    onConfirm: vi.fn(),
  };

  it('renders title when open', () => {
    render(<ConfirmDialog {...baseProps} />);
    expect(screen.getByText('Delete Partner?')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ConfirmDialog {...baseProps} description="This action cannot be undone." />);
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    render(<ConfirmDialog {...baseProps} />);
    expect(screen.queryByText('This action cannot be undone.')).not.toBeInTheDocument();
  });

  it('renders default confirm and cancel labels', () => {
    render(<ConfirmDialog {...baseProps} />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders custom confirm and cancel labels', () => {
    render(<ConfirmDialog {...baseProps} confirmLabel="Delete" cancelLabel="Go back" />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Go back')).toBeInTheDocument();
  });

  it('calls onConfirm when Confirm is clicked', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmDialog {...baseProps} onConfirm={onConfirm} confirmLabel="Confirm" />);
    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows spinner icon and disables buttons when isLoading', () => {
    render(<ConfirmDialog {...baseProps} isLoading confirmLabel="Saving" />);
    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('Saving')).toBeDisabled();
  });

  it('applies destructive variant styling', () => {
    render(<ConfirmDialog {...baseProps} variant="destructive" confirmLabel="Delete" />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    render(<ConfirmDialog {...baseProps} open={false} />);
    expect(screen.queryByText('Delete Partner?')).not.toBeInTheDocument();
  });
});
