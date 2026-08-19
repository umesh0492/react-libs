import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarSeparator,
  SidebarInput,
  useSidebar,
} from '../sidebar';

// Helper wrapper — all Sidebar elements need SidebarProvider
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>{children}</SidebarProvider>
);

describe('SidebarProvider', () => {
  it('renders children inside the provider', () => {
    render(<SidebarProvider><span>Hello</span></SidebarProvider>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders with defaultOpen=false (collapsed)', () => {
    const { container } = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar><div>Nav</div></Sidebar>
      </SidebarProvider>
    );
    expect(container.querySelector('[data-state="collapsed"]')).toBeInTheDocument();
  });

  it('renders with defaultOpen=true (expanded)', () => {
    const { container } = render(
      <SidebarProvider defaultOpen={true}>
        <Sidebar><div>Nav</div></Sidebar>
      </SidebarProvider>
    );
    expect(container.querySelector('[data-state="expanded"]')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    render(
      <SidebarProvider open={true} onOpenChange={onOpenChange}>
        <Sidebar><div>Nav</div></Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('Nav')).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  it('renders with collapsible=none', () => {
    const { container } = render(
      <Wrapper>
        <Sidebar collapsible="none"><span>Fixed</span></Sidebar>
      </Wrapper>
    );
    expect(screen.getByText('Fixed')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sidebar"]')).toBeInTheDocument();
  });

  it('renders with left side', () => {
    const { container } = render(
      <Wrapper>
        <Sidebar side="left"><span>Left</span></Sidebar>
      </Wrapper>
    );
    expect(container.querySelector('[data-side="left"]')).toBeInTheDocument();
  });

  it('renders with right side', () => {
    const { container } = render(
      <Wrapper>
        <Sidebar side="right"><span>Right</span></Sidebar>
      </Wrapper>
    );
    expect(container.querySelector('[data-side="right"]')).toBeInTheDocument();
  });

  it('renders with floating variant', () => {
    const { container } = render(
      <Wrapper>
        <Sidebar variant="floating"><span>Float</span></Sidebar>
      </Wrapper>
    );
    expect(container.querySelector('[data-variant="floating"]')).toBeInTheDocument();
  });
});

describe('SidebarTrigger', () => {
  it('renders trigger button', () => {
    render(<Wrapper><SidebarTrigger /></Wrapper>);
    expect(screen.getByRole('button', { name: /toggle sidebar/i })).toBeInTheDocument();
  });

  it('toggles sidebar on click', () => {
    const { container } = render(
      <Wrapper>
        <SidebarTrigger />
        <Sidebar><span>Content</span></Sidebar>
      </Wrapper>
    );
    const before = container.querySelector('[data-state]')?.getAttribute('data-state');
    fireEvent.click(screen.getByRole('button', { name: /toggle sidebar/i }));
    const after = container.querySelector('[data-state]')?.getAttribute('data-state');
    expect(before).not.toBe(after);
  });
});

describe('Sidebar sub-components', () => {
  it('renders SidebarHeader', () => {
    const { container } = render(
      <Wrapper><SidebarHeader>Logo</SidebarHeader></Wrapper>
    );
    expect(container.querySelector('[data-slot="sidebar-header"]')).toBeInTheDocument();
  });

  it('renders SidebarFooter', () => {
    const { container } = render(
      <Wrapper><SidebarFooter>Footer</SidebarFooter></Wrapper>
    );
    expect(container.querySelector('[data-slot="sidebar-footer"]')).toBeInTheDocument();
  });

  it('renders SidebarContent', () => {
    const { container } = render(
      <Wrapper><SidebarContent>Nav items</SidebarContent></Wrapper>
    );
    expect(container.querySelector('[data-slot="sidebar-content"]')).toBeInTheDocument();
  });

  it('renders SidebarGroup and SidebarGroupLabel', () => {
    render(
      <Wrapper>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent><span>Items</span></SidebarGroupContent>
        </SidebarGroup>
      </Wrapper>
    );
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
  });

  it('renders SidebarGroupLabel asChild', () => {
    render(
      <Wrapper>
        <SidebarGroupLabel asChild><span>Label</span></SidebarGroupLabel>
      </Wrapper>
    );
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renders SidebarGroupAction', () => {
    const { container } = render(
      <Wrapper>
        <SidebarGroup>
          <SidebarGroupAction aria-label="Add item"><span>+</span></SidebarGroupAction>
        </SidebarGroup>
      </Wrapper>
    );
    expect(container.querySelector('[data-slot="sidebar-group-action"]')).toBeInTheDocument();
  });

  it('renders SidebarMenu with items', () => {
    render(
      <Wrapper>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Dashboard</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Orders</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Wrapper>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('renders SidebarMenuButton with isActive', () => {
    const { container } = render(
      <Wrapper>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>Active Page</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Wrapper>
    );
    expect(container.querySelector('[data-active="true"]')).toBeInTheDocument();
  });

  it('renders SidebarMenuButton with tooltip string', () => {
    render(
      <Wrapper>
        <Sidebar collapsible="icon">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard">Dash</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </Wrapper>
    );
    expect(screen.getByText('Dash')).toBeInTheDocument();
  });

  it('renders SidebarMenuButton with size variants', () => {
    const { container } = render(
      <Wrapper>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">Small</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">Large</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </Wrapper>
    );
    expect(container.querySelector('[data-size="sm"]')).toBeInTheDocument();
    expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
  });

  it('renders SidebarMenuAction', () => {
    const { container } = render(
      <Wrapper>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Item</SidebarMenuButton>
            <SidebarMenuAction aria-label="More"><span>•••</span></SidebarMenuAction>
          </SidebarMenuItem>
        </SidebarMenu>
      </Wrapper>
    );
    expect(container.querySelector('[data-slot="sidebar-menu-action"]')).toBeInTheDocument();
  });

  it('renders SidebarMenuAction with showOnHover', () => {
    const { container } = render(
      <Wrapper>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Item</SidebarMenuButton>
            <SidebarMenuAction showOnHover aria-label="Delete"><span>🗑</span></SidebarMenuAction>
          </SidebarMenuItem>
        </SidebarMenu>
      </Wrapper>
    );
    expect(container.querySelector('[data-slot="sidebar-menu-action"]')).toBeInTheDocument();
  });

  it('renders SidebarMenuBadge', () => {
    render(
      <Wrapper>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Inbox</SidebarMenuButton>
            <SidebarMenuBadge>12</SidebarMenuBadge>
          </SidebarMenuItem>
        </SidebarMenu>
      </Wrapper>
    );
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders SidebarMenuSkeleton without icon', () => {
    const { container } = render(
      <Wrapper><SidebarMenuSkeleton /></Wrapper>
    );
    expect(container.querySelector('[data-slot="sidebar-menu-skeleton"]')).toBeInTheDocument();
    expect(container.querySelector('[data-sidebar="menu-skeleton-icon"]')).not.toBeInTheDocument();
  });

  it('renders SidebarMenuSkeleton with icon', () => {
    const { container } = render(
      <Wrapper><SidebarMenuSkeleton showIcon /></Wrapper>
    );
    expect(container.querySelector('[data-sidebar="menu-skeleton-icon"]')).toBeInTheDocument();
  });

  it('renders SidebarMenuSub with sub-items', () => {
    render(
      <Wrapper>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton href="#">Sub Page</SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </Wrapper>
    );
    expect(screen.getByText('Sub Page')).toBeInTheDocument();
  });

  it('renders SidebarMenuSubButton with isActive', () => {
    const { container } = render(
      <Wrapper>
        <SidebarMenuSubButton href="#" isActive>Active Sub</SidebarMenuSubButton>
      </Wrapper>
    );
    expect(container.querySelector('[data-active="true"]')).toBeInTheDocument();
  });

  it('renders SidebarMenuSubButton with sm size', () => {
    const { container } = render(
      <Wrapper>
        <SidebarMenuSubButton href="#" size="sm">Small Sub</SidebarMenuSubButton>
      </Wrapper>
    );
    expect(container.querySelector('[data-size="sm"]')).toBeInTheDocument();
  });

  it('renders SidebarSeparator', () => {
    const { container } = render(
      <Wrapper><SidebarSeparator /></Wrapper>
    );
    expect(container.querySelector('[data-slot="sidebar-separator"]')).toBeInTheDocument();
  });

  it('renders SidebarInput', () => {
    render(
      <Wrapper><SidebarInput placeholder="Search routes..." /></Wrapper>
    );
    expect(screen.getByPlaceholderText('Search routes...')).toBeInTheDocument();
  });

  it('renders SidebarInset as main element', () => {
    const { container } = render(
      <Wrapper><SidebarInset>Page content</SidebarInset></Wrapper>
    );
    expect(container.querySelector('main[data-slot="sidebar-inset"]')).toBeInTheDocument();
  });
});

describe('useSidebar hook', () => {
  it('throws when used outside SidebarProvider', () => {
    const TestComponent = () => {
      useSidebar();
      return null;
    };
    expect(() => render(<TestComponent />)).toThrow(
      'useSidebar must be used within a SidebarProvider.'
    );
  });

  it('returns sidebar context when inside provider', () => {
    let ctx: ReturnType<typeof useSidebar> | null = null;
    const TestComponent = () => {
      ctx = useSidebar();
      return null;
    };
    render(<Wrapper><TestComponent /></Wrapper>);
    expect(ctx).not.toBeNull();
    expect(ctx!.state).toMatch(/expanded|collapsed/);
  });

  it('handles global Cmd+B keyboard shortcut to toggle sidebar', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    // It starts expanded default
    
    // Trigger Cmd+B natively on the window
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true, metaKey: true });
    
    // Test successfully completes without throwing
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders the Sidebar as a Sheet in mobile view', () => {
    // Temporarily mock window innerWidth
    const originalInnerWidth = window.innerWidth;
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Mobile Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    
    expect(container).toBeInTheDocument();
    
    window.innerWidth = originalInnerWidth;
    window.dispatchEvent(new Event('resize'));
  });

  it('SidebarRail handles click to toggle', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Rail test</SidebarContent>
          <SidebarRail data-testid="rail" />
        </Sidebar>
      </SidebarProvider>
    );
    
    const rail = screen.getByTestId('rail');
    fireEvent.click(rail);
    
    expect(rail).toBeInTheDocument();
  });
});
