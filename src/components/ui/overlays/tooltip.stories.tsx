// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from './tooltip';
import { Button } from '../forms/button';
import { Info, HelpCircle, Keyboard } from 'lucide-react';

/**
 * Floating label that appears on hover / focus.
 *
 * **Phase 5 fixes:**
 * - Added `TooltipArrow` sub-component (directional triangle)
 * - `showArrow` prop on `TooltipContent` — renders the arrow when true
 * - Added enter/exit animations via Radix data-state classes
 * - `font-medium` + `shadow-sm` for cleaner appearance
 */
const meta = {
  title: 'UI/Overlays/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radix UI Tooltip. Wrap `TooltipProvider` once at the app root. ' +
          'Use `side` prop for 4-direction support. Pass `showArrow` to render the directional triangle.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — hover to show. */
export const Default: Story = {
  render: () => (
    <div className="p-16 flex items-center justify-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" id="tooltip-trigger">Hover for tip</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This action adds the item to your library.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button', { name: /hover for tip/i }));
    await waitFor(() =>
      expect(within(document.body).getByRole('tooltip')).toBeInTheDocument()
    );
    await userEvent.unhover(canvas.getByRole('button', { name: /hover for tip/i }));
  },
};

/**
 * With arrow — `showArrow` renders the directional triangle.
 * Phase 5 fix: new `TooltipArrow` sub-component.
 */
export const WithArrow: Story = {
  render: () => (
    <div className="p-16 flex items-center gap-6 justify-center">
      <TooltipProvider delayDuration={0}>
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side} showArrow>
              Tooltip on {side}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  ),
  parameters: {
    docs: { description: { story: '4-directional tooltips each with `showArrow`. Arrow color matches `bg-primary`.' } },
  },
};

/** Icon trigger — tooltip on an icon button (common table header pattern). */
export const IconTrigger: Story = {
  render: () => (
    <div className="p-16 flex items-center gap-4 justify-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button aria-label="Help" className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent showArrow>
            Total Cost of Ownership includes logistics, taxes, and handling fees.
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button aria-label="Keyboard shortcuts" className="text-muted-foreground hover:text-foreground transition-colors">
              <Keyboard className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent showArrow>
            Press <kbd className="bg-primary-foreground/20 px-1 rounded text-xs">⌘K</kbd> to open command palette
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button aria-label="Info" className="text-muted-foreground hover:text-foreground transition-colors">
              <Info className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" showArrow>
            Partner score is calculated quarterly based on delivery, quality, and compliance.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};

/** Delayed — 500ms hover delay before appearing. */
export const Delayed: Story = {
  render: () => (
    <div className="p-16 flex items-center justify-center">
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">Slow Tooltip (500ms)</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" showArrow>
            <p>Appears after 500ms delay</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};
