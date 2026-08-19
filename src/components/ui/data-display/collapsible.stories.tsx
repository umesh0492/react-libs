// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleCard,
  CollapsibleCardTrigger,
  CollapsibleCardContent,
} from './collapsible';
import { Button } from '../forms/button';
import { ChevronDown } from 'lucide-react';

/**
 * Sections that expand / collapse to reveal content.
 *
 * **Phase 3 additions:**
 * - `CollapsibleCard` — pre-styled bordered card collapsible
 * - `CollapsibleCardTrigger` — trigger with `hover:bg-muted/50` + auto-rotating chevron
 * - `CollapsibleCardContent` — animated height transition (collapsible-down/up keyframes)
 * - Bare `Collapsible` primitives remain unchanged for custom layouts
 */
const meta = {
  title: 'UI/Data-display/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radix Collapsible with smooth height animation. ' +
          'Use `CollapsibleCard` + `CollapsibleCardTrigger` + `CollapsibleCardContent` ' +
          'for a pre-styled bordered card experience.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * CollapsibleCard — bordered card with hover trigger.
 * Arrow rotates when open; content animates in height.
 */
export const Card: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="w-[380px] p-4">
        <CollapsibleCard open={open} onOpenChange={setOpen}>
          <CollapsibleCardTrigger>Advanced Filters</CollapsibleCardTrigger>
          <CollapsibleCardContent>
            <div className="px-4 py-3 space-y-2 text-sm">
              <p className="text-muted-foreground">Category: <strong className="text-foreground">All</strong></p>
              <p className="text-muted-foreground">Region: <strong className="text-foreground">Pan-India</strong></p>
              <p className="text-muted-foreground">Date Range: <strong className="text-foreground">Last 90 days</strong></p>
            </div>
          </CollapsibleCardContent>
        </CollapsibleCard>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'Hover trigger → `bg-muted/50`. Arrow rotates. Content animates height.' } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Advanced Filters');
    expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByText(/Pan-India/i)).toBeInTheDocument());
    await userEvent.click(trigger);
  },
};

/**
 * Stacked multiple CollapsibleCard sections — partner profile sections.
 */
export const MultiSection: Story = {
  render: () => {
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
    const toggle = (key: string) => setOpenSections(s => ({ ...s, [key]: !s[key] }));

    const sections = [
      { key: 'contact', title: 'Contact Information', content: 'Email: partner@example.com · Phone: +91 98765 43210' },
      { key: 'bank',    title: 'Bank Details',         content: 'HDFC Bank · A/C: XXXX 4521 · IFSC: HDFC0001234' },
      { key: 'docs',    title: 'Documents',            content: 'GST Certificate ✓  · PAN ✓  · FSSAI Pending' },
    ];

    return (
      <div className="w-[420px] p-4 space-y-2">
        {sections.map(s => (
          <CollapsibleCard key={s.key} open={openSections[s.key]} onOpenChange={() => toggle(s.key)}>
            <CollapsibleCardTrigger>{s.title}</CollapsibleCardTrigger>
            <CollapsibleCardContent>
              <div className="px-4 py-3 text-sm text-muted-foreground">{s.content}</div>
            </CollapsibleCardContent>
          </CollapsibleCard>
        ))}
      </div>
    );
  },
};

/**
 * Raw primitives — custom layout with a ghost icon button trigger.
 * (Unchanged from before; kept for backward compatibility reference.)
 */
export const CustomLayout: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="w-[360px] p-4">
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Starred Repositories (3)</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" id="collapsible-trigger">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-2 mt-2 text-sm font-mono">
            @radix-ui/primitives
          </div>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="rounded-md border px-4 py-2 text-sm font-mono">@radix-ui/colors</div>
            <div className="rounded-md border px-4 py-2 text-sm font-mono">radix-ui/react-icons</div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('@radix-ui/colors')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button'));
    await waitFor(() => expect(canvas.getByText('@radix-ui/colors')).toBeVisible());
    await userEvent.click(canvas.getByRole('button'));
  },
};
