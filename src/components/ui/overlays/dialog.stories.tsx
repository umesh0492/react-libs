// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './dialog';
import { Button } from '../forms/button';
import { Input } from '../forms/input';
import { Label } from '../forms/label';

/**
 * A modal dialog overlay built on Radix UI Dialog. Renders in a portal above
 * all other page content with a focus-trapped, scroll-locked panel. Contains
 * a header, body, and footer layout. Use `DialogClose` for the close button or
 * the built-in ✕ button.
 */
const meta = {
  title: 'UI/Overlays/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal dialog portal. Focus is trapped inside and scroll is locked while ' +
          'open. Close by pressing Escape, clicking the overlay, or using ' +
          '`DialogClose`. Compose `DialogHeader`, `DialogTitle`, `DialogDescription`, ' +
          'and `DialogFooter` for consistent layout.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Basic dialog with descriptive text. */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button id="dialog-trigger">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partner Verification Required</DialogTitle>
          <DialogDescription>
            Agro Supplies Co. has submitted their compliance documents.
            Please review and confirm the verification status.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Skip for now</Button>
          </DialogClose>
          <Button>Verify Partner</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open dialog/i });
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(document.body.querySelector('[role="dialog"]')).toBeTruthy()
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(document.body.querySelector('[role="dialog"]')).toBeFalsy()
    );
  },
};

/** Form inside a dialog — the most common pattern. */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button id="dialog-form-trigger">Add New Partner</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Register New Partner</DialogTitle>
          <DialogDescription>
            Fill in the partner details. They'll receive an onboarding email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="dlg-partner-name">Company Name</Label>
            <Input id="dlg-partner-name" placeholder="Acme Pvt Ltd" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dlg-gst">GST Number</Label>
            <Input id="dlg-gst" placeholder="22AAAAA0000A1Z5" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dlg-email">Contact Email</Label>
            <Input id="dlg-email" type="email" placeholder="partner@example.com" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Register Partner</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
