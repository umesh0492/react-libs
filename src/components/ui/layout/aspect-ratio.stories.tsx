// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { AspectRatio } from './aspect-ratio';

/**
 * Maintains a fixed width-to-height ratio for media containers.
 * Use for images, videos, and embeds to prevent layout shift.
 */
const meta = {
  title: 'UI/Layout/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Constrains its child to a specific aspect ratio via the CSS padding-top trick. ' +
          'Set `ratio` as a fraction (e.g., `16/9`, `4/3`, `1`). ' +
          'Place images and videos as absolute-fill children.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.1, max: 4, step: 0.1 },
      description: 'Width / Height ratio. `16/9` = 1.778, `4/3` = 1.333, `1/1` = 1.',
      table: { category: 'Layout', defaultValue: { summary: '1' } },
    },
  },
  args: { ratio: 16 / 9 },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 16:9 video-style aspect ratio. */
export const Video: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-[480px] p-4">
      <AspectRatio {...args} className="bg-muted rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
          16:9 — Video container
        </div>
      </AspectRatio>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('16:9 — Video container')).toBeInTheDocument();
  },
};

/** Square 1:1 — used for product thumbnails and avatars. */
export const Square: Story = {
  args: { ratio: 1 },
  render: (args) => (
    <div className="w-48 p-4">
      <AspectRatio {...args} className="bg-muted rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
          1:1
        </div>
      </AspectRatio>
    </div>
  ),
};

/** 4:3 — classic photo ratio. */
export const Classic: Story = {
  args: { ratio: 4 / 3 },
  render: (args) => (
    <div className="w-[360px] p-4">
      <AspectRatio {...args} className="bg-muted rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
          4:3 — Photography
        </div>
      </AspectRatio>
    </div>
  ),
};
