// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable';

/**
 * A drag-to-resize panel layout. Supports horizontal and vertical splitting.
 * Built on `react-resizable-panels`.
 */
const meta = {
  title: 'UI/Layout/ResizablePanelGroup',
  component: ResizablePanelGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Drag-resizable panel group powered by `react-resizable-panels`. ' +
          'Use `ResizablePanel` for each pane and `ResizableHandle` between them. ' +
          'Set `direction="horizontal"` or `"vertical"`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Split direction of the panel group.',
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { direction: 'horizontal' },
  render: (args: any) => (
    <div className="w-[600px] h-[400px] border rounded-md overflow-hidden">
      <ResizablePanelGroup className="h-full w-full" {...args}>
        <ResizablePanel defaultSize={50}><div className="flex items-center justify-center p-6 h-full font-semibold">One</div></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}><div className="flex items-center justify-center p-6 h-full font-semibold">Two</div></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('One');
    expect(canvasElement.textContent).toContain('Two');
  },
};

/** Vertical split — top/bottom panels. */
export const Vertical: Story = {
  args: { direction: 'vertical' },
  render: () => (
    <div className="w-[400px] h-[400px] border rounded-md overflow-hidden">
      <ResizablePanelGroup className="h-full w-full" direction="vertical">
        <ResizablePanel defaultSize={40}><div className="flex items-center justify-center p-6 h-full font-semibold">Top</div></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}><div className="flex items-center justify-center p-6 h-full font-semibold">Bottom</div></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain('Top');
    expect(canvasElement.textContent).toContain('Bottom');
  },
};

/** Three-column layout. */
export const ThreeColumns: Story = {
  render: () => (
    <div className="w-[700px] h-[350px] border rounded-md overflow-hidden">
      <ResizablePanelGroup className="h-full w-full" direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}><div className="flex items-center justify-center p-4 h-full text-sm font-medium">Sidebar</div></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}><div className="flex items-center justify-center p-4 h-full text-sm font-medium">Main</div></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15}><div className="flex items-center justify-center p-4 h-full text-sm font-medium">Details</div></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};