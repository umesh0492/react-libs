import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastProvider,
  ToastViewport,
} from '../toast';

beforeAll(() => {
  // Radix Toast relies on pointer events, which are poorly supported in JSDOM.
  // Mock hasPointerCapture to prevent unhandled exception during click/dismiss tests.
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = vi.fn();
  }
});

// Minimal wrapper providing the required Radix context
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  );
}

describe('Toast', () => {
  it('renders default toast with title', () => {
    render(
      <Wrapper>
        <Toast open>
          <ToastTitle>Upload complete</ToastTitle>
        </Toast>
      </Wrapper>
    );
    expect(screen.getByText('Upload complete')).toBeInTheDocument();
  });

  it('renders with destructive variant', () => {
    const { container } = render(
      <Wrapper>
        <Toast open variant="destructive">
          <ToastTitle>Error occurred</ToastTitle>
        </Toast>
      </Wrapper>
    );
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    const toast = container.querySelector('[data-state]');
    expect(toast).toBeTruthy();
  });

  it('renders title AND description together', () => {
    render(
      <Wrapper>
        <Toast open>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Your changes have been saved.</ToastDescription>
        </Toast>
      </Wrapper>
    );
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
  });

  it('renders description-only toast (no title)', () => {
    render(
      <Wrapper>
        <Toast open>
          <ToastDescription>Sync completed.</ToastDescription>
        </Toast>
      </Wrapper>
    );
    expect(screen.getByText('Sync completed.')).toBeInTheDocument();
  });

  it('renders ToastAction and fires onClick', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup({ delay: null });
    render(
      <Wrapper>
        <Toast open duration={0}>
          <ToastTitle>File deleted</ToastTitle>
          <ToastAction altText="Undo deletion" onClick={onAction}>
            Undo
          </ToastAction>
        </Toast>
      </Wrapper>
    );
    const btn = screen.getByRole('button', { name: /undo/i });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders ToastClose button', () => {
    const { container } = render(
      <Wrapper>
        <Toast open>
          <ToastTitle>Info</ToastTitle>
          <ToastClose />
        </Toast>
      </Wrapper>
    );
    const closeBtn = container.querySelector('[toast-close]');
    expect(closeBtn).toBeInTheDocument();
  });

  it('applies custom className to Toast', () => {
    const { container } = render(
      <Wrapper>
        <Toast open className="my-custom-toast">
          <ToastTitle>Custom class</ToastTitle>
        </Toast>
      </Wrapper>
    );
    const toast = container.querySelector('.my-custom-toast');
    expect(toast).toBeInTheDocument();
  });

  it('does not render content when open is false', () => {
    render(
      <Wrapper>
        <Toast open={false}>
          <ToastTitle>Hidden toast</ToastTitle>
        </Toast>
      </Wrapper>
    );
    expect(screen.queryByText('Hidden toast')).not.toBeInTheDocument();
  });
});

describe('ToastViewport', () => {
  it('renders the viewport container as an ol', () => {
    const { container } = render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
    const viewport = container.querySelector('ol');
    expect(viewport).toBeInTheDocument();
  });

  it('applies custom className to viewport', () => {
    const { container } = render(
      <ToastProvider>
        <ToastViewport className="custom-viewport" />
      </ToastProvider>
    );
    const viewport = container.querySelector('.custom-viewport');
    expect(viewport).toBeInTheDocument();
  });
});
