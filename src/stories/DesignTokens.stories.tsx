// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Visual reference for all design tokens used by react-lib.
 * Every value maps to a CSS custom property defined in theme.css.
 * Components consume these tokens via Tailwind utility classes —
 * never raw hex values. Override in your app's :root to re-theme.
 */
const meta = {
  title: 'Docs/Design Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'All design tokens are CSS custom properties in `theme.css` under `@theme inline`. ' +
          'Override them at `:root` in your app CSS to apply your brand — ' +
          'all react-lib components will reflect the change automatically. ' +
          'See **Introduction → Theming** for multi-tenant setup (partner-portal orange vs. catalog green).',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Swatch({ token, label, description }: { token: string; label: string; description?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 110 }}>
      <div
        style={{
          height: 60,
          width: '100%',
          borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          background: `hsl(var(${token}) / 1)`,
        }}
      />
      <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151', lineHeight: 1.4 }}>{token}</code>
      <span style={{ fontSize: 11, color: '#9ca3af' }}>{label}</span>
      {description && <span style={{ fontSize: 10, color: '#d1d5db' }}>{description}</span>}
    </div>
  );
}

function SolidSwatch({ bg, border, label, token }: { bg: string; border?: string; label: string; token: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 110 }}>
      <div
        style={{
          height: 60,
          width: '100%',
          borderRadius: 10,
          border: border ? `2px solid ${border}` : '1px solid rgba(0,0,0,0.08)',
          background: bg,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      />
      <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151', lineHeight: 1.4 }}>{token}</code>
      <span style={{ fontSize: 11, color: '#9ca3af' }}>{label}</span>
    </div>
  );
}

