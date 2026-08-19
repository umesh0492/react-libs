import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '../drawer';

describe('Drawer Component', () => {
  it('renders trigger button', () => {
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <button>Open Drawer</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Cart</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByRole('button', { name: 'Open Drawer' })).toBeInTheDocument();
  });

  it('opens drawer and shows content on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <button>Open</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Shopping Cart</DrawerTitle>
            <DrawerDescription>Review your items</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <button>Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Review your items')).toBeInTheDocument();
  });

  it('renders DrawerHeader and DrawerFooter', async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger asChild><button>Open</button></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>Title</DrawerTitle></DrawerHeader>
          <DrawerFooter><button>Submit</button></DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders DrawerClose inside open drawer', async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger asChild><button>Open</button></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>My Drawer</DrawerTitle></DrawerHeader>
          <DrawerClose asChild><button>Dismiss</button></DrawerClose>
        </DrawerContent>
      </Drawer>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    // Verify DrawerClose renders correctly inside the open drawer
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    expect(screen.getByText('My Drawer')).toBeInTheDocument();
  });

  it('renders Drawer with shouldScaleBackground', async () => {
    const user = userEvent.setup();
    render(
      <Drawer shouldScaleBackground>
        <DrawerTrigger asChild><button>Open</button></DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Scaled</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Scaled')).toBeInTheDocument();
  });
});
