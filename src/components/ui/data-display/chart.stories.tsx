// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from 'storybook/test';
import {
  Bar, BarChart, Line, LineChart, Area, AreaChart,
  Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
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
  { month: 'Jan', rfq: 186, po: 80,  grn: 60 },
  { month: 'Feb', rfq: 305, po: 200, grn: 175 },
  { month: 'Mar', rfq: 237, po: 120, grn: 100 },
  { month: 'Apr', rfq: 73,  po: 190, grn: 140 },
  { month: 'May', rfq: 209, po: 130, grn: 110 },
  { month: 'Jun', rfq: 214, po: 140, grn: 125 },
];

const multiConfig = {
  rfq:  { label: 'RFQs',         color: 'hsl(var(--chart-1))' },
  po:   { label: 'Purchase Orders', color: 'hsl(var(--chart-2))' },
  grn:  { label: 'GRN Received', color: 'hsl(var(--chart-3))' },
};

const categoryData = [
  { name: 'Produce',    value: 38 },
  { name: 'Grains',     value: 27 },
  { name: 'Spices',     value: 18 },
  { name: 'Dairy',      value: 12 },
  { name: 'Others',     value: 5  },
];
const pieConfig = {
  Produce: { label: 'Produce',  color: 'hsl(var(--chart-1))' },
  Grains:  { label: 'Grains',   color: 'hsl(var(--chart-2))' },
  Spices:  { label: 'Spices',   color: 'hsl(var(--chart-3))' },
  Dairy:   { label: 'Dairy',    color: 'hsl(var(--chart-4))' },
  Others:  { label: 'Others',   color: 'hsl(var(--chart-5))' },
};

// ── Stories ─────────────────────────────────────────────────────────────────

/**
 * Bar chart with Y-axis and legend.
 * Fix: Y-axis ticks styled via `[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground`.
 */
export const BarWithYAxis: Story = {
  args: { config: multiConfig, children: <div /> },
  render: (args) => (
    <div className="w-full max-w-[600px] bg-card rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold text-base mb-1">Procurement Activity</h3>
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
          <Bar dataKey="rfq" fill="var(--color-rfq)" radius={[4,4,0,0]} />
          <Bar dataKey="po"  fill="var(--color-po)"  radius={[4,4,0,0]} />
          <Bar dataKey="grn" fill="var(--color-grn)" radius={[4,4,0,0]} />
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
      <h3 className="font-semibold text-base mb-1">Partner Activity Trend</h3>
      <p className="text-xs text-muted-foreground mb-4">Monthly volume — RFQ vs PO</p>
      <ChartContainer config={multiConfig} className="h-[260px] w-full">
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={36} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey="rfq" stroke="var(--color-rfq)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="po"  stroke="var(--color-po)"  strokeWidth={2} dot={false} />
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
      <p className="text-xs text-muted-foreground mb-4">Stacked area — RFQ, PO, GRN</p>
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
          <Area type="monotone" dataKey="rfq" stroke="var(--color-rfq)" fill="url(#grad-rfq)" strokeWidth={2} />
          <Area type="monotone" dataKey="po"  stroke="var(--color-po)"  fill="url(#grad-po)"  strokeWidth={2} />
          <Area type="monotone" dataKey="grn" stroke="var(--color-grn)" fill="url(#grad-grn)" strokeWidth={2} />
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
      <h3 className="font-semibold text-base mb-1">Partner Category Mix</h3>
      <p className="text-xs text-muted-foreground mb-4">Share by procurement spend</p>
      <ChartContainer config={pieConfig} className="h-[240px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
            {categoryData.map((entry) => (
              <Cell key={entry.name} fill={pieConfig[entry.name]?.color ?? 'hsl(var(--muted))'} />
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
          <Bar dataKey="rfq" fill="var(--color-rfq)" radius={4} />
          <Bar dataKey="po"  fill="var(--color-po)"  radius={4} />
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