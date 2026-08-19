// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog';
import { Button } from '../forms/button';

/**
 * A blocking confirmation dialog that prevents the user from accidentally
 * triggering destructive actions. Unlike `Dialog`, `AlertDialog` traps focus
 * and cannot be dismissed by clicking the overlay — the user must choose
 * Cancel or Confirm. Built on Radix UI AlertDialog.
 */
const meta = {
  title: 'UI/Overlays/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use `AlertDialog` when an action is destructive or irreversible. ' +
          'Unlike `Dialog`, it cannot be dismissed by pressing Escape or clicking ' +
          'outside — the user must explicitly choose an action. Use `AlertDialogAction` ' +
          'for the destructive button and `AlertDialogCancel` for the safe exit.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Standard destructive confirmation — delete a partner. */
export const DeletePartner: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" id="alert-trigger">
          <Trash2 className="h-4 w-4 mr-2" />
          Remove Partner
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Agro Supplies Co.?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the partner and all associated purchase
            orders, GRNs, and payment history. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
            Yes, remove partner
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /remove partner/i });
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(document.body.querySelector('[role="alertdialog"]')).toBeTruthy()
    );
    // Find Cancel by accessible name inside the portal — avoid class selectors
    // since all buttons include 'outline-none' making class*="outline" ambiguous
    await waitFor(async () => {
      const cancel = within(document.body).getByRole('button', { name: /cancel/i });
      await userEvent.click(cancel);
    });
  },
};

/** Confirm a status change that has downstream effects. */
export const ConfirmStatusChange: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" id="alert-status-trigger">Deactivate Partner</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate this partner?</AlertDialogTitle>
          <AlertDialogDescription>
            Deactivating will pause all pending purchase orders and block new
            orders until the partner is reactivated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Active</AlertDialogCancel>
          <AlertDialogAction>Deactivate</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
