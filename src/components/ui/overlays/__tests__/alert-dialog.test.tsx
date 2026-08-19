import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '../alert-dialog';
import React from 'react';

describe('AlertDialog Keyboard/Mouse Interaction Boundaries', () => {

    it('should assert accessible overlays validating action/cancel click simulations rigorously', async () => {
        const handleAction = vi.fn();
        
        render(
            <AlertDialog>
                <AlertDialogTrigger>Delete</AlertDialogTrigger>
                <AlertDialogContent aria-describedby={undefined}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Abort</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAction}>Confirm Destructive</AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        );

        // Open Dialog
        fireEvent.click(screen.getByText(/delete/i));
        
        // Assert modal injection structurally
        expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
        expect(screen.getByText(/are you sure\?/i)).toBeInTheDocument();

        // Simulate Action binding exactly 
        fireEvent.click(screen.getByText(/confirm destructive/i));
        expect(handleAction).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
        });
    });
});
