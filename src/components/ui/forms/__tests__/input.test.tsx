import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';
import React from 'react';

describe('Input Component Interaction Suite', () => {

    it('should natively render functional placeholder parsing safely', () => {
        render(<Input placeholder="Enter username..." />);
        expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    });

    it('should capture strictly bound simulated typing loops dynamically accurately', async () => {
        const user = userEvent.setup();
        render(<Input data-testid="demo-input" />);
        
        const inputField = screen.getByTestId('demo-input');
        await user.type(inputField, 'demo@test.com');
        
        expect(inputField).toHaveValue('demo@test.com');
    });

    it('should isolate focus boundaries natively natively parsing tab indexing correctly', async () => {
        const user = userEvent.setup();
        render(<Input aria-label="Search" />);
        
        const inputField = screen.getByRole('textbox', { name: /search/i });
        await user.click(inputField);
        
        expect(inputField).toHaveFocus();
        
        await user.tab();
        expect(inputField).not.toHaveFocus();
    });

    it('should bind explicit disability mapping CSS opacity drops strictly safely', () => {
        render(<Input disabled defaultValue="Frozen text" />);
        
        const inputField = screen.getByRole('textbox');
        expect(inputField).toBeDisabled();
        expect(inputField.className).toMatch(/disabled:opacity-50/);
        expect(inputField).toHaveValue('Frozen text');
    });

    it('should forward custom classname overlays inherently bridging tailwind combinations safely', () => {
        render(<Input data-testid="styled-input" className="bg-red-500 max-w-sm" />);
        
        const styledInput = screen.getByTestId('styled-input');
        expect(styledInput.className).toContain('bg-red-500');
        expect(styledInput.className).toContain('max-w-sm');
    });
});