function RadiusSwatch({ token, label }: { token: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <div
        style={{
          height: 64,
          width: 64,
          background: 'hsl(var(--color-primary) / 1)',
          borderRadius: `var(${token})`,
        }}
      />
      <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151', textAlign: 'center' }}>{token}</code>
      <span style={{ fontSize: 11, color: '#9ca3af' }}>{label}</span>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 4px',
          paddingBottom: 10,
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        {title}
      </h2>
      {description && <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 16px' }}>{description}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: description ? 0 : 16 }}>
        {children}
      </div>
    </section>
  );
}

function ShadowRow({ token, label, shadow }: { token: string; label: string; shadow: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div
        style={{
          width: 80,
          height: 40,
          background: '#ffffff',
          borderRadius: 8,
          boxShadow: shadow,
          flexShrink: 0,
        }}
      />
      <div>
        <code style={{ fontSize: 12, fontFamily: 'monospace', color: '#374151' }}>{token}</code>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>{label}</p>
      </div>
    </div>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

/** Complete token palette — semantic colors, sidebar, radius, shadows, and typography. */
export const Colors: Story = {
  render: () => (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '32px',
        maxWidth: 1000,
        color: '#111827',
      }}
    >
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Design Tokens
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
          All tokens are CSS custom properties. Components consume them via Tailwind semantic classes.
          Override in your app <code>:root</code> to re-theme. Dark mode overrides go in{' '}
          <code>.dark</code>.
        </p>
      </div>

      <Section
        title="Brand / Primary"
        description="The primary brand color. Override --color-primary in :root for your app's brand."
      >
        <Swatch token="--color-primary" label="primary" description="Brand action color" />
        <Swatch token="--color-primary-foreground" label="primary-foreground" description="Text on primary bg" />
      </Section>

      <Section title="Neutral / Background">
        <Swatch token="--color-background" label="background" />
        <Swatch token="--color-foreground" label="foreground" />
        <Swatch token="--color-muted" label="muted" />
        <Swatch token="--color-muted-foreground" label="muted-foreground" />
        <Swatch token="--color-card" label="card" />
        <Swatch token="--color-card-foreground" label="card-foreground" />
        <Swatch token="--color-popover" label="popover" />
        <Swatch token="--color-popover-foreground" label="popover-foreground" />
      </Section>

      <Section title="Interactive">
        <Swatch token="--color-secondary" label="secondary" />
        <Swatch token="--color-secondary-foreground" label="secondary-foreground" />
        <Swatch token="--color-accent" label="accent" />
        <Swatch token="--color-accent-foreground" label="accent-foreground" />
      </Section>

      <Section title="Semantic / Status">
        <Swatch token="--color-destructive" label="destructive" />
        <Swatch token="--color-destructive-foreground" label="destructive-foreground" />
      </Section>

      <Section title="Border / Input / Ring">
        <Swatch token="--color-border" label="border" />
        <Swatch token="--color-input" label="input" />
        <Swatch token="--color-ring" label="ring" />
      </Section>

      <Section
        title="Sidebar"
        description="Dedicated sidebar tokens — can be tinted independently of the main palette."
      >
        <Swatch token="--color-sidebar" label="sidebar" />
        <Swatch token="--color-sidebar-foreground" label="sidebar-foreground" />
        <Swatch token="--color-sidebar-primary" label="sidebar-primary" />
        <Swatch token="--color-sidebar-primary-foreground" label="sidebar-primary-fg" />
        <Swatch token="--color-sidebar-accent" label="sidebar-accent" />
        <Swatch token="--color-sidebar-accent-foreground" label="sidebar-accent-fg" />
        <Swatch token="--color-sidebar-border" label="sidebar-border" />
        <Swatch token="--color-sidebar-ring" label="sidebar-ring" />
      </Section>

      <Section title="Chart Palette" description="Five distinct chart colors for data visualizations.">
        <Swatch token="--color-chart-1" label="chart-1" />
        <Swatch token="--color-chart-2" label="chart-2" />
        <Swatch token="--color-chart-3" label="chart-3" />
        <Swatch token="--color-chart-4" label="chart-4" />
        <Swatch token="--color-chart-5" label="chart-5" />
      </Section>

      <Section title="Border Radius Scale">
        <RadiusSwatch token="--radius-sm" label="radius-sm · 4px" />
        <RadiusSwatch token="--radius-md" label="radius-md · 8px" />
        <RadiusSwatch token="--radius" label="radius · 12px" />
        <RadiusSwatch token="--radius-lg" label="radius-lg · 16px" />
        <RadiusSwatch token="--radius-xl" label="radius-xl · 24px" />
      </Section>

      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 4px',
            paddingBottom: 10,
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          Shadow Scale
        </h2>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 16px' }}>
          Used for cards, popovers, and elevated surfaces.
        </p>
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: '0 20px' }}>
          <ShadowRow token="shadow-sm" label="Subtle — inputs, badges" shadow="0 1px 2px rgba(0,0,0,0.05)" />
          <ShadowRow token="shadow" label="Default — cards" shadow="0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" />
          <ShadowRow token="shadow-md" label="Medium — dropdowns" shadow="0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)" />
          <ShadowRow token="shadow-lg" label="Large — dialogs, sheets" shadow="0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)" />
          <ShadowRow token="shadow-xl" label="X-Large — command palette" shadow="0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)" />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 4px',
            paddingBottom: 10,
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          Typography Scale
        </h2>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 16px' }}>
          Inter font family · Size step × 1.25 ratio
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { size: '12px', weight: 400, token: 'text-xs', label: 'text-xs · Captions, badges' },
            { size: '14px', weight: 400, token: 'text-sm', label: 'text-sm · Body copy, table cells' },
            { size: '16px', weight: 400, token: 'text-base', label: 'text-base · Default body' },
            { size: '18px', weight: 600, token: 'text-lg', label: 'text-lg · Section subheadings' },
            { size: '20px', weight: 700, token: 'text-xl', label: 'text-xl · Page subheadings' },
            { size: '24px', weight: 700, token: 'text-2xl', label: 'text-2xl · Page titles' },
            { size: '30px', weight: 800, token: 'text-3xl', label: 'text-3xl · Hero headings' },
          ].map(({ size, weight, token, label }) => (
            <div
              key={token}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 20,
                padding: '8px 0',
                borderBottom: '1px solid #f9fafb',
              }}
            >
              <span style={{ fontSize: size, fontWeight: weight, minWidth: 120, color: '#111827' }}>
                Aa
              </span>
              <div>
                <code style={{ fontSize: 12, fontFamily: 'monospace', color: '#6b7280' }}>{token}</code>
                <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 12 }}>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: '20px 24px',
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#15803d' }}>
          💡 How to Override
        </h3>
        <pre
          style={{
            background: '#111827',
            color: '#f9fafb',
            borderRadius: 8,
            padding: '14px 18px',
            fontSize: 12,
            fontFamily: 'monospace',
            overflow: 'auto',
            margin: 0,
          }}
        >
          {`:root {
  /* Override brand color for your app */
  --color-primary: 24.6 95% 53.1%;        /* Vibrant orange accent */
  --color-primary-foreground: 0 0% 100%;

  /* Override sidebar independently */
  --color-sidebar: 20 14% 4%;
  --color-sidebar-primary: 24.6 95% 53.1%;
}

.dark {
  --color-background: 224 71% 4%;
  --color-primary: 24.6 95% 53.1%;
}`}
        </pre>
      </section>
    </div>
  ),
};
