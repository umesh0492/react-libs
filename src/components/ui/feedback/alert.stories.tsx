// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Info, AlertTriangle, CheckCircle2, XCircle, ShieldAlert, Megaphone } from 'lucide-react';

/**
 * Inline feedback banners.
 *
 * **Phase 4 fixes:**
 * - Added `info`, `success`, `warning` semantic variants (previously only `default` + `destructive`)
 * - All filled variants use design tokens (bg-blue-50/emerald-50/amber-50) — dark-mode aware
 * - `AlertTitle` upgraded to `font-semibold` (previously `font-medium`)
 * - New `onDismiss` prop renders an ✕ button
 */
const meta = {
  title: 'UI/Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Styled inline alert with 5 variants: `default`, `info`, `success`, `warning`, `destructive`. ' +
          'Variants are fully dark-mode aware via Tailwind opacity tokens. ' +
          'Pass `onDismiss` to show an ✕ dismiss button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'destructive'],
      description: 'Semantic color variant.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    onDismiss: {
      action: 'dismissed',
      description: 'Callback for the ✕ button. Omit to hide the button.',
      table: { category: 'Events' },
    },
  },
  args: { variant: 'default' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default neutral alert. */
export const Default: Story = {
  render: () => (
    <div className="w-[520px] p-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Session expiring soon</AlertTitle>
        <AlertDescription>Your session will expire in 30 minutes. Save your work.</AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Session expiring soon')).toBeInTheDocument();
  },
};

/**
 * All five semantic variants in one view.
 * Each has a filled muted background + matching border + icon in correct color.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="w-[520px] p-4 space-y-3">
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>A new version is available. Refresh to update.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Saved successfully</AlertTitle>
        <AlertDescription>Your changes have been applied and saved.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Approaching limit</AlertTitle>
        <AlertDescription>Storage is at 90% capacity. Archive old files.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Action failed</AlertTitle>
        <AlertDescription>Could not process your request. Please try again.</AlertDescription>
      </Alert>
      <Alert>
        <Megaphone className="h-4 w-4" />
        <AlertTitle>Announcement</AlertTitle>
        <AlertDescription>Scheduled maintenance this Sunday 2 AM – 5 AM IST.</AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'All 5 variants side-by-side. Each uses design tokens — no hardcoded colors.' } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Saved successfully')).toBeInTheDocument();
    expect(canvas.getByText('Action failed')).toBeInTheDocument();
  },
};

/**
 * Dismissible alert — `onDismiss` renders an ✕ button.
 */
export const Dismissible: Story = {
  render: () => {
    const [visible, setVisible] = React.useState(true);
    return (
      <div className="w-[520px] p-4 space-y-3">
        {visible ? (
          <Alert variant="warning" onDismiss={() => setVisible(false)}>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Action required</AlertTitle>
            <AlertDescription>
              Your KYC documents expire in 7 days. Upload updated documents.
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">Alert dismissed ✓</p>
        )}
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'Pass `onDismiss` to get an ✕ close button. Controls render/unmount externally.' } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dismiss = canvas.getByLabelText('Dismiss alert');
    expect(dismiss).toBeInTheDocument();
    await userEvent.click(dismiss);
    await waitFor(() => expect(canvas.queryByLabelText('Dismiss alert')).not.toBeInTheDocument());
  },
};

/** One-liner alert — title only, no description. */
export const OneLiner: Story = {
  render: () => (
    <div className="w-[520px] p-4 space-y-2">
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Partner profile published.</AlertTitle>
      </Alert>
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>GSTIN verification pending.</AlertTitle>
      </Alert>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Compact one-liner with title only — no AlertDescription needed.' } },
  },
};
