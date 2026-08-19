// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { ConfirmDialog } from './confirm-dialog';
import { Button } from '../forms/button';

const meta = {
  title: 'UI/Overlays/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const ConfirmDialogDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<string>('');
  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <Button variant="destructive" onClick={() => setOpen(true)} id="open-dialog-btn">
        Delete Account
      </Button>
      {result && <p className="text-sm">{result}</p>}
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete your account?"
        description="This will permanently delete your account and all data. This action cannot be undone."
        onConfirm={() => { setResult('Confirmed!'); setOpen(false); }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <ConfirmDialogDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open dialog
    await userEvent.click(canvas.getByRole('button', { name: /delete account/i }));
    // AlertDialog renders into a portal (document.body)
    await waitFor(() =>
      expect(within(document.body).getByRole('alertdialog')).toBeInTheDocument()
    );
  },
};

export const OpenByDefault: Story = {
  render: () => (
    <div className="p-8">
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="Are you sure?"
        description="This action cannot be undone."
        onConfirm={() => {}}
      />
    </div>
  ),
};
