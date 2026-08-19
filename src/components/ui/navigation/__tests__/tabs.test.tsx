import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';
import React from 'react';

describe('Tabs Component Interaction Routing', () => {

    it('should assert native accessible radix tab-panel bindings synchronously checking automatic keyboard selections safely', async () => {
        const handleValueChange = vi.fn();

        render(
            <Tabs defaultValue="account" onValueChange={handleValueChange}>
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Account Settings Here</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>
        );

        const accountTab = screen.getByRole('tab', { name: /account/i });
        const passTab = screen.getByRole('tab', { name: /password/i });

        expect(accountTab).toHaveAttribute('data-state', 'active');
        expect(screen.getByText(/Account Settings Here/i)).toBeInTheDocument();

        // Radix tabs inherently bind native arrow keys natively switching panel data gracefully
        fireEvent.mouseDown(passTab);
        fireEvent.click(passTab);

        expect(passTab).toHaveAttribute('data-state', 'active');
        expect(handleValueChange).toHaveBeenCalledWith('password');
        expect(screen.getByText(/change your password here/i)).toBeInTheDocument();
        expect(screen.queryByText(/account settings here/i)).not.toBeInTheDocument();
    });
});
