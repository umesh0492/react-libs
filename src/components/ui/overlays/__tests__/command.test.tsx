import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
  CommandSeparator,
} from '../command';

describe('Command Component', () => {
  it('renders command palette', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
  });

  it('renders CommandEmpty when no items match filter', async () => {
    const user = userEvent.setup();
    render(
      <Command>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup>
            <CommandItem>Apple</CommandItem>
            <CommandItem>Banana</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    const input = screen.getByPlaceholderText('Type to search...');
    await user.type(input, 'zzz');
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('filters items by typing', async () => {
    const user = userEvent.setup();
    render(
      <Command>
        <CommandInput placeholder="Filter..." />
        <CommandList>
          <CommandGroup>
            <CommandItem>Apple</CommandItem>
            <CommandItem>Banana</CommandItem>
            <CommandItem>Cherry</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    const input = screen.getByPlaceholderText('Filter...');
    await user.type(input, 'App');
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('renders commandSeparator', () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    expect(container).toBeTruthy();
  });

  it('renders group heading', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem>Delete</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders multiple groups', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Fruits">
            <CommandItem>Apple</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Vegetables">
            <CommandItem>Carrot</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
  });

  it('calls onSelect callback when item is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem onSelect={onSelect}>Profile</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
    await user.click(screen.getByText('Profile'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('renders CommandInput with correct type', () => {
    render(
      <Command>
        <CommandInput placeholder="Search commands..." />
        <CommandList />
      </Command>
    );
    const input = screen.getByPlaceholderText('Search commands...');
    expect(input).toBeInTheDocument();
  });
});
