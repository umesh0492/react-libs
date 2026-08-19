import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PdfViewer } from '../pdf-viewer';
import React from 'react';

// Safely mock react-pdf components structurally for JSDOM constraints.
vi.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: '' } },
  Document: ({ children, file, onLoadSuccess, onLoadError }: any) => {
    // Stub native component rendering bounds.
    if (file === 'error.pdf') {
      React.useEffect(() => {
        onLoadError(new Error('Failed to load PDF'));
      }, [onLoadError]);

      return null;
    }

    // Simulate successful multi-page load deterministically once mounted.
    React.useEffect(() => {
      onLoadSuccess({ numPages: 5 });
    }, [onLoadSuccess]);

    return <div data-testid="pdf-document" data-file={file}>{children}</div>;
  },
  Page: ({ pageNumber }: any) => (
    <div data-testid="pdf-page" data-page={pageNumber}>Page {pageNumber} simulated.</div>
  )
}));

describe('PdfViewer Component', () => {

  it('renders structurally inside the document mapping bounds successfully', async () => {
    render(<PdfViewer file="test.pdf" />);
    // Initial wrapper loads asynchronously simulating state payload.
    expect(await screen.findByTestId('pdf-document')).toBeInTheDocument();
    expect(screen.getByTestId('pdf-page')).toHaveAttribute('data-page', "1");
  });

  it('displays navigation controls correctly for multi-page documents securely', async () => {
    render(<PdfViewer file="test.pdf" />);
    // Wait for the mocked multi-page load state to settle before asserting controls.
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    });

    const nextBtn = screen.getByRole('button', { name: /next/i });
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeDisabled(); // Initially on page 1
  });

  it('shows bound error states visually when failures fire directly from react-pdf', async () => {
    render(<PdfViewer file="error.pdf" />);
    // Expect error boundary configuration tracking properly.
    const errs = await screen.findAllByText(/failed to load pdf/i);
    expect(errs.length).toBeGreaterThan(0);
  });

});
