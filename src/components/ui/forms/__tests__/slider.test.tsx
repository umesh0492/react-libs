import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '../slider';
import React from 'react';

global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('Slider Accessibility Navigation Bounds', () => {

    it('should bootstrap complex nested radix primitives exactly synchronously safely', () => {
        render(<Slider aria-label="Volume Control" defaultValue={[50]} max={100} step={1} />);
        const sliderTrack = screen.getByRole('slider');
        expect(sliderTrack).toBeInTheDocument();
        expect(sliderTrack).toHaveAttribute('aria-valuenow', '50');
    });

    it('should assert native keyboard navigation boundary translations reliably dynamically', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(
            <Slider 
                aria-label="Brightness" 
                defaultValue={[20]} 
                max={100} 
                step={5} 
                onValueChange={handleChange}
            />
        );
        
        const slider = screen.getByRole('slider');
        await user.tab();
        expect(slider).toHaveFocus();

        // Increment structurally using up arrow
        await user.keyboard('[ArrowUp]');
        expect(handleChange).toHaveBeenCalledWith([25]);

        // Decrement using left arrow accurately mapping Radix bounds natively 
        await user.keyboard('[ArrowLeft]');
        expect(handleChange).toHaveBeenCalledWith([20]);
    });
});
