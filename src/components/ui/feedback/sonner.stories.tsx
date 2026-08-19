// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';
import { Toaster } from './sonner';
import { Button } from '../forms/button';

/**
 * Sonner-powered toast notifications. The `Toaster` component is the portal
 * container — mount it once at the root of your app. Trigger toasts anywhere
 * via the `toast.*` imperative API from the `sonner` package.
 * Theme is driven by `next-themes` automatically.
 */
const meta = {
  title: 'UI/Feedback/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`Toaster` is a portal component that renders Sonner toast notifications. ' +
          'Import it once at the app root. Trigger toasts via `toast()`, ' +
          '`toast.success()`, `toast.error()`, `toast.warning()`, and `toast.info()` ' +
          'from the `sonner` package.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster richColors position="bottom-right" />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Trigger each toast variant via the buttons. */
export const AllVariants: Story = {
  render: () => (
    <div className="p-6 flex flex-wrap gap-3">
      <Button
        variant="default"
        onClick={() => toast.success('Purchase order approved!', { description: 'PO-2025-0421 has been sent to Agro Supplies Co.' })}
      >
        Success Toast
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error('Payment failed', { description: 'Transaction could not be processed. Try again.' })}
      >
        Error Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.warning('Stock running low', { description: 'Basmati Rice stock is at 12% capacity.' })}
      >
        Warning Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('New partner registered', { description: 'Deccan Organic has completed onboarding.' })}
      >
        Info Toast
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast('Shipment dispatched', {
            description: 'GRN-0981 is on its way from Delhi Warehouse.',
            action: { label: 'Track', onClick: () => {} },
          })
        }
      >
        With Action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: 'Generating invoice…',
            success: 'Invoice ready for download.',
            error: 'Failed to generate invoice.',
          })
        }
      >
        Promise Toast
      </Button>
    </div>
  ),
};
