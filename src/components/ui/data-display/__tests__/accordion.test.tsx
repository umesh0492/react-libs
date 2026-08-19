import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../accordion';
import React from 'react';

describe('Accordion Expandable Panels Matrix', () => {

    it('should mount structural items natively closed without conditional renderings initially remotely explicitly', () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Panel 1</AccordionTrigger>
                    <AccordionContent>Contents 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        const trigger = screen.getByText(/panel 1/i);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should track external user clicks binding specific expand limits effectively synchronously natively safely', async () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="v1">
                    <AccordionTrigger>Heading Alpha</AccordionTrigger>
                    <AccordionContent>Details Alpha</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        const trigger = screen.getByText(/heading alpha/i);
        fireEvent.click(trigger);
        
        // Bound dynamically securely mapping the open attribute hooks
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText(/details alpha/i)).toBeInTheDocument();
        
        fireEvent.click(trigger);
        
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
});
