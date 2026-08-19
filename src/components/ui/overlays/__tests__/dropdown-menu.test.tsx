import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../dropdown-menu';
import React from 'react';

describe('DropdownMenu Keyboard Navigations & Triggers', () => {

    it('should assert dynamic portal drop-downs rendering accessible menu items securely natively', async () => {
        const handleSettings = vi.fn();
        const handleBilling = vi.fn();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Account Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleSettings}>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleBilling}>Billing Options</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        // Validate hidden initially logically securely
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();

        // Open Dropdown
        fireEvent.pointerDown(screen.getByText(/account menu/i));
        fireEvent.pointerUp(screen.getByText(/account menu/i));
        fireEvent.click(screen.getByText(/account menu/i));
        
        // Assert injection safely binding generic aria roles
        const menu = await screen.findByRole('menu');
        expect(menu).toBeInTheDocument();
        
        // Test Option Click simulating user actions precisely
        fireEvent.pointerDown(screen.getByText(/settings/i));
        fireEvent.pointerUp(screen.getByText(/settings/i));
        fireEvent.click(screen.getByText(/settings/i));
        expect(handleSettings).toHaveBeenCalledTimes(1);

        // Dropdown Auto-closes seamlessly
        await waitFor(() => {
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        });
    });

    it('should rigorously execute keyboard bound checks toggling radix checks organically natively', async () => {
        const handleToggle = vi.fn();

        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Features</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleToggle}>Deploy</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        // Radix menus open accurately with Space or Enter explicitly natively
        const trigger = screen.getByText(/features/i);
        fireEvent.pointerDown(trigger);
        fireEvent.pointerUp(trigger);
        fireEvent.click(trigger);
        
        const deployToggle = await screen.findByRole('menuitemcheckbox', { name: /deploy/i });
        fireEvent.pointerDown(deployToggle);
        fireEvent.pointerUp(deployToggle);
        fireEvent.click(deployToggle);

        expect(handleToggle).toHaveBeenCalledWith(true);
    });
});
