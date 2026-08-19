import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from '../menubar';

describe('Menubar Component', () => {
  it('renders trigger buttons in menubar', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByRole('menubar')).toBeInTheDocument();
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('opens menu and shows items on trigger click', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Zoom In</MenubarItem>
            <MenubarItem>Zoom Out</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('View');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('Zoom In')).toBeInTheDocument();
    expect(screen.getByText('Zoom Out')).toBeInTheDocument();
  });

  it('renders MenubarShortcut', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('File');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('⌘T')).toBeInTheDocument();
  });

  it('renders MenubarLabel', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Support</MenubarLabel>
            <MenubarItem>Documentation</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('Help');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders MenubarSeparator', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Open</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('File');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Exit')).toBeInTheDocument();
  });

  it('renders MenubarCheckboxItem', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('View');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('Show Sidebar')).toBeInTheDocument();
  });

  it('renders MenubarRadioGroup with items', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Zoom</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="100%">
              <MenubarRadioItem value="75%">75%</MenubarRadioItem>
              <MenubarRadioItem value="100%">100%</MenubarRadioItem>
              <MenubarRadioItem value="150%">150%</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('Zoom');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('150%')).toBeInTheDocument();
  });

  it('renders MenubarItem with inset', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem inset>Paste Special</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('Edit');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('Paste Special')).toBeInTheDocument();
  });

  it('renders MenubarSub with trigger and content', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email</MenubarItem>
                <MenubarItem>Copy Link</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('File');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders MenubarLabel with inset', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Settings</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel inset>Account</MenubarLabel>
            <MenubarItem inset>Profile</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('Settings');
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
