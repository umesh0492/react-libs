import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../tooltip';
import React from 'react';

global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('Tooltip Focus and Hover Bounds', () => {

    it('should inject tooltip overlays matching explicit hover delays automatically safely', async () => {
        render(
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger>Hover Me</TooltipTrigger>
                    <TooltipContent>
                        <p>Tooltip Details Activated</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

        // Tooltip should be unmounted initially natively
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        // Trigger Hover natively checking timer blocks
        const trigger = screen.getByText(/hover me/i);
        
        // Radix tooltips can be finicky in JSDOM, using multiple events to ensure trigger
        fireEvent.mouseOver(trigger);
        fireEvent.mouseEnter(trigger);
        fireEvent.focus(trigger);

        // Wait for Radix Tooltip Provider internal delay rendering bounds
        const content = await screen.findByRole('tooltip');
        expect(content).toBeInTheDocument();

        // Release Hover asserting strict overlay closing logic natively executing rapid clear
        fireEvent.keyDown(trigger, { key: 'Escape' });
        
        await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
    });
});

describe('Tooltip — showArrow prop', () => {

    it('renders TooltipContent with showArrow=true without crashing', () => {
        const { container } = render(
            <TooltipProvider>
                <Tooltip open>
                    <TooltipTrigger>Button</TooltipTrigger>
                    <TooltipContent showArrow>Arrow tip</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
        expect(container).toBeInTheDocument();
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('renders TooltipContent with showArrow=false without crashing', () => {
        const { container } = render(
            <TooltipProvider>
                <Tooltip open>
                    <TooltipTrigger>Button</TooltipTrigger>
                    <TooltipContent showArrow={false}>No arrow</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
        expect(container).toBeInTheDocument();
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('renders TooltipContent with custom sideOffset', () => {
        render(
            <TooltipProvider>
                <Tooltip open>
                    <TooltipTrigger>Button</TooltipTrigger>
                    <TooltipContent sideOffset={12}>Offset tooltip</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
        // TooltipContent renders a visible div and a hidden span for screen readers, so we get multiple
        const elements = screen.getAllByText('Offset tooltip');
        expect(elements[0]).toBeInTheDocument();
    });

    it('renders TooltipContent with custom className', () => {
        render(
            <TooltipProvider>
                <Tooltip open>
                    <TooltipTrigger>Button</TooltipTrigger>
                    <TooltipContent className="my-tooltip">Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
        // Content renders in a portal at the end of body, so container.querySelector doesn't find it.
        // Get the visible text node, then its closest tooltip content div
        const textNode = screen.getAllByText('Content')[0];
        const contentDiv = textNode.closest('[role="tooltip"], div[data-state]');
        expect(contentDiv).toHaveClass('my-tooltip');
    });
});
