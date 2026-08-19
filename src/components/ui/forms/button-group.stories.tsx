// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Filter, Download, Plus } from 'lucide-react';
import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from './button-group';
import { Button } from './button';
import { Input } from './input';

/**
 * Groups related buttons into a single visually unified control by removing
 * intermediate border-radii and merging borders. Supports `horizontal` (default)
 * and `vertical` orientation. Use `ButtonGroupText` for static prefix/suffix labels
 * and `ButtonGroupSeparator` for visual dividers between items.
 */
const meta = {
  title: 'UI/Forms/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Lays out children as a joined row (or column) by removing intermediate ' +
          'border-radii. Combine with `Button`, `Input`, or `Select` children. ' +
          'Use `ButtonGroupText` for non-interactive prefix/suffix labels and ' +
          '`ButtonGroupSeparator` for visual dividers.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Merges borders horizontally or vertically.',
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },
  },
  args: { orientation: 'horizontal' },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three joined action buttons — the most common use case. */
export const Default: Story = {
  render: (args) => (
    <div className="p-8">
      <ButtonGroup {...args} id="bg-actions">
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-1.5" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-1.5" />
          Export
        </Button>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-1.5" />
          Add
        </Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  },
};

/** Vertical button group — useful for sidebar action stacks. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="p-8">
      <ButtonGroup {...args} id="bg-vertical">
        <Button variant="outline">First</Button>
        <Button variant="outline">Second</Button>
        <Button variant="outline">Third</Button>
      </ButtonGroup>
    </div>
  ),
};

/** Group with a static text prefix (department label + action buttons). */
export const WithTextPrefix: Story = {
  render: (args) => (
    <div className="p-8">
      <ButtonGroup {...args} id="bg-prefix">
        <ButtonGroupText>Dept</ButtonGroupText>
        <Button variant="outline">Procurement</Button>
        <Button variant="outline">Catalog</Button>
        <Button variant="outline">Finance</Button>
      </ButtonGroup>
    </div>
  ),
};

/** Search input merged with a submit button. */
export const InputWithButton: Story = {
  render: (args) => (
    <div className="p-8 w-[380px]">
      <ButtonGroup {...args} id="bg-search" className="w-full">
        <Input placeholder="Search by PO number…" className="flex-1" />
        <Button>Search</Button>
      </ButtonGroup>
    </div>
  ),
};

/** Buttons with a visual separator between groups. */
export const WithSeparator: Story = {
  render: (args) => (
    <div className="p-8">
      <ButtonGroup {...args} id="bg-separator">
        <Button variant="outline">Edit</Button>
        <Button variant="outline">Duplicate</Button>
        <ButtonGroupSeparator />
        <Button variant="outline" className="text-destructive hover:text-destructive">
          Delete
        </Button>
      </ButtonGroup>
    </div>
  ),
};
