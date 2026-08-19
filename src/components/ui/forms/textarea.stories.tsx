// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { Textarea } from './textarea';

/**
 * A styled multi-line text input. Forwards all standard `<textarea>` HTML attributes.
 */
const meta = {
  title: 'UI/Forms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A styled `<textarea>` that supports all standard HTML textarea attributes. ' +
          'Use for multi-line text input like descriptions, notes, and messages. ' +
          'Pair with `<Label>` for accessible forms.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when empty.',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Value is visible but not editable.',
      table: { category: 'State' },
    },
    rows: {
      control: { type: 'number', min: 2, max: 20 },
      description: 'Number of visible text rows.',
      table: { category: 'Layout', defaultValue: { summary: '3' } },
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Maximum character count.',
      table: { category: 'Validation' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes.',
      table: { category: 'Styling' },
    },
  },
  args: { disabled: false },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="p-4 w-80">
      <Textarea {...args} id="textarea-default" placeholder="Type your message here..." />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.click(ta);
    await userEvent.type(ta, 'Hello, this is a test message.');
    expect(ta).toHaveValue('Hello, this is a test message.');
    await userEvent.clear(ta);
    expect(ta).toHaveValue('');
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="p-4 w-80 space-y-1.5">
      <label htmlFor="notes-area" className="text-sm font-medium">Additional Notes</label>
      <Textarea {...args} id="notes-area" placeholder="Optional notes..." rows={4} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'This field is locked.' },
  render: (args) => (
    <div className="p-4 w-80">
      <Textarea {...args} id="textarea-disabled" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(ta).toBeDisabled();
  },
};

/** Character counter pattern. */
export const WithCharacterCount: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const max = 200;
    return (
      <div className="p-4 w-80 space-y-1">
        <Textarea
          id="char-count"
          placeholder="Write a brief description..."
          rows={4}
          maxLength={max}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className={`text-xs text-right tabular-nums ${value.length > max * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
          {value.length}/{max}
        </p>
      </div>
    );
  },
};
