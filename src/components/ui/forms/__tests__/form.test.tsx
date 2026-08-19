import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../form';

// Helper: renders a minimal valid react-hook-form form with all sub-components
function TestForm({
  defaultValues = { username: '' },
  triggerValidation = false,
}: {
  defaultValues?: Record<string, string>;
  triggerValidation?: boolean;
}) {
  const form = useForm({ defaultValues });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe('Form Component Suite', () => {
  it('renders the form with all sub-components', () => {
    render(<TestForm />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByText('Your public display name.')).toBeInTheDocument();
  });

  it('FormLabel renders as label element', () => {
    render(<TestForm />);
    expect(screen.getByText('Username').tagName).toBe('LABEL');
  });

  it('FormDescription renders as p element', () => {
    const { container } = render(<TestForm />);
    const desc = container.querySelector('p');
    expect(desc?.textContent).toBe('Your public display name.');
  });

  it('FormControl applies aria attributes to the input', () => {
    const { container } = render(<TestForm />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('FormMessage renders nothing when no error', () => {
    const { container } = render(<TestForm />);
    // FormMessage should return null when no error/children
    const messages = container.querySelectorAll('p');
    const errorMessages = Array.from(messages).filter(p =>
      p.className.includes('destructive')
    );
    expect(errorMessages.length).toBe(0);
  });

  it('FormMessage renders error on validation failure', async () => {
    function ErrorForm() {
      const form = useForm({
        defaultValues: { email: '' },
      });

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name="email"
              rules={{ required: 'Email is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit">Submit</button>
          </form>
        </Form>
      );
    }

    const { getByRole } = render(<ErrorForm />);
    // Trigger validation by submitting empty form
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    await user.click(getByRole('button', { name: 'Submit' }));
    // Error should appear
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('FormItem wraps content in a div', () => {
    const { container } = render(<TestForm />);
    expect(container.querySelector('div.space-y-2')).toBeInTheDocument();
  });

  it('FormLabel links to form control via htmlFor', () => {
    const { container } = render(<TestForm />);
    const label = screen.getByText('Username');
    const input = container.querySelector('input');
    expect(label.getAttribute('for')).toBe(input?.id);
  });

  it('FormDescription has an id matching the aria-describedby', () => {
    const { container } = render(<TestForm />);
    const input = container.querySelector('input');
    const describedBy = input?.getAttribute('aria-describedby');
    const desc = container.querySelector('p');
    expect(describedBy).toContain(desc?.id);
  });

  it('Form renders multiple fields', () => {
    function MultiFieldForm() {
      const form = useForm({ defaultValues: { first: '', last: '' } });
      return (
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="first"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First</FormLabel>
                  <FormControl><input {...field} /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last</FormLabel>
                  <FormControl><input {...field} /></FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      );
    }
    render(<MultiFieldForm />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
  });
});
