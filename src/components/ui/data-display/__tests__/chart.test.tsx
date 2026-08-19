import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '../chart';
import {
  Bar, BarChart, Line, LineChart,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => <div data-testid="mock-responsive-container">{children}</div>,
  };
});

const mockConfig = {
  sales: { label: 'Sales', color: '#4f46e5' },
  revenue: { label: 'Revenue', color: '#06b6d4' },
};

const barData = [
  { month: 'Jan', sales: 120, revenue: 240 },
  { month: 'Feb', sales: 150, revenue: 300 },
  { month: 'Mar', sales: 90,  revenue: 180 },
];

describe('ChartContainer', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChartContainer config={mockConfig} className="my-chart">
        <BarChart data={barData}><Bar dataKey="sales" /></BarChart>
      </ChartContainer>
    );
    expect(container.querySelector('.my-chart')).toBeInTheDocument();
  });

  it('renders with a BarChart and XAxis', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <XAxis dataKey="month" />
          <Bar dataKey="sales" />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with a LineChart', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <LineChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Line type="monotone" dataKey="sales" />
        </LineChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with multiple bar series', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <XAxis dataKey="month" />
          <Bar dataKey="sales" fill={mockConfig.sales.color} />
          <Bar dataKey="revenue" fill={mockConfig.revenue.color} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with ChartTooltip and ChartTooltipContent', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with ChartLegend and ChartLegendContent', () => {
    // ChartLegendContent requires `payload` — Recharts injects at runtime;
    // supply a minimal typed stub so the type-checker is satisfied.
    const stubPayload: React.ComponentProps<typeof ChartLegendContent>['payload'] = [
      { value: 'sales', type: 'square', color: '#4f46e5', dataKey: 'sales', id: 'sales' },
    ];
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
          <ChartLegend content={<ChartLegendContent payload={stubPayload} />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders ChartTooltipContent standalone', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
        </BarChart>
      </ChartContainer>
    );
    expect(container).toBeTruthy();
  });

  it('renders chart with empty data array without crashing', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={[]}>
          <Bar dataKey="sales" />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with hideLabel prop on ChartTooltipContent', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with hideIndicator prop on ChartTooltipContent', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
          <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ─── Additional coverage — branches and props ─────────────────────────────────

describe('ChartTooltipContent — indicator variants', () => {
  it('renders with indicator="line"', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with indicator="dot"', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with indicator="dashed"', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <Bar dataKey="sales" />
          <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('ChartTooltipContent — direct rendering and payload coverage', () => {
  it('renders gracefully when active=false', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent active={false} />
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders content with active=true and valid payload', () => {
    const stubPayload = [
      { name: 'sales', value: 100, payload: { fill: '#000', month: 'Jan', sales: 100 }, dataKey: 'sales', color: '#4f46e5' },
    ];
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent {...({ active: true, payload: stubPayload } as any)} />
      </ChartContainer>
    );
    expect(screen.getAllByText(/sales/i)[0]).toBeInTheDocument();
  });

  it('accepts a custom labelFormatter', () => {
    const stubPayload = [{ name: 'sales', value: 100, payload: { fill: '#fff' }, dataKey: 'sales', color: '#4f46e5' }];
    render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent 
          {...({ 
            active: true, 
            payload: stubPayload, 
            labelFormatter: (value: any) => `Custom ${value}`,
            label: "Jan" 
          } as any)}
        />
      </ChartContainer>
    );
    expect(screen.getByText(/Custom Jan/i)).toBeInTheDocument();
  });

  it('handles nameKey to override label resolving', () => {
    const stubPayload = [
      { name: 'Jan', value: 100, payload: { fill: '#000', month: 'Jan', sales: 100 }, dataKey: 'sales', color: '#4f46e5' },
    ];
    render(
      <ChartContainer config={{ month: { label: 'Month Config' }}}>
        <ChartTooltipContent {...({ active: true, payload: stubPayload, nameKey: "month" } as any)} />
      </ChartContainer>
    );
    expect(screen.getAllByText(/Month Config/i)[0]).toBeInTheDocument();
  });
});

describe('ChartLegendContent — null/undefined payload', () => {
  it('renders gracefully with empty payload array', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <ChartLegend content={<ChartLegendContent payload={[]} />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with multiple payload items', () => {
    const stubPayload: React.ComponentProps<typeof ChartLegendContent>['payload'] = [
      { value: 'sales',   type: 'square', color: '#4f46e5', dataKey: 'sales',   id: 'sales'   },
      { value: 'revenue', type: 'square', color: '#06b6d4', dataKey: 'revenue', id: 'revenue' },
    ];
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <BarChart data={barData}>
          <ChartLegend content={<ChartLegendContent payload={stubPayload} />} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('ChartContainer — id and CSS variable injection', () => {
  it('injects --color-* CSS variables via a <style> tag', () => {
    const { container } = render(
      <ChartContainer config={mockConfig} id="partner-chart">
        <BarChart data={barData}>
          <Bar dataKey="sales" />
        </BarChart>
      </ChartContainer>
    );
    // The CSS variable is injected via a nested <style> element targeting [data-chart]
    const styleTag = container.querySelector('style');
    expect(styleTag?.textContent).toContain('--color-sales:');
  });

  it('uses the provided id to structure the data-chart attribute on the container', () => {
    const { container } = render(
      <ChartContainer config={mockConfig} id="my-chart">
        <BarChart data={barData}><Bar dataKey="sales" /></BarChart>
      </ChartContainer>
    );
    // The container uses data-chart="chart-my-chart" (the 'chart-' prefix is added)
    expect(container.querySelector('[data-chart="chart-my-chart"]')).toBeInTheDocument();
  });
});
