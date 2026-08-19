import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { Toaster } from '../toaster';
import { useToast } from '../../../../hooks/use-toast';

beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = vi.fn();
  }
});

// Helper: mounts a button that fires a toast when clicked
function ToastTrigger({ title, description }: { title?: string; description?: string }) {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title, description })}>Fire Toast</button>
  );
}

function Setup(props: { title?: string; description?: string }) {
  return (
    <>
      <Toaster />
      <ToastTrigger {...props} />
    </>
  );
}

describe('Toaster', () => {
  it('renders the Toaster viewport (ol element) without crashing', () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('shows a toast with title after trigger click', async () => {
    render(<Setup title="Hello world" />);
    await act(async () => {
      screen.getByRole('button', { name: /fire toast/i }).click();
    });
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('shows both title and description', async () => {
    render(<Setup title="Info" description="Something happened." />);
    await act(async () => {
      screen.getByRole('button', { name: /fire toast/i }).click();
    });
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Something happened.')).toBeInTheDocument();
  });

  it('shows description-only toast (title omitted)', async () => {
    render(<Setup description="Description only" />);
    await act(async () => {
      screen.getByRole('button', { name: /fire toast/i }).click();
    });
    expect(screen.getByText('Description only')).toBeInTheDocument();
  });

  it('renders a ToastClose X button inside the displayed toast', async () => {
    const { container } = render(<Setup title="Closeable" />);
    await act(async () => {
      screen.getByRole('button', { name: /fire toast/i }).click();
    });
    const closeBtn = container.querySelector('[toast-close]');
    expect(closeBtn).toBeInTheDocument();
  });
});
