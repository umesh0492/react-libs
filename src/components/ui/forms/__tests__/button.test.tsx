import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';
import React from 'react';

describe('Button Comprehensive Interaction Suite', () => {

    it('should natively render functional children directly', () => {
        render(<Button>Submit Workflow</Button>);
        expect(screen.getByRole('button', { name: /Submit Workflow/i })).toBeInTheDocument();
    });

    it('should trigger isolated onClick simulation successfully', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        
        render(<Button onClick={handleClick}>Action</Button>);
        await user.click(screen.getByRole('button', { name: /action/i }));
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should bind explicit disability blocking simulated interactions seamlessly', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button disabled onClick={handleClick}>Disabled Trigger</Button>);
        const btn = screen.getByRole('button', { name: /disabled trigger/i });

        expect(btn).toBeDisabled();
        
        await user.click(btn);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('should strictly parse tailwind variant mutations mapping securely', () => {
        render(<Button variant="destructive" size="lg">Delete Resource</Button>);
        const destructButton = screen.getByRole('button', { name: /delete resource/i });
        
        // Testing specific baseline variant map bindings reliably
        expect(destructButton.className).toMatch(/destructive/);
        expect(destructButton.className).toMatch(/min-h-10/); // Large size binding
    });

    it('should correctly inherit component encapsulation natively dynamically passing raw attributes', () => {
        render(<Button aria-label="Confirm Deletion" data-test="btn-hook" type="submit">Icon</Button>);
        const btn = screen.getByRole('button', { name: /Confirm Deletion/i });
        
        expect(btn).toHaveAttribute('type', 'submit');
        expect(btn).toHaveAttribute('data-test', 'btn-hook');
    });

    it('should mount purely structurally when asChild isolates the core node organically', () => {
        render(
            <Button asChild>
                <a href="https://example.com" data-testid="anchor-element">Link Shell</a>
            </Button>
        );
        
        const anchor = screen.getByTestId('anchor-element');
        expect(anchor.tagName.toLowerCase()).toBe('a');
        expect(anchor).toHaveAttribute('href', 'https://example.com');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
