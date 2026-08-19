import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Kbd, KbdGroup } from '../kbd';

describe('Kbd Component', () => {
  it('renders a keyboard key', () => {
    render(<Kbd>⌘</Kbd>);
    expect(screen.getByText('⌘')).toBeInTheDocument();
  });

  it('renders Kbd as a kbd HTML element', () => {
    const { container } = render(<Kbd>K</Kbd>);
    expect(container.querySelector('kbd')).toBeInTheDocument();
  });

  it('applies custom className to Kbd', () => {
    const { container } = render(<Kbd className="custom-kbd">Enter</Kbd>);
    expect(container.querySelector('kbd')).toHaveClass('custom-kbd');
  });

  it('renders a KbdGroup with multiple keys', () => {
    render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    );
    expect(screen.getByText('⌘')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });

  it('applies custom className to KbdGroup', () => {
    const { container } = render(
      <KbdGroup className="shortcut-group">
        <Kbd>Ctrl</Kbd>
      </KbdGroup>
    );
    expect(container.firstChild).toHaveClass('shortcut-group');
  });

  it('renders common shortcut combinations', () => {
    render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    );
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('renders Kbd with text content', () => {
    render(<Kbd>Enter</Kbd>);
    expect(screen.getByText('Enter')).toBeInTheDocument();
  });

  it('renders Kbd with Escape key', () => {
    render(<Kbd>Esc</Kbd>);
    expect(screen.getByText('Esc')).toBeInTheDocument();
  });
});
