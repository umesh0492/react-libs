import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../checkbox';
import React from 'react';

describe('Checkbox Comprehensive Interaction Suite', () => {

    it('should natively render checkbox input states consistently', () => {
        render(<Checkbox aria-label="Toggle Feature" defaultChecked />);
        const checkbox = screen.getByRole('checkbox', { name: /toggle feature/i });
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();
    });

    it('should register simulated user toggle events asynchronously natively', async () => {
        const handleCheckedChange = vi.fn();
        const user = userEvent.setup();

        // Testing the uncontrolled event mutations externally
        render(<Checkbox aria-label="Subscribe" onCheckedChange={handleCheckedChange} />);
        
        const checkbox = screen.getByRole('checkbox', { name: /subscribe/i });
        expect(checkbox).not.toBeChecked();

        await user.click(checkbox);
        
        expect(checkbox).toBeChecked();
        expect(handleCheckedChange).toHaveBeenCalledWith(true);
        expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    });

    it('should explicitly lock visual mutations tightly when bounded by disability attributes', async () => {
        const handleCheckedChange = vi.fn();
        const user = userEvent.setup();

        render(<Checkbox disabled aria-label="Disabled Option" onCheckedChange={handleCheckedChange} />);
        const checkbox = screen.getByRole('checkbox', { name: /disabled option/i });

        expect(checkbox).toBeDisabled();
        
        await user.click(checkbox);
        
        expect(checkbox).not.toBeChecked();
        expect(handleCheckedChange).not.toHaveBeenCalled();
    });
});
