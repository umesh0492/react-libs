// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * react-lib component directory, architecture overview, and quick-reference guide.
 * Rendered as a TSX docs-only story to avoid Vite MDX transformation issues.
 */
const meta = {
  title: 'Introduction',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**@umesh0492/react-lib** — Shared UI component library for modern enterprise procurement portals. ' +
          '75+ components · 828 tests · 100% pass rate · 99% coverage · Storybook 10 · Tailwind v4 · React 19',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sub-components ────────────────────────────────────────────────────────────

function Badge({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9999,
        border: '1px solid',
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 600,
        background: accent ? '#111827' : '#f3f4f6',
        color: accent ? '#f9fafb' : '#374151',
        borderColor: accent ? '#111827' : '#e5e7eb',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {children}
    </span>
  );
}

function ComponentChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 6,
        border: '1px solid #e5e7eb',
        padding: '3px 10px',
        fontSize: 12,
        fontWeight: 500,
        background: '#f9fafb',
        color: '#374151',
      }}
    >
      {label}
    </span>
  );
}

function Section({
  emoji,
  title,
  items,
  color,
}: {
  emoji: string;
  title: string;
  items: string[];
  color?: string;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 18,
            background: color ?? '#f3f4f6',
            borderRadius: 8,
            padding: '4px 8px',
          }}
        >
          {emoji}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{title}</span>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{items.length} components</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map((item) => (
          <ComponentChip key={item} label={item} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  sub,
  accent,
}: {
  value: string;
  label: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '20px 24px',
        flex: '1 1 120px',
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, color: accent ?? '#111827', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        background: '#111827',
        color: '#f9fafb',
        borderRadius: 10,
        padding: '16px 20px',
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        overflow: 'auto',
        margin: 0,
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: '#111827',
        margin: '0 0 20px',
        paddingBottom: 12,
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      {children}
    </h2>
  );
}

function QuickLink({
  href,
  label,
  subtitle,
  icon,
}: {
  href: string;
  label: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        padding: '16px 18px',
        textDecoration: 'none',
        background: '#fafafa',
        transition: 'background 0.15s',
      }}
    >
      <span style={{ fontSize: 20, marginBottom: 2 }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#6b7280' }}>{subtitle}</span>
    </a>
  );
}

// ─── Main Story ────────────────────────────────────────────────────────────────

