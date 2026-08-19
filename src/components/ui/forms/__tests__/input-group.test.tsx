import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { InputGroup } from '../input-group';

describe('InputGroup Component', () => {
  it('renders with role="group"', () => {
    render(
      <InputGroup>
        <input placeholder="Search..." />
      </InputGroup>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders children inside the group', () => {
    render(
      <InputGroup>
        <input placeholder="Email" />
      </InputGroup>
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <InputGroup className="my-group">
        <input />
      </InputGroup>
    );
    const group = container.querySelector('[data-slot="input-group"]');
    expect(group).toHaveClass('my-group');
  });

  it('renders data-slot attribute', () => {
    const { container } = render(
      <InputGroup>
        <input />
      </InputGroup>
    );
    expect(container.querySelector('[data-slot="input-group"]')).toBeInTheDocument();
  });

  it('renders with a string prefix addon and input', () => {
    render(
      <InputGroup>
        <span>$</span>
        <input placeholder="Amount" />
      </InputGroup>
    );
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  it('renders with a textarea', () => {
    render(
      <InputGroup>
        <textarea placeholder="Notes" />
      </InputGroup>
    );
    expect(screen.getByPlaceholderText('Notes')).toBeInTheDocument();
  });

  it('renders multiple addons', () => {
    render(
      <InputGroup>
        <span>https://</span>
        <input placeholder="domain.com" />
        <span>.io</span>
      </InputGroup>
    );
    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByText('.io')).toBeInTheDocument();
  });
});

// ─── Sub-component coverage ───────────────────────────────────────────────────
import { InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea } from '../input-group';

describe('InputGroupAddon', () => {
  it('renders inline-start align (default)', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>$</InputGroupAddon>
        <input placeholder="Amount" />
      </InputGroup>
    );
    expect(container.querySelector('[data-slot="input-group-addon"]')).toBeInTheDocument();
  });

  it('renders inline-end align', () => {
    const { container } = render(
      <InputGroup>
        <input placeholder="Domain" />
        <InputGroupAddon align="inline-end">.com</InputGroupAddon>
      </InputGroup>
    );
    const addon = container.querySelector('[data-align="inline-end"]');
    expect(addon).toBeInTheDocument();
  });

  it('renders block-start align', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon align="block-start">Label</InputGroupAddon>
        <input placeholder="value" />
      </InputGroup>
    );
    expect(container.querySelector('[data-align="block-start"]')).toBeInTheDocument();
  });

  it('renders block-end align', () => {
    const { container } = render(
      <InputGroup>
        <input placeholder="value" />
        <InputGroupAddon align="block-end">Suffix</InputGroupAddon>
      </InputGroup>
    );
    expect(container.querySelector('[data-align="block-end"]')).toBeInTheDocument();
  });

  it('focuses the adjacent input on click', async () => {
    render(
      <InputGroup>
        <InputGroupAddon data-testid="addon">Addon</InputGroupAddon>
        <InputGroupInput data-testid="input" />
      </InputGroup>
    );
    const addon = screen.getByTestId('addon');
    const input = screen.getByTestId('input');
    
    await userEvent.click(addon);
    expect(input).toHaveFocus();
  });

  it('does not focus adjacent input if target is a button inside addon', async () => {
    render(
      <InputGroup>
        <InputGroupAddon data-testid="addon">
          <button data-testid="button">Action</button>
        </InputGroupAddon>
        <InputGroupInput data-testid="input" />
      </InputGroup>
    );
    const button = screen.getByTestId('button');
    const input = screen.getByTestId('input');
    
    await userEvent.click(button);
    expect(input).not.toHaveFocus();
  });
});

describe('InputGroupButton', () => {
  it('renders a button element', () => {
    render(
      <InputGroup>
        <InputGroupButton>Search</InputGroupButton>
      </InputGroup>
    );
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders with size="sm"', () => {
    render(
      <InputGroup>
        <InputGroupButton size="sm">Go</InputGroupButton>
      </InputGroup>
    );
    expect(screen.getByRole('button', { name: /go/i })).toBeInTheDocument();
  });

  it('renders with size="icon-sm"', () => {
    render(
      <InputGroup>
        <InputGroupButton size="icon-sm">×</InputGroupButton>
      </InputGroup>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('InputGroupText', () => {
  it('renders a span with its content', () => {
    render(
      <InputGroup>
        <InputGroupText>https://</InputGroupText>
        <input placeholder="url" />
      </InputGroup>
    );
    expect(screen.getByText('https://')).toBeInTheDocument();
  });
});

describe('InputGroupInput', () => {
  it('renders an input with data-slot attribute', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput placeholder="Type here" />
      </InputGroup>
    );
    expect(container.querySelector('[data-slot="input-group-control"]')).toBeInTheDocument();
  });
});

describe('InputGroupTextarea', () => {
  it('renders a textarea with data-slot attribute', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupTextarea placeholder="Notes" />
      </InputGroup>
    );
    const ta = container.querySelector('[data-slot="input-group-control"]');
    expect(ta).toBeInTheDocument();
    expect(ta?.tagName.toLowerCase()).toBe('textarea');
  });

  it('accepts rows prop', () => {
    render(
      <InputGroup>
        <InputGroupTextarea rows={4} placeholder="Long text" />
      </InputGroup>
    );
    const ta = screen.getByPlaceholderText('Long text');
    expect(ta).toHaveAttribute('rows', '4');
  });
});
