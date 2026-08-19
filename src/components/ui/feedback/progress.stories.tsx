// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Progress } from './progress';

/**
 * A horizontal progress bar indicating task completion or loading state.
 *
 * **Phase 4 fixes:**
 * - Added `shimmer` prop — overlays a moving light shimmer for uploading/loading feel
 * - Added `variant` prop: `default` (primary), `success` (green), `warning` (amber), `danger` (red)
 * - Added `showLabel` prop — inline `XX%` label to the right of the bar
 * - Smooth `transition-all duration-500` on indicator movement
 */
const meta = {
  title: 'UI/Feedback/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radix UI Progress bar. `variant` sets the semantic color; `shimmer` adds a moving shine; ' +
          '`showLabel` renders an inline percentage.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value 0–100.',
      table: { category: 'State', defaultValue: { summary: '0' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
      description: 'Semantic color variant.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    shimmer: {
      control: 'boolean',
      description: 'Overlay a moving shimmer animation (for active upload/loading).',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    showLabel: {
      control: 'boolean',
      description: 'Show an inline `XX%` label to the right.',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
  },
  args: { value: 60, variant: 'default', shimmer: false, showLabel: false },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default blue progress bar. */
export const Default: Story = {
  render: (args) => (
    <div className="w-[400px] p-6 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Upload progress</span>
        <span className="font-medium tabular-nums text-muted-foreground">{args.value}%</span>
      </div>
      <Progress {...args} aria-label="Upload progress" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('progressbar')).toBeInTheDocument();
  },
};

/**
 * Shimmer — active upload/processing animation.
 * Fix: added `shimmer` prop that overlays a `CSS @keyframes` shine via `::after`.
 */
export const Shimmer: Story = {
  args: { value: 65, shimmer: true },
  render: () => {
    const [progress, setProgress] = React.useState(20);
    React.useEffect(() => {
      const t = setInterval(() => {
        setProgress(p => p >= 90 ? 20 : p + 3);
      }, 200);
      return () => clearInterval(t);
    }, []);
    return (
      <div className="w-[420px] p-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Uploading document...</span>
          <span className="font-medium tabular-nums text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} shimmer aria-label="Upload progress" />
        <p className="text-xs text-muted-foreground text-center">↑ Moving shimmer via CSS ::after keyframe</p>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: '`shimmer` prop adds a moving white shine overlay — signals active upload.' } },
  },
};

/** All four semantic variants side by side. */
export const AllVariants: Story = {
  render: () => (
    <div className="w-[420px] p-4 space-y-4">
      {[
        { label: 'Upload complete',   value: 100, variant: 'success' as const },
        { label: 'Processing',        value: 60,  variant: 'default' as const },
        { label: 'Storage warning',   value: 85,  variant: 'warning' as const },
        { label: 'Critical',          value: 95,  variant: 'danger'  as const },
      ].map(({ label, value, variant }) => (
        <div key={label} className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>{label}</span>
            <span className="text-muted-foreground tabular-nums">{value}%</span>
          </div>
          <Progress value={value} variant={variant} aria-label={label} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole('progressbar')).toHaveLength(4);
  },
};

/** `showLabel` prop — percentage appears inline to the right. */
export const WithLabel: Story = {
  render: () => (
    <div className="w-[420px] p-6 space-y-3">
      {[33, 66, 100].map(v => (
        <Progress key={v} value={v} showLabel aria-label={`${v}% complete`}
          variant={v === 100 ? 'success' : v > 70 ? 'warning' : 'default'} />
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: '`showLabel` renders `XX%` inline. Variant auto-adjusts at 100%.' } },
  },
};

/** Multi-step onboarding tracker. */
export const Onboarding: Story = {
  render: () => (
    <div className="w-[420px] p-4 space-y-4">
      {[
        { label: 'Profile',       value: 100, variant: 'success' as const },
        { label: 'Documents',     value: 60,  variant: 'default' as const },
        { label: 'Verification',  value: 20,  variant: 'default' as const },
      ].map(({ label, value, variant }) => (
        <div key={label} className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>{label}</span>
            <span className="text-muted-foreground tabular-nums">{value}%</span>
          </div>
          <Progress value={value} variant={variant} aria-label={`${label} progress`} />
        </div>
      ))}
    </div>
  ),
};
