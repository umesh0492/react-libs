import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import * as React from 'react';
import axe from 'axe-core';

import { Button } from '../ui/forms/button';
import { Checkbox } from '../ui/forms/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/forms/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/forms/select';
import { Switch } from '../ui/forms/switch';
import { Toggle } from '../ui/forms/toggle';
import { Slider } from '../ui/forms/slider';
import { Input } from '../ui/forms/input';
import { Textarea } from '../ui/forms/textarea';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/data-display/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/data-display/avatar';
import { Badge } from '../ui/data-display/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/layout/card';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/overlays/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/overlays/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/core/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/overlays/sheet';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/navigation/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/navigation/breadcrumb';

describe('Comprehensive Matrix Interaction Coverage', () => {

  test('Forms High Density Integration with State & Axe Audits', async () => {
    const handleClick = vi.fn();

    const { container } = render(
      <form data-testid="form-root" onSubmit={(e) => e.preventDefault()}>
        <Button type="button" onClick={handleClick}>Click Me</Button>
        <label htmlFor="c1">Agree to Terms</label>
        <Checkbox id="c1" aria-label="Agree to terms" />
        <RadioGroup defaultValue="a" aria-label="Options">
           <RadioGroupItem value="a" id="r1" aria-label="Option A" />
           <RadioGroupItem value="b" id="r2" aria-label="Option B" />
        </RadioGroup>
        <Select>
          <SelectTrigger data-testid="select" aria-label="Select Theme"><SelectValue placeholder="Theme" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
        <label htmlFor="s1">Airplane Mode</label>
        <Switch id="s1" aria-label="Airplane Mode" />
        <Toggle aria-label="Toggle Bold">Toggle Me</Toggle>
        <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume Slider" />
        <Input placeholder="name" aria-label="User name" defaultValue="" />
        <Textarea placeholder="notes" aria-label="User notes" defaultValue="" />
      </form>
    );

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    const input = screen.getByPlaceholderText('name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John Doe' } });
    expect(input.value).toBe('John Doe');

    const textarea = screen.getByPlaceholderText('notes') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test Content Coverage' } });
    expect(textarea.value).toBe('Test Content Coverage');

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');

    const axeResults = await axe.run(container);
    expect(axeResults.violations).toEqual([]);
  });

  test('Data Display High Density Boundaries & Expansion Checks', async () => {
    const { container } = render(
      <div data-testid="display-root">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes, completely accessible.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>Yes. It comes with default styles.</AccordionContent>
          </AccordionItem>
        </Accordion>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Badge>Testing Status</Badge>
        <Card>
          <CardHeader>
            <CardTitle>Card Title Header</CardTitle>
            <CardDescription>Card Description Subtitle.</CardDescription>
          </CardHeader>
          <CardContent><p>Card Body Content</p></CardContent>
          <CardFooter><p>Card Footer Info</p></CardFooter>
        </Card>
      </div>
    );

    const trigger = screen.getByRole('button', { name: /is it accessible\?/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Yes, completely accessible.')).toBeInTheDocument();

    expect(screen.getByText('CN')).toBeInTheDocument();
    expect(screen.getByText('Testing Status')).toBeInTheDocument();
    expect(screen.getByText('Card Title Header')).toBeInTheDocument();
    expect(screen.getByText('Card Body Content')).toBeInTheDocument();

    const axeResults = await axe.run(container);
    expect(axeResults.violations).toEqual([]);
  });

  test('Overlay Triggers Deep Event Hooks with Real State Assertions', async () => {
    render(
      <div data-testid="overlay-root">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button">Hover Button</button>
            </TooltipTrigger>
            <TooltipContent><p>Add to library</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog>
          <DialogTrigger asChild>
            <button type="button">Open Modal Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Confirmation Title</DialogTitle>
              <DialogDescription>Action cannot be reversed.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Popover>
          <PopoverTrigger asChild>
            <button type="button">Open Settings Popover</button>
          </PopoverTrigger>
          <PopoverContent>Popover settings content body.</PopoverContent>
        </Popover>

        <Sheet>
          <SheetTrigger asChild>
            <button type="button">Open Navigation Sheet</button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Panel Navigation</SheetTitle>
              <SheetDescription>Side navigation items.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    );

    // Test Dialog open and close
    const dialogBtn = screen.getByRole('button', { name: /open modal dialog/i });
    fireEvent.click(dialogBtn);
    expect(await screen.findByText('Dialog Confirmation Title')).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });

    // Test Popover open
    const popoverBtn = screen.getByRole('button', { name: /open settings popover/i });
    fireEvent.click(popoverBtn);
    expect(await screen.findByText('Popover settings content body.')).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });

    // Test Sheet open
    const sheetBtn = screen.getByRole('button', { name: /open navigation sheet/i });
    fireEvent.click(sheetBtn);
    expect(await screen.findByText('Sheet Panel Navigation')).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });
  });

  test('Navigation Tree Executions with Tab Switching and Axe Audits', async () => {
    const { container } = render(
      <div data-testid="nav-root">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList aria-label="Account Settings Tabs">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Make changes to account.</TabsContent>
          <TabsContent value="password">Change security password.</TabsContent>
        </Tabs>

        <Breadcrumb aria-label="Breadcrumb Navigation">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );

    const accountTab = screen.getByRole('tab', { name: /account/i });
    const passwordTab = screen.getByRole('tab', { name: /password/i });

    expect(accountTab).toHaveAttribute('data-state', 'active');
    expect(passwordTab).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByText('Make changes to account.')).toBeInTheDocument();

    fireEvent.mouseDown(passwordTab);
    fireEvent.click(passwordTab);
    expect(passwordTab).toHaveAttribute('data-state', 'active');
    expect(accountTab).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByText('Change security password.')).toBeInTheDocument();

    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(breadcrumb).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();

    const axeResults = await axe.run(container);
    expect(axeResults.violations).toEqual([]);
  });

});
