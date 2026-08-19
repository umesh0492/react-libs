// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Label } from './label';
import { Input } from './input';
import { Checkbox } from './checkbox';

/**
 * An accessible `<label>` element with consistent typography.
 * Always associate with a form control via `htmlFor` matching the control's `id`.
 */
const meta = {
  title: 'UI/Forms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Styled `<label>` element from Radix UI. Applies a peer-disabled cursor style. ' +
          'Always pair with a form control using `htmlFor` / `id` for full accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text.',
      table: { category: 'Content' },
    },
    htmlFor: {
      control: 'text',
      description: 'ID of the associated form control.',
      table: { category: 'HTML' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes.',
      table: { category: 'Styling' },
    },
  },
  args: { children: 'Email address', htmlFor: 'email' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="p-4 space-y-1.5 w-64">
      <Label {...args} />
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Email address')).toBeInTheDocument();
  },
};

/** Required label with asterisk. */
export const Required: Story = {
  render: () => (
    <div className="p-4 space-y-1.5 w-64">
      <Label htmlFor="req-field">
        Company name <span className="text-destructive">*</span>
      </Label>
      <Input id="req-field" required placeholder="Acme Corporation" />
    </div>
  ),
};

/** Label linked to a checkbox. */
export const WithCheckbox: Story = {
  render: () => (
    <div className="p-4 flex items-center gap-2">
      <Checkbox id="terms-cb" />
      <Label htmlFor="terms-cb" className="cursor-pointer">Accept terms and conditions</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Accept terms and conditions')).toBeInTheDocument();
  },
};
