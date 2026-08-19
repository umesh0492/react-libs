// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { ScrollArea, ScrollBar } from './scroll-area';
import { Separator } from './separator';

/**
 * Custom-styled scrollable container.
 *
 * **Phase 5 fix:**
 * - Added `orientation` prop: `"vertical"` | `"horizontal"` | `"both"`
 * - Previously horizontal scrollbars required manually adding `<ScrollBar orientation="horizontal" />`
 * - Now pass `orientation="horizontal"` or `"both"` to `<ScrollArea>` directly
 */
const meta = {
  title: 'UI/Layout/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radix UI custom scrollbar. ' +
          'New `orientation` prop: `"vertical"` (default), `"horizontal"`, or `"both"`. ' +
          'Always set an explicit height/width on the ScrollArea root.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Which scrollbars to render.',
      table: { category: 'Behaviour', defaultValue: { summary: 'vertical' } },
    },
    className: {
      control: 'text',
      table: { category: 'Styling' },
    },
  },
  args: { orientation: 'vertical' },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = [
  'React', 'TypeScript', 'Tailwind', 'Vite', 'Vitest', 'Storybook',
  'Radix UI', 'Lucide', 'Zustand', 'React Query', 'React Hook Form',
  'Zod', 'date-fns', 'Sonner', 'Vaul', 'TanStack Table',
];

/** Vertical scroll — tag list. */
export const Vertical: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-64 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-semibold leading-none">Tags</h4>
        {tags.map((tag, i) => (
          <React.Fragment key={tag}>
            <div className="text-sm py-1">{tag}</div>
            {i < tags.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('React');
    expect(canvasElement.textContent).toContain('Storybook');
  },
};

/**
 * Horizontal scroll — now via `orientation="horizontal"` prop on ScrollArea.
 * Phase 5 fix: no longer need to manually add `<ScrollBar orientation="horizontal" />`.
 */
export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: () => (
    <ScrollArea orientation="horizontal" className="w-80 rounded-md border">
      <div className="flex p-4 gap-3">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="shrink-0 rounded-md border bg-muted/30 p-3 w-24 text-center text-sm font-medium"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
  parameters: {
    docs: { description: { story: '`orientation="horizontal"` — automatic horizontal scrollbar. No `<ScrollBar>` manual child needed.' } },
  },
};

/**
 * Both axes — 2D scrollable grid.
 */
export const BothAxes: Story = {
  args: { orientation: 'both' },
  render: () => (
    <ScrollArea orientation="both" className="h-52 w-72 rounded-md border">
      <div className="p-4" style={{ width: 640 }}>
        <h4 className="text-sm font-semibold mb-3 whitespace-nowrap">Partner Performance Grid (scroll both ways)</h4>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(12, 56px)' }}>
          {Array.from({ length: 72 }, (_, i) => (
            <div key={i} className="h-10 rounded bg-muted/60 text-xs flex items-center justify-center text-muted-foreground">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
  parameters: {
    docs: { description: { story: '`orientation="both"` renders both vertical and horizontal scrollbars for 2D content.' } },
  },
};

/** Partner list with vertical scroll — realistic side panel. */
export const PartnerList: Story = {
  render: () => {
    const partners = [
      { name: 'Agro Supplies Co.',   code: 'VND-001', status: 'Active' },
      { name: 'Metro Grains Ltd.',   code: 'VND-002', status: 'Pending' },
      { name: 'South Agrotech',     code: 'VND-003', status: 'Active' },
      { name: 'Punjab Farms',        code: 'VND-004', status: 'Inactive' },
      { name: 'Deccan Organic',      code: 'VND-005', status: 'Active' },
      { name: 'Sunrise Traders',     code: 'VND-006', status: 'Suspended' },
      { name: 'GreenLeaf Exports',   code: 'VND-007', status: 'Active' },
      { name: 'Coastal Fisheries',   code: 'VND-008', status: 'Active' },
    ];
    return (
      <ScrollArea className="h-64 w-72 rounded-xl border">
        {partners.map((v, i) => (
          <React.Fragment key={v.code}>
            <div className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors">
              <div>
                <p className="text-sm font-medium">{v.name}</p>
                <p className="text-xs text-muted-foreground">{v.code}</p>
              </div>
              <span className={`text-xs font-medium ${
                v.status === 'Active' ? 'text-emerald-600' :
                v.status === 'Suspended' ? 'text-amber-600' :
                v.status === 'Inactive' ? 'text-muted-foreground' : 'text-blue-600'
              }`}>{v.status}</span>
            </div>
            {i < partners.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </ScrollArea>
    );
  },
};
