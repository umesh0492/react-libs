import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '../sheet';
import React from 'react';

describe('Sheet Modal Navigation Matrices', () => {

    it('should assert off-canvas overlays interacting securely via structured structural navigation correctly natively', async () => {
        render(
            <Sheet>
                <SheetTrigger>Open Drawer</SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Navigation Menu</SheetTitle>
                        <SheetDescription>Main links</SheetDescription>
                    </SheetHeader>
                    <SheetClose>Close Panel</SheetClose>
                </SheetContent>
            </Sheet>
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Mutating navigation trigger mapping radix generic overlay hooks gracefully
        fireEvent.click(screen.getByText(/open drawer/i));

        // Assert strictly the navigation panel overlays safely globally natively
        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText(/navigation menu/i)).toBeInTheDocument();

        // Assert native generic sheet closings securely
        fireEvent.click(screen.getByText(/close panel/i));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});
