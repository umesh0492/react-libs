import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from '../field';

describe('Field Component Suite', () => {

  // ─── FieldSet ────────────────────────────────────────────────────────────────
  it('renders FieldSet as a fieldset element', () => {
    const { container } = render(<FieldSet><legend>Group</legend></FieldSet>);
    expect(container.querySelector('fieldset[data-slot="field-set"]')).toBeInTheDocument();
  });

  it('applies custom className to FieldSet', () => {
    const { container } = render(<FieldSet className="my-set" />);
    expect(container.querySelector('[data-slot="field-set"]')).toHaveClass('my-set');
  });

  // ─── FieldLegend ─────────────────────────────────────────────────────────────
  it('renders FieldLegend with default legend variant', () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Contact Details</FieldLegend>
      </FieldSet>
    );
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="field-legend"][data-variant="legend"]')).toBeInTheDocument();
  });

  it('renders FieldLegend with label variant', () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend variant="label">Field Label</FieldLegend>
      </FieldSet>
    );
    expect(container.querySelector('[data-variant="label"]')).toBeInTheDocument();
  });

  // ─── FieldGroup ───────────────────────────────────────────────────────────────
  it('renders FieldGroup', () => {
    const { container } = render(<FieldGroup><span>Content</span></FieldGroup>);
    expect(container.querySelector('[data-slot="field-group"]')).toBeInTheDocument();
  });

  // ─── Field ────────────────────────────────────────────────────────────────────
  it('renders Field with role="group"', () => {
    render(<Field><input /></Field>);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders Field with vertical orientation (default)', () => {
    const { container } = render(<Field><input /></Field>);
    expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument();
  });

  it('renders Field with horizontal orientation', () => {
    const { container } = render(<Field orientation="horizontal"><input /></Field>);
    expect(container.querySelector('[data-orientation="horizontal"]')).toBeInTheDocument();
  });

  it('renders Field with responsive orientation', () => {
    const { container } = render(<Field orientation="responsive"><input /></Field>);
    expect(container.querySelector('[data-orientation="responsive"]')).toBeInTheDocument();
  });

  it('applies custom className to Field', () => {
    const { container } = render(<Field className="custom-field"><input /></Field>);
    expect(container.querySelector('[data-slot="field"]')).toHaveClass('custom-field');
  });

  // ─── FieldContent ─────────────────────────────────────────────────────────────
  it('renders FieldContent', () => {
    const { container } = render(<FieldContent>Field content here</FieldContent>);
    expect(container.querySelector('[data-slot="field-content"]')).toBeInTheDocument();
  });

  // ─── FieldLabel ───────────────────────────────────────────────────────────────
  it('renders FieldLabel', () => {
    render(<FieldLabel htmlFor="email">Email address</FieldLabel>);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  // ─── FieldTitle ───────────────────────────────────────────────────────────────
  it('renders FieldTitle', () => {
    render(<FieldTitle>Billing Address</FieldTitle>);
    expect(screen.getByText('Billing Address')).toBeInTheDocument();
  });

  // ─── FieldDescription ─────────────────────────────────────────────────────────
  it('renders FieldDescription', () => {
    render(<FieldDescription>Enter your primary email address.</FieldDescription>);
    expect(screen.getByText('Enter your primary email address.')).toBeInTheDocument();
  });

  // ─── FieldSeparator ───────────────────────────────────────────────────────────
  it('renders FieldSeparator without children', () => {
    const { container } = render(<FieldSeparator />);
    expect(container.querySelector('[data-slot="field-separator"]')).toBeInTheDocument();
  });

  it('renders FieldSeparator with text content', () => {
    render(<FieldSeparator>or</FieldSeparator>);
    expect(screen.getByText('or')).toBeInTheDocument();
  });

  // ─── FieldError ───────────────────────────────────────────────────────────────
  it('renders FieldError with children', () => {
    render(<FieldError>This field is required.</FieldError>);
    expect(screen.getByText('This field is required.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders FieldError with single error object', () => {
    render(<FieldError errors={[{ message: 'Invalid email format' }]} />);
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('renders FieldError with multiple errors as list', () => {
    render(
      <FieldError
        errors={[
          { message: 'Too short' },
          { message: 'Must contain a number' },
        ]}
      />
    );
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.getByText('Must contain a number')).toBeInTheDocument();
  });

  it('renders nothing when FieldError has no children or errors', () => {
    const { container } = render(<FieldError />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing visible when FieldError errors array has no messages', () => {
    // Empty array with no messages: component renders empty ul but no visible text
    render(<FieldError errors={[]} />);
    // No text content should be visible
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('skips errors with undefined message', () => {
    render(<FieldError errors={[undefined, { message: 'Valid error' }]} />);
    expect(screen.getByText('Valid error')).toBeInTheDocument();
  });

  // ─── Composed example ─────────────────────────────────────────────────────────
  it('renders a fully composed field', () => {
    render(
      <Field>
        <FieldLabel htmlFor="name">Company Name</FieldLabel>
        <FieldContent>
          <input id="name" placeholder="Acme Enterprise Ltd." />
          <FieldDescription>Legal entity name as registered.</FieldDescription>
        </FieldContent>
        <FieldError errors={[{ message: 'Name is required' }]} />
      </Field>
    );
    expect(screen.getByText('Company Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Acme Enterprise Ltd.')).toBeInTheDocument();
    expect(screen.getByText('Legal entity name as registered.')).toBeInTheDocument();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });
});
