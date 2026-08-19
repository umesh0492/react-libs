import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
} from '../context-menu';

// Helper: renders a ContextMenu with its content always visible via right-click simulation
function openContextMenu() {
  const trigger = screen.getByTestId('ctx-trigger');
  fireEvent.contextMenu(trigger);
}

const ContextMenuFixture = ({ children }: { children: React.ReactNode }) => (
  <ContextMenu>
    <ContextMenuTrigger data-testid="ctx-trigger">Right-click area</ContextMenuTrigger>
    <ContextMenuContent>{children}</ContextMenuContent>
  </ContextMenu>
);

describe('ContextMenu Component', () => {
  it('renders the trigger without opening', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid="trigger">Right-click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    expect(screen.queryByText('Open')).not.toBeInTheDocument();
  });

  it('shows menu items after right-click', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Paste')).toBeInTheDocument();
  });

  it('renders ContextMenuShortcut after open', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuItem>
          Open <ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('⌘O')).toBeInTheDocument();
  });

  it('renders ContextMenuLabel after open', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders ContextMenuSeparator after open', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuItem>Item 1</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Item 2</ContextMenuItem>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders ContextMenuItem with inset after open', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuItem inset>Inset Item</ContextMenuItem>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('Inset Item')).toBeInTheDocument();
  });

  it('renders ContextMenuCheckboxItem after open', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuCheckboxItem checked>Show Toolbar</ContextMenuCheckboxItem>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('Show Toolbar')).toBeInTheDocument();
  });

  it('renders ContextMenuRadioGroup with items after open', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuRadioGroup value="light">
          <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
          <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('renders ContextMenuGroup with items after open', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuGroup>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Paste')).toBeInTheDocument();
  });

  it('renders ContextMenuLabel with inset after open', async () => {
    render(
      <ContextMenuFixture>
        <ContextMenuLabel inset>Section</ContextMenuLabel>
      </ContextMenuFixture>
    );
    openContextMenu();
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('calls onSelect when ContextMenuItem is clicked', async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenuFixture>
        <ContextMenuItem onSelect={onSelect}>Delete</ContextMenuItem>
      </ContextMenuFixture>
    );
    openContextMenu();
    const item = screen.getByText('Delete');
    fireEvent.pointerDown(item, { button: 0 });
    fireEvent.pointerUp(item, { button: 0 });
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalled();
  });
});
