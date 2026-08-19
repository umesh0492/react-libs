import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../switch';
import React from 'react';

describe('Switch Interactive Mapping', () => {

    it('should bootstrap functional baseline bindings natively mapping visual states', () => {
        render(<Switch aria-label="Notifications" defaultChecked />);
        const switchElement = screen.getByRole('switch', { name: /notifications/i });
        expect(switchElement).toBeInTheDocument();
        expect(switchElement).toBeChecked();
    });

    it('should trap external click simulations toggling raw bounds safely', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Switch aria-label="Airplane Mode" onCheckedChange={handleChange} />);
        const switchElement = screen.getByRole('switch', { name: /airplane mode/i });
        
        expect(switchElement).not.toBeChecked();

        await user.click(switchElement);
        
        expect(switchElement).toBeChecked();
        expect(handleChange).toHaveBeenCalledWith(true);
        expect(handleChange).toHaveBeenCalledTimes(1);

        // Click again
        await user.click(switchElement);
        expect(switchElement).not.toBeChecked();
        expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('should inherit keyboard boundaries parsing native accessibility hooks seamlessly', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<Switch aria-label="Auto-Update" onCheckedChange={handleChange} />);
        const switchElement = screen.getByRole('switch', { name: /auto-update/i });

        // Tab focus to component
        await user.tab();
        expect(switchElement).toHaveFocus();

        // Native Space key tracking standard bounds internally (Radix Switch uses Space/Enter)
        await user.keyboard('[Space]');
        
        expect(switchElement).toBeChecked();
        expect(handleChange).toHaveBeenCalledWith(true);
    });
});
