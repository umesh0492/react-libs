import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
  buttonGroupVariants,
} from '../button-group';

describe('ButtonGroup Component', () => {
  it('renders with role="group"', () => {
    render(
      <ButtonGroup>
        <button>Bold</button>
        <button>Italic</button>
      </ButtonGroup>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders children inside the group', () => {
    render(
      <ButtonGroup>
        <button>Save</button>
        <button>Cancel</button>
      </ButtonGroup>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders with vertical orientation', () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <button>A</button>
        <button>B</button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]');
    expect(group).toHaveAttribute('data-orientation', 'vertical');
  });

  it('renders with horizontal orientation (default)', () => {
    const { container } = render(
      <ButtonGroup>
        <button>A</button>
        <button>B</button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]');
    expect(group).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ButtonGroup className="my-group">
        <button>X</button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]');
    expect(group).toHaveClass('my-group');
  });

  it('renders ButtonGroupText', () => {
    render(<ButtonGroupText>https://</ButtonGroupText>);
    expect(screen.getByText('https://')).toBeInTheDocument();
  });

  it('renders ButtonGroupText asChild using Slot', () => {
    render(
      <ButtonGroupText asChild>
        <span>Prefix</span>
      </ButtonGroupText>
    );
    expect(screen.getByText('Prefix')).toBeInTheDocument();
  });

  it('renders ButtonGroupSeparator', () => {
    const { container } = render(
      <ButtonGroup>
        <button>A</button>
        <ButtonGroupSeparator />
        <button>B</button>
      </ButtonGroup>
    );
    expect(container.querySelector('[data-slot="button-group-separator"]')).toBeInTheDocument();
  });

  it('renders a composed group with text prefix and input', () => {
    render(
      <ButtonGroup>
        <ButtonGroupText>$</ButtonGroupText>
        <input placeholder="Amount" />
      </ButtonGroup>
    );
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  it('buttonGroupVariants returns a string for horizontal', () => {
    const result = buttonGroupVariants({ orientation: 'horizontal' });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('buttonGroupVariants returns a string for vertical', () => {
    const result = buttonGroupVariants({ orientation: 'vertical' });
    expect(typeof result).toBe('string');
    expect(result).toContain('flex-col');
  });

  it('renders ButtonGroupSeparator with custom orientation', () => {
    const { container } = render(
      <ButtonGroupSeparator orientation="horizontal" />
    );
    expect(container.querySelector('[data-slot="button-group-separator"]')).toBeInTheDocument();
  });
});
