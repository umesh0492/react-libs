import type { Meta, StoryObj } from '@storybook/react';
import { expect, waitFor } from 'storybook/test';
import {
  Bar, BarChart, Line, LineChart, Area, AreaChart,
  Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from './chart';

/**
 * `ChartContainer` wraps Recharts charts with:
 * - CSS variable color injection per series (`--color-{key}`)
 * - Muted-foreground tick text via attribute selectors
 * - Shared tooltip + legend sub-components
 *
 * **Phase 3 fixes (story coverage):**
 * - Added `YAxis` to show value axis with muted tick styling
 * - Added `ChartLegend` / `ChartLegendContent` stories
 * - Added muted multi-series palette via `hsl(var(--chart-N))`
 * - Added Area, Line, Pie chart variants
 */
const meta = {
  title: 'UI/Data-display/Chart',
  component: ChartContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Recharts wrapper with design-system color tokens, muted axis ticks, ' +
          'and shared `ChartTooltipContent` / `ChartLegendContent` sub-components. ' +
          'Configure series colors via `ChartConfig` using `hsl(var(--chart-N))` tokens.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared data & config ────────────────────────────────────────────────────

const monthlyData = [
  { month: 'Jan', requests: 186, orders: 80,  delivered: 60 },
  { month: 'Feb', requests: 305, orders: 200, delivered: 175 },
  { month: 'Mar', requests: 237, orders: 120, delivered: 100 },
  { month: 'Apr', requests: 73,  orders: 190, delivered: 140 },
  { month: 'May', requests: 209, orders: 130, delivered: 110 },
  { month: 'Jun', requests: 214, orders: 140, delivered: 125 },
];

const multiConfig = {
  requests:  { label: 'Requests',  color: 'hsl(var(--chart-1))' },
  orders:    { label: 'Orders',    color: 'hsl(var(--chart-2))' },
  delivered: { label: 'Delivered', color: 'hsl(var(--chart-3))' },
};

const categoryData = [
  { name: 'Compute',   value: 38 },
  { name: 'Storage',   value: 27 },
  { name: 'Network',   value: 18 },
  { name: 'Database',  value: 12 },
  { name: 'Analytics', value: 5  },
];
const pieConfig = {
  Compute:   { label: 'Compute',   color: 'hsl(var(--chart-1))' },
  Storage:   { label: 'Storage',   color: 'hsl(var(--chart-2))' },
  Network:   { label: 'Network',   color: 'hsl(var(--chart-3))' },
  Database:  { label: 'Database',  color: 'hsl(var(--chart-4))' },
  Analytics: { label: 'Analytics', color: 'hsl(var(--chart-5))' },
};

// ── Stories ─────────────────────────────────────────────────────────────────

/**
 * Bar chart with Y-axis and legend.
 * Fix: Y-axis ticks styled via `[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground`.
 */
export const BarWithYAxis: Story = {
  args: { config: multiConfig, children: <div /> },
  render: () => (
    <div className="w-full max-w-[600px] bg-card rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold text-base mb-1">Activity Overview</h3>
      <p className="text-xs text-muted-foreground mb-4">Jan – Jun 2026</p>
      <ChartContainer config={multiConfig} className="h-[280px] w-full">
        <BarChart data={monthlyData} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
            width={36}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="requests"  fill="var(--color-requests)"  radius={[4,4,0,0]} />
          <Bar dataKey="orders"    fill="var(--color-orders)"    radius={[4,4,0,0]} />
          <Bar dataKey="delivered" fill="var(--color-delivered)" radius={[4,4,0,0]} />
        </BarChart>
      </ChartContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const container = canvasElement.querySelector('[data-chart]');
      if (!container) throw new Error('ChartContainer not mounted');
      expect(container).toBeInTheDocument();
    });
  },
};

/** Line chart — trend over time. */
export const LineWithArea: Story = {
  args: { config: multiConfig, children: <div /> },
  render: () => (
    <div className="w-full max-w-[600px] bg-card rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold text-base mb-1">Activity Trend</h3>
      <p className="text-xs text-muted-foreground mb-4">Monthly volume — Requests vs Orders</p>
      <ChartContainer config={multiConfig} className="h-[260px] w-full">
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={36} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey="requests" stroke="var(--color-requests)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="orders"   stroke="var(--color-orders)"   strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  ),
};

/** Stacked area chart — good for cumulative views. */
export const StackedArea: Story = {
  args: { config: multiConfig, children: <div /> },
  render: () => (
    <div className="w-full max-w-[600px] bg-card rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold text-base mb-1">Cumulative Volume</h3>
      <p className="text-xs text-muted-foreground mb-4">Stacked area — Requests, Orders, Delivered</p>
      <ChartContainer config={multiConfig} className="h-[260px] w-full">
        <AreaChart data={monthlyData}>
          <defs>
            {Object.entries(multiConfig).map(([key, { color }]) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={36} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area type="monotone" dataKey="requests"  stroke="var(--color-requests)"  fill="url(#grad-requests)"  strokeWidth={2} />
          <Area type="monotone" dataKey="orders"    stroke="var(--color-orders)"    fill="url(#grad-orders)"    strokeWidth={2} />
          <Area type="monotone" dataKey="delivered" stroke="var(--color-delivered)" fill="url(#grad-delivered)" strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
    </div>
  ),
};

/** Donut / Pie chart — category distribution. */
export const DonutPie: Story = {
  args: { config: pieConfig, children: <div /> },
  render: () => (
    <div className="w-full max-w-[420px] bg-card rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold text-base mb-1">Resource Category Mix</h3>
      <p className="text-xs text-muted-foreground mb-4">Share by infrastructure allocation</p>
      <ChartContainer config={pieConfig} className="h-[240px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
            {categoryData.map((entry) => (
              <Cell key={entry.name} fill={(pieConfig as Record<string, { label: string; color: string }>)[entry.name]?.color ?? 'hsl(var(--muted))'} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </div>
  ),
};

/** Original minimal bar — no Y-axis (for sparkline-style cards). */
export const Default: Story = {
  args: { config: multiConfig, children: <div /> },
  render: () => (
    <div className="w-[500px] bg-card rounded-lg p-6 border shadow-sm">
      <h3 className="font-semibold text-lg tracking-tight mb-4">Quick Overview</h3>
      <ChartContainer config={multiConfig} className="h-[220px] w-full">
        <BarChart data={monthlyData} barCategoryGap="35%">
          <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.slice(0, 3)} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="requests" fill="var(--color-requests)" radius={4} />
          <Bar dataKey="orders"   fill="var(--color-orders)"   radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const c = canvasElement.querySelector('[data-chart]');
      if (!c) throw new Error('chart not mounted');
      expect(c).toBeInTheDocument();
    });
  },
};