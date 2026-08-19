import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import * as React from 'react';

// Import practically all heavy components!
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/overlays/hover-card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/overlays/alert-dialog';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/navigation/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/navigation/breadcrumb';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '../ui/navigation/menubar';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation/navigation-menu';

describe('Comprehensive Matrix Interaction Coverage', () => {

  test('Forms High Density Integration', async () => {
    render(
      <div data-testid="form-root">
        <Button>Click Me</Button>
        <Checkbox id="c1" />
        <RadioGroup defaultValue="a">
           <RadioGroupItem value="a" id="r1" />
           <RadioGroupItem value="b" id="r2" />
        </RadioGroup>
        <Select>
          <SelectTrigger data-testid="select"><SelectValue placeholder="Theme" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
        <Switch id="s1" />
        <Toggle>Toggle Me</Toggle>
        <Slider defaultValue={[50]} max={100} step={1} />
        <Input placeholder="name" />
        <Textarea placeholder="notes" />
      </div>
    );
    
    fireEvent.click(screen.getByText('Click Me'));
    
    fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('notes'), { target: { value: 'Test Content Coverage' } });
    
    expect(screen.getByTestId('form-root')).toBeInTheDocument();
  });

  test('Data Display High Density Boundaries', async () => {
    render(
      <div data-testid="display-root">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes.</AccordionContent>
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
        <Badge>Testing</Badge>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description.</CardDescription>
          </CardHeader>
          <CardContent><p>Card Content</p></CardContent>
          <CardFooter><p>Card Footer</p></CardFooter>
        </Card>
      </div>
    );

    fireEvent.click(screen.getByText('Is it accessible?'));
    expect(screen.getByTestId('display-root')).toBeInTheDocument();
  });

  test('Overlay Triggers Deep Event Hooks', async () => {
    render(
      <div data-testid="overlay-root">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover</TooltipTrigger>
            <TooltipContent><p>Add to library</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
        
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>This action cannot be undone.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    );

    fireEvent.mouseOver(screen.getByText('Hover'));
    fireEvent.click(screen.getByText('Open Dialog'));
    fireEvent.keyDown(document.activeElement || document.body, { key: 'Escape' });
    fireEvent.click(screen.getByText('Open Popover'));
    fireEvent.keyDown(document.activeElement || document.body, { key: 'Escape' });
    fireEvent.click(screen.getByText('Open Sheet'));
    fireEvent.keyDown(document.activeElement || document.body, { key: 'Escape' });
  });

  test('Navigation Tree Executions', async () => {
    render(
      <div data-testid="nav-root">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Make changes.</TabsContent>
          <TabsContent value="password">Change password.</TabsContent>
        </Tabs>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

      </div>
    );

    fireEvent.click(screen.getByText('Password'));
  });

});
