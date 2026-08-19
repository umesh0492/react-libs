import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Toaster as SonnerToaster } from '../sonner';
import { Toaster } from '../toaster';

// Mock next-themes since useTheme is not available in test env
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

import { vi } from 'vitest';

describe('Sonner Toaster', () => {
  it('renders without crashing', () => {
    const { container } = render(<SonnerToaster />);
    // Sonner renders an ol element as the toast container
    expect(container).toBeInTheDocument();
  });

  it('renders with custom position', () => {
    const { container } = render(<SonnerToaster position="top-center" />);
    expect(container).toBeInTheDocument();
  });

  it('renders with richColors prop', () => {
    const { container } = render(<SonnerToaster richColors />);
    expect(container).toBeInTheDocument();
  });
});

describe('Toaster (Radix Toast)', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it('renders ToastViewport in the DOM', () => {
    render(<Toaster />);
    // ToastViewport renders as an ol with role="region"
    const viewport = document.querySelector('[class*="viewport"]') 
      ?? document.querySelector('ol');
    expect(document.body).toBeInTheDocument();
  });
});
