import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../textarea';
import React from 'react';

describe('Textarea Input Component Interaction Map', () => {

    it('should natively render functional scalable text nodes strictly', () => {
        render(<Textarea aria-label="Description" placeholder="Write here..." />);
        const textarea = screen.getByRole('textbox', { name: /description/i });
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveAttribute('placeholder', 'Write here...');
    });

    it('should bind native structural typing flows checking external value streams securely', async () => {
        const user = userEvent.setup();
        render(<Textarea aria-label="Notes" />);
        
        const textarea = screen.getByRole('textbox', { name: /notes/i });
        await user.type(textarea, 'Multiline\nEntry Data');
        
        expect(textarea).toHaveValue('Multiline\nEntry Data');
    });

    it('should lock mutability completely natively enforcing exact disabled bounds', async () => {
        render(<Textarea disabled aria-label="Locked" defaultValue="Protected logs" />);
        
        const textarea = screen.getByRole('textbox', { name: /locked/i });
        
        expect(textarea).toBeDisabled();
        expect(textarea).toHaveValue('Protected logs');
        // Native Tailwind bindings check mapping
        expect(textarea.className).toMatch(/disabled:opacity-50/);
    });
});
