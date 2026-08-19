// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { Checkbox } from './checkbox';

/**
 * A styled, accessible checkbox built on Radix UI's CheckboxPrimitive.
 * Supports checked, unchecked, and indeterminate states.
 * Use with `<label>` for full accessibility.
 */
const meta = {
  title: 'UI/Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible checkbox component built on Radix UI Checkbox. ' +
          'Supports `checked`, `defaultChecked`, `disabled`, and `onCheckedChange` props. ' +
          'Always pair with a visible `<label>` for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled checked state of the checkbox.',
      table: { category: 'State', defaultValue: { summary: 'undefined' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state for uncontrolled usage.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and applies muted styling.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the checkbox as required for form validation.',
      table: { category: 'Validation', defaultValue: { summary: 'false' } },
    },
    onCheckedChange: {
      action: 'onCheckedChange',
      description: 'Callback fired with the new checked state when user toggles.',
      table: { category: 'Events' },
    },
    name: {
      control: 'text',
      description: 'HTML name attribute for form submission.',
      table: { category: 'HTML' },
    },
    value: {
      control: 'text',
      description: 'HTML value attribute sent during form submission.',
      table: { category: 'HTML', defaultValue: { summary: 'on' } },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes applied to the root element.',
      table: { category: 'Styling' },
    },
  },
  args: {
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default unchecked checkbox. Click it to toggle. */
export const Default: Story = {
  render: (args) => (
    <div className="p-4 flex items-center gap-2">
      <Checkbox id="terms" {...args} />
      <label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer select-none">
        Accept terms and conditions
      </label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  },
};

/** Starts in the checked state via `defaultChecked`. */
export const DefaultChecked: Story = {
  args: { defaultChecked: true },
  render: (args) => (
    <div className="p-4 flex items-center gap-2">
      <Checkbox id="checked" {...args} />
      <label htmlFor="checked" className="text-sm font-medium cursor-pointer select-none">
        Already opted in
      </label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  },
};

/** Disabled checkboxes cannot be interacted with and appear muted. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="p-4 flex items-center gap-2">
      <Checkbox id="disabled-check" {...args} />
      <label htmlFor="disabled-check" className="text-sm font-medium text-muted-foreground cursor-not-allowed select-none">
        Feature restricted
      </label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    expect(checkbox).toBeDisabled();
  },
};

/** Multiple checkboxes in a list for multi-select scenarios. */
export const CheckboxList: Story = {
  render: () => (
    <div className="p-4 space-y-3">
      <p className="text-sm font-semibold mb-1">Select your interests</p>
      {[
        { id: 'design', label: 'UI/UX Design' },
        { id: 'frontend', label: 'Frontend Development' },
        { id: 'backend', label: 'Backend Engineering' },
      ].map(({ id, label }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox id={id} />
          <label htmlFor={id} className="text-sm cursor-pointer select-none">{label}</label>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const checkboxes = canvasElement.querySelectorAll('[role="checkbox"]');
    expect(checkboxes).toHaveLength(3);
    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[2]);
    expect(checkboxes[0]).toHaveAttribute('data-state', 'checked');
    expect(checkboxes[1]).toHaveAttribute('data-state', 'unchecked');
    expect(checkboxes[2]).toHaveAttribute('data-state', 'checked');
  },
};

/** Required checkbox for use in forms — validation state shown on submit. */
export const Required: Story = {
  args: { required: true },
  render: (args) => (
    <div className="p-4 flex items-center gap-2">
      <Checkbox id="required-check" {...args} />
      <label htmlFor="required-check" className="text-sm font-medium cursor-pointer select-none">
        I agree to the privacy policy <span className="text-destructive">*</span>
      </label>
    </div>
  ),
};
