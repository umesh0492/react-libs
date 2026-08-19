import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../dialog';
import React from 'react';

// Required for Radix dialogs injecting focus traps globally internally using ResizeObserver natively dynamically
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('Dialog Portal Injection Bounds', () => {

    it('should inject portals into generic document nodes asserting modal visibility correctly', async () => {
        render(
            <Dialog>
                <DialogTrigger>Open Modal</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Admin Request</DialogTitle>
                        <DialogDescription>Proceed with caution.</DialogDescription>
                    </DialogHeader>
                    <DialogClose>Cancel</DialogClose>
                </DialogContent>
            </Dialog>
        );

        // Assert strictly the portal is not rendered passively
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Native generic radix overlay click triggering mutation hooks seamlessly
        const trigger = screen.getByText(/open modal/i);
        fireEvent.pointerDown(trigger, { button: 0 });
        fireEvent.pointerUp(trigger, { button: 0 });
        fireEvent.click(trigger);

        // Evaluate portal appending structural nodes dynamically into root layouts seamlessly
        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText(/admin request/i)).toBeInTheDocument();
        
        // Assert modal closure routines accurately
        const closeButton = screen.getByText(/cancel/i);
        fireEvent.pointerDown(closeButton, { button: 0 });
        fireEvent.pointerUp(closeButton, { button: 0 });
        fireEvent.click(closeButton);
        
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('should respect exact prop-driven open-state mutation handlers mapping hooks gracefully', () => {
        render(
            <Dialog open={true}>
                <DialogContent aria-describedby={undefined}>
                    <DialogTitle>Controlled Instance</DialogTitle>
                    <DialogDescription className="sr-only">Controlled dialog for testing.</DialogDescription>
                </DialogContent>
            </Dialog>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/controlled instance/i)).toBeInTheDocument();
    });
});