/** Component directory and architecture guide for @umesh0492/react-lib. */
export const ComponentDirectory: Story = {
  render: () => (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '40px',
        color: '#111827',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* ── Hero ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: '36px 40px',
            marginBottom: 32,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ margin: '0 0 6px', fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px' }}>
              react-lib
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: '#6b7280' }}>
              <strong style={{ color: '#111827' }}>@umesh0492/react-lib</strong> —
              Shared UI component library for modern enterprise procurement portals.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
            {[
              { label: 'v1.0.42', accent: true },
              { label: '75+ components' },
              { label: '828 tests' },
              { label: '99% coverage' },
              { label: '100% passing' },
              { label: 'Storybook 10' },
              { label: 'Tailwind v4' },
              { label: 'React 19' },
              { label: 'TypeScript 5' },
            ].map(({ label, accent }) => (
              <Badge key={label} accent={accent}>
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <StatCard value="75+" label="Components" sub="Across 7 domains" />
          <StatCard value="828" label="Tests" sub="Solid 99% Coverage" accent="#16a34a" />
          <StatCard value="100%" label="Pass Rate" sub="0 failures" accent="#16a34a" />
          <StatCard value="6ms" label="P50 Latency" sub="Median test time" />
          <StatCard value="305ms" label="P95 Latency" sub="95th percentile" />
        </div>

        {/* ── Installation ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: '28px 32px',
            marginBottom: 32,
          }}
        >
          <SectionTitle>📦 Installation</SectionTitle>

          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 0, marginBottom: 16 }}>
            The package is published to GitHub Packages. Add an <code>.npmrc</code> to authenticate:
          </p>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              .npmrc
            </p>
            <CodeBlock>{`@umesh0492:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GH_PACKAGE_TOKEN}`}</CodeBlock>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Install
            </p>
            <CodeBlock>{`npm install @umesh0492/react-libs`}</CodeBlock>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              CSS — import once in your app root (e.g. index.css)
            </p>
            <CodeBlock>{`@import "@umesh0492/react-libs/src/styles/theme.css";`}</CodeBlock>
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Vite alias setup (vite.config.ts) — enables @ui/* short imports
            </p>
            <CodeBlock>{`import { resolve } from 'path';

// In plugins/resolve.alias:
{
  '@ui/misc': resolve(__dirname, '../node_modules/@umesh0492/react-libs/src/hooks'),
  '@ui': resolve(__dirname, '../node_modules/@umesh0492/react-libs/src/components/ui'),
}`}</CodeBlock>
          </div>
        </div>

        {/* ── Theming ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: '28px 32px',
            marginBottom: 32,
          }}
        >
          <SectionTitle>🎨 Theming</SectionTitle>

          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 0, marginBottom: 16 }}>
            All components consume semantic CSS custom properties. Override them in your app's{' '}
            <code>:root</code> to apply your brand — no class wrapping needed.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Partner Portal (orange brand)
              </p>
              <CodeBlock>{`:root {
  --color-primary: 24.6 95% 53.1%;
  /* hsl(25, 95%, 53%) — Primary orange accent */
}`}</CodeBlock>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Catalog Portal (default green)
              </p>
              <CodeBlock>{`:root {
  /* Uses react-lib defaults */
  /* --color-primary: 142.1 76.2% 36.3% */
}`}</CodeBlock>
            </div>
          </div>

          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
            Token reference → <strong>Docs / Design Tokens</strong> in the sidebar.
          </p>
        </div>

        {/* ── Component Domains ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: '28px 32px',
            marginBottom: 32,
          }}
        >
          <SectionTitle>🧩 Component Domains</SectionTitle>

          <Section
            emoji="🎨"
            color="#fef3c7"
            title="Forms"
            items={[
              'Button', 'ButtonGroup', 'Checkbox', 'RadioGroup', 'Select', 'FilterSelect',
              'Input', 'InputGroup', 'InputOTP', 'Switch', 'Toggle', 'ToggleGroup',
              'Textarea', 'Slider', 'Form', 'Label', 'Field',
            ]}
          />

          <Section
            emoji="📊"
            color="#dbeafe"
            title="Data Display"
            items={[
              'Accordion', 'Avatar', 'Badge', 'ActiveFilterBadge', 'StatusBadge',
              'Card', 'Chart', 'Collapsible', 'Carousel', 'DataTable', 'Table', 'HoverCard',
            ]}
          />

          <Section
            emoji="🖼️"
            color="#ede9fe"
            title="Overlays"
            items={[
              'Dialog', 'AlertDialog', 'ConfirmDialog', 'Popover', 'Tooltip',
              'Sheet', 'DropdownMenu', 'ContextMenu', 'Command', 'Drawer',
            ]}
          />

          <Section
            emoji="🧭"
            color="#d1fae5"
            title="Navigation & Layout"
            items={[
              'Tabs', 'Breadcrumb', 'Menubar', 'Pagination', 'Sidebar',
              'NavigationMenu', 'AspectRatio', 'ResizablePanelGroup', 'ScrollArea', 'Separator',
            ]}
          />

          <Section
            emoji="💬"
            color="#fce7f3"
            title="Feedback"
            items={[
              'Progress', 'Skeleton', 'SkeletonList', 'Toaster', 'Sonner', 'Alert',
              'EmptyState', 'RoleEmptyState', 'Spinner', 'SuccessMicroInteraction',
            ]}
          />

          <Section
            emoji="⚙️"
            color="#f3f4f6"
            title="Core"
            items={['Calendar', 'DateRangePicker', 'LanguageToggle', 'Kbd']}
          />
        </div>

        {/* ── Import Paths ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: '28px 32px',
            marginBottom: 32,
          }}
        >
          <SectionTitle>📍 Import Paths</SectionTitle>
          <CodeBlock>{`// Components (via @ui/* alias)
import { Button }           from '@ui/forms/button';
import { Card }             from '@ui/layout/card';
import { Badge }            from '@ui/data-display/badge';
import { Dialog }           from '@ui/overlays/dialog';
import { Tabs }             from '@ui/navigation/tabs';
import { Spinner }          from '@ui/feedback/spinner';
import { EmptyState }       from '@ui/feedback/empty-state';
import { RoleEmptyState }   from '@ui/feedback/role-empty-state';
import { SkeletonList }     from '@ui/feedback/skeleton-list';
import { Calendar }         from '@ui/core/calendar';
import { DateRangePicker }  from '@ui/core/date-range-picker';
import { LanguageToggle }   from '@ui/core/language-toggle';
import { ActiveFilterBadge } from '@ui/data-display/ActiveFilterBadge';
import { StatusBadge }      from '@ui/data-display/status-badge';

// Hooks (via @ui/misc/* alias)
import { useToast }         from '@ui/misc/use-toast';`}</CodeBlock>
        </div>

        {/* ── Quick Links ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: '28px 32px',
            marginBottom: 32,
          }}
        >
          <SectionTitle>🔗 Quick Links</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            <QuickLink
              href="?path=/docs/docs-design-tokens--docs"
              icon="🎨"
              label="Design Tokens"
              subtitle="Semantic color, radius & typography reference"
            />
            <QuickLink
              href="?path=/docs/docs-performance-dashboard--docs"
              icon="⚡"
              label="Performance Dashboard"
              subtitle="Live P50/P95/P99 latency per component"
            />
            <QuickLink
              href="https://github.com/umesh0492/react-lib"
              icon="📖"
              label="GitHub Repository"
              subtitle="Source code, issues & releases"
            />
            <QuickLink
              href="https://github.com/umesh0492/react-libs/releases"
              icon="🚀"
              label="Changelog"
              subtitle="Release notes & version history"
            />
          </div>
        </div>

        {/* ── Commands ── */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: '28px 32px',
          }}
        >
          <SectionTitle>⌨️ Common Commands</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { cmd: 'npm run storybook', desc: 'Start Storybook dev server (port 6006)' },
              { cmd: 'npm run build-storybook', desc: 'Build static Storybook for CI/deploy' },
              { cmd: 'npm test -- --coverage', desc: 'Run 828 tests with coverage report' },
              { cmd: 'npm run perf', desc: 'Regenerate performance benchmark data' },
              { cmd: 'npm run build', desc: 'Build the library for publishing' },
              { cmd: 'npm publish', desc: 'Publish to GitHub Packages (CI only)' },
            ].map(({ cmd, desc }) => (
              <div
                key={cmd}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <code style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#111827' }}>
                  {cmd}
                </code>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6b7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  ),
};
