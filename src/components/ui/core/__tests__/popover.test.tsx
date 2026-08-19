import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Popover, PopoverTrigger, PopoverContent } from '../popover';
import React from 'react';

describe('Popover Interaction and Portal Focus Map', () => {

    it('should evaluate trigger click mappings checking complex generic context portals natively', async () => {
        render(
            <div>
                <button type="button" data-testid="outside-button">Outside Area</button>
                <Popover>
                    <PopoverTrigger>More Options</PopoverTrigger>
                    <PopoverContent>
                        <div data-testid="popover-panel">Filter Controls</div>
                    </PopoverContent>
                </Popover>
            </div>
        );

        // Verify popover is completely isolated from native structures initially
        expect(screen.queryByTestId('popover-panel')).not.toBeInTheDocument();

        // Binding standard trigger parsing
        fireEvent.click(screen.getByText(/more options/i));

        // Evaluate modal panel mounting
        const panel = await screen.findByTestId('popover-panel');
        expect(panel).toBeInTheDocument();

        // Check if outside clicks force closure natively accurately using a real outside target
        fireEvent.pointerDown(screen.getByTestId('outside-button'));
        fireEvent.pointerUp(screen.getByTestId('outside-button'));
        fireEvent.click(screen.getByTestId('outside-button'));

        await waitFor(() => {
            expect(screen.queryByTestId('popover-panel')).not.toBeInTheDocument();
        });
    });
});
