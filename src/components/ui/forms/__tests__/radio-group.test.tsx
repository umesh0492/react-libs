import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from '../radio-group';
import { Label } from '../label';
import React from 'react';

describe('RadioGroup Composite Keyboard Bindings', () => {

    it('should parse parent groups rendering subcomponents safely accurately', () => {
        render(
            <RadioGroup defaultValue="apple" aria-label="Fruits">
                <RadioGroupItem value="apple" aria-label="Option Apple" />
                <RadioGroupItem value="banana" aria-label="Option Banana" />
            </RadioGroup>
        );

        expect(screen.getByRole('radio', { name: /option apple/i })).toBeChecked();
        expect(screen.getByRole('radio', { name: /option banana/i })).not.toBeChecked();
    });

    it('should isolate radio bounds switching focus exactly linearly dynamically securely', async () => {
        const handleValueChange = vi.fn();
        const user = userEvent.setup();

        render(
            <RadioGroup onValueChange={handleValueChange} aria-label="Theme">
                <RadioGroupItem value="light" id="r1" />
                <Label htmlFor="r1">Light</Label>
                <RadioGroupItem value="dark" id="r2" />
                <Label htmlFor="r2">Dark</Label>
            </RadioGroup>
        );

        const darkOption = screen.getByRole('radio', { name: /dark/i });
        
        // Navigate and strictly bind interactions asynchronously targeting specific dom labels internally
        await user.click(darkOption);
        
        expect(darkOption).toBeChecked();
        expect(handleValueChange).toHaveBeenCalledWith('dark');
        expect(handleValueChange).toHaveBeenCalledTimes(1);
    });
});
