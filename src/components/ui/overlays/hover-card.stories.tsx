// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor, screen } from 'storybook/test';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';

const meta = {
  title: 'UI/Overlays/HoverCard',
  component: HoverCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-16 flex items-center justify-center">
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <a
            href="#"
            id="hover-card-trigger"
            className="text-sm font-medium underline underline-offset-4 cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            @react-lib
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">React Component Library</h4>
            <p className="text-xs text-muted-foreground">
              A curated set of accessible, themeable UI primitives.
            </p>
            <p className="text-xs text-muted-foreground">Joined December 2024</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('@react-lib');

    // Hover to open
    await userEvent.hover(trigger);
    // Radix renders hover card into a portal (document.body)
    await waitFor(() =>
      expect(within(document.body).getByText('React Component Library')).toBeVisible()
    );
    // Unhover to close
    await userEvent.unhover(trigger);
  },
};
