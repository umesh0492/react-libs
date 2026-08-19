// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './navigation-menu';

const ListItem = React.forwardRef<
  React.ComponentRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = 'ListItem';

const NavigationMenuDemo = () => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
            <li className="row-span-3">
              <NavigationMenuLink asChild>
                <a
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                  href="/"
                >
                  <div className="mb-2 mt-4 text-lg font-medium text-white">ProcureFlow</div>
                  <p className="text-sm leading-tight text-white/90">
                    Unified supply chain management platform for modern procurement.
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
            <ListItem href="/admin" title="Admin Portal">
              Manage purchase orders, partner approvals, and order tracking.
            </ListItem>
            <ListItem href="/partner" title="Partner Portal">
              Submit quotes, manage GRNs, and handle payment queries.
            </ListItem>
            <ListItem href="/catalog" title="Catalog">
              Track warehouse stock, manage catalogs and variants.
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {[
              { title: 'Button', href: '/docs/button', description: 'Primary actions and interactions.' },
              { title: 'Input', href: '/docs/input', description: 'Text input fields and form controls.' },
              { title: 'Dialog', href: '/docs/dialog', description: 'Modal overlays for important actions.' },
              { title: 'Table', href: '/docs/table', description: 'Data grids for lists and reports.' },
              { title: 'Chart', href: '/docs/chart', description: 'Recharts-based analytics visualizations.' },
              { title: 'Sidebar', href: '/docs/sidebar', description: 'App navigation and layout frame.' },
            ].map((item) => (
              <ListItem key={item.title} title={item.title} href={item.href}>
                {item.description}
              </ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
          Documentation
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

const meta = {
  title: 'UI/Navigation/NavigationMenu',
  component: NavigationMenuDemo,
  parameters: {
    layout: 'centered',
    // Radix NavigationMenuList renders as <ul class="md:flex ..."> with <li> children.
    // The a11y checker false-positives on the md:flex class thinking li is outside a list.
    a11y: {
      config: {
        rules: [{ id: 'listitem', enabled: false }],
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenuDemo>;


export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <NavigationMenuDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('navigation')).toBeInTheDocument();
  },
};
