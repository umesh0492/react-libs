import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert Component', () => {
  it('renders alert with default variant', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>Your session expires in 5 minutes.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
    expect(screen.getByText('Your session expires in 5 minutes.')).toBeInTheDocument();
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
  });

  it('renders alert with destructive variant', () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Payment failed. Please try again.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Payment failed. Please try again.')).toBeInTheDocument();
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it('renders AlertTitle standalone', () => {
    render(<AlertTitle>Warning Title</AlertTitle>);
    expect(screen.getByText('Warning Title')).toBeInTheDocument();
  });

  it('renders AlertDescription standalone', () => {
    render(<AlertDescription>Some descriptive message here.</AlertDescription>);
    expect(screen.getByText('Some descriptive message here.')).toBeInTheDocument();
  });

  it('applies custom className to Alert', () => {
    const { container } = render(<Alert className="my-alert">Content</Alert>);
    expect(container.firstChild).toHaveClass('my-alert');
  });

  it('renders Alert without title (description only)', () => {
    render(
      <Alert>
        <AlertDescription>Info only, no title.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Info only, no title.')).toBeInTheDocument();
  });

  it('passes props through to the underlying element', () => {
    render(<Alert data-testid="my-alert">Alert</Alert>);
    expect(screen.getByTestId('my-alert')).toBeInTheDocument();
  });
});
