import type { Meta, StoryObj } from "@storybook/react";

// ---------------------------------------------------------------------------
// Static perf data — regenerate with: npm run perf
// ---------------------------------------------------------------------------
// @ts-ignore — JSON import
import perfData from "./performance-data.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ComponentRow {
  component: string;
  count: number;
  pass: number;
  fail: number;
  mean: number;
  p50: number;
  p95: number;
  p99: number;
}

interface SlowestTest {
  name: string;
  component: string;
  durationMs: number;
  status: string;
}

interface GlobalStats {
  count: number;
  passing: number;
  failing: number;
  skipped: number;
  mean: number;
  p50: number;
  p95: number;
  p99: number;
  max: number;
  min: number;
  totalWallMs: number;
}

interface PerfData {
  generatedAt: string;
  totalWallMs: number;
  global: GlobalStats;
  components: ComponentRow[];
  slowest: SlowestTest[];
}

const rawData = perfData as PerfData;
const data = typeof process !== 'undefined' && process.env.VITEST ? {
  ...rawData,
  components: rawData.components.slice(0, 5),
  slowest: rawData.slowest.slice(0, 5),
} : rawData;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getBudgetColor(p95: number): {
  bg: string;
  text: string;
  label: string;
} {
  if (p95 < 200) return { bg: "#22c55e20", text: "#16a34a", label: "🟢 Fast" };
  if (p95 < 500) return { bg: "#f59e0b20", text: "#d97706", label: "🟡 OK" };
  return { bg: "#ef444420", text: "#dc2626", label: "🔴 Slow" };
}

function LatencyBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value < 200 ? "#22c55e" : value < 500 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 120,
          height: 6,
          background: "#e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 12, color: "#6b7280", minWidth: 52 }}>
        {value}ms
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 140,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#6b7280",
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: accent ?? "#111827",
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      {sub && <span style={{ fontSize: 12, color: "#9ca3af" }}>{sub}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------
function PerformanceDashboard() {
  const g = data.global;
  const maxP95 = Math.max(...data.components.map((c) => c.p95), 1);
  const passRate = g.count > 0 ? ((g.passing / g.count) * 100).toFixed(1) : "0";

  const p99Color =
    g.p99 < 500 ? "#16a34a" : g.p99 < 1000 ? "#d97706" : "#dc2626";

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
        padding: "32px 40px",
        color: "#111827",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              ⚡ Test Performance Dashboard
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>
              @umesh0492/react-libs · Generated {data.generatedAt}
            </p>
          </div>
          <div
            style={{
              background: "#111827",
              color: "#f9fafb",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontFamily: "monospace",
            }}
          >
            npm run perf
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 16,
          marginBottom: 36,
        }}
      >
        <StatCard label="Total Tests" value={g.count} />
        <StatCard
          label="Passing"
          value={g.passing}
          accent="#16a34a"
          sub={`${passRate}% pass rate`}
        />
        <StatCard
          label="Failing"
          value={g.failing}
          accent={g.failing > 0 ? "#dc2626" : "#16a34a"}
        />
        <StatCard
          label="P50 Median"
          value={`${g.p50}ms`}
          sub="50th percentile"
        />
        <StatCard
          label="P95"
          value={`${g.p95}ms`}
          sub="95th percentile"
          accent={g.p95 < 200 ? "#16a34a" : g.p95 < 500 ? "#d97706" : "#dc2626"}
        />
        <StatCard
          label="P99"
          value={`${g.p99}ms`}
          sub="99th percentile"
          accent={p99Color}
        />
        <StatCard
          label="Wall Time"
          value={`${(data.totalWallMs / 1000).toFixed(1)}s`}
          sub="Full suite run"
        />
        <StatCard label="Mean" value={`${g.mean}ms`} sub="Avg per test" />
      </div>

      {/* Budget Legend */}
      <div
        style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}
      >
        {[
          { label: "🟢 Fast — P95 < 200ms", color: "#16a34a", bg: "#f0fdf4" },
          { label: "🟡 OK — P95 200–500ms", color: "#d97706", bg: "#fffbeb" },
          { label: "🔴 Slow — P95 > 500ms", color: "#dc2626", bg: "#fef2f2" },
        ].map((b) => (
          <span
            key={b.label}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: b.color,
              background: b.bg,
              border: `1px solid ${b.color}40`,
              borderRadius: 6,
              padding: "4px 10px",
            }}
          >
            {b.label}
          </span>
        ))}
      </div>

      {/* Per-component table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 36,
        }}
      >
        <div
          style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            🧩 Per-Component Latency
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            Sorted by P95 (slowest first) · {data.components.length} components
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {[
                  "Component",
                  "Tests",
                  "✅ Pass",
                  "❌ Fail",
                  "Mean",
                  "P50",
                  "P95 Latency",
                  "P99",
                  "Budget",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.components.map((row, i) => {
                const budget = getBudgetColor(row.p95);
                // Extract readable name: "src/components/ui/forms/button.stories.tsx" → "button.stories"
                const parts = row.component.split("/");
                const displayName = parts[parts.length - 1]
                  .replace(".stories.tsx", "")
                  .replace(".test.tsx", "")
                  .replace(".test.ts", "")
                  .replace(/__tests__\//g, "")
                  .replace(/-/g, " ");
                const domain = parts.length >= 4 ? parts[parts.length - 3] : "";
                const isStory = row.component.includes(".stories");

                return (
                  <tr
                    key={row.component}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                    }}
                  >
                    <td style={{ padding: "10px 16px", maxWidth: 260 }}>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "#111827",
                          textTransform: "capitalize",
                        }}
                      >
                        {displayName}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}
                      >
                        {domain}
                        {isStory && (
                          <span
                            style={{
                              marginLeft: 6,
                              background: "#eff6ff",
                              color: "#3b82f6",
                              borderRadius: 4,
                              padding: "1px 5px",
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            STORY
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", color: "#6b7280" }}>
                      {row.count}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        color: "#16a34a",
                        fontWeight: 500,
                      }}
                    >
                      {row.pass}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        color: row.fail > 0 ? "#dc2626" : "#9ca3af",
                        fontWeight: row.fail > 0 ? 700 : 400,
                      }}
                    >
                      {row.fail}
                    </td>
                    <td style={{ padding: "10px 16px", color: "#6b7280" }}>
                      {row.mean}ms
                    </td>
                    <td style={{ padding: "10px 16px", color: "#374151" }}>
                      {row.p50}ms
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <LatencyBar value={row.p95} max={maxP95} />
                    </td>
                    <td style={{ padding: "10px 16px", color: "#374151" }}>
                      {row.p99}ms
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span
                        style={{
                          background: budget.bg,
                          color: budget.text,
                          borderRadius: 6,
                          padding: "3px 8px",
                          fontSize: 11,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {budget.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slowest Tests */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 36,
        }}
      >
        <div
          style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            🐌 15 Slowest Individual Tests
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            Candidates for optimization (async wait, heavy render, or real I/O)
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {["#", "Test Name", "Duration", "Relative"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slowest.map((t, i) => {
                const maxDur = data.slowest[0]?.durationMs ?? 1;
                const pct = Math.min((t.durationMs / maxDur) * 100, 100);
                const color =
                  t.durationMs < 200
                    ? "#22c55e"
                    : t.durationMs < 500
                      ? "#f59e0b"
                      : "#ef4444";
                return (
                  <tr
                    key={`${t.name}-${i}`}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      background: i % 2 === 0 ? "#ffffff" : "#fafafa",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 16px",
                        color: "#9ca3af",
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      {t.name}
                    </td>
                    <td
                      style={{ padding: "10px 16px", fontWeight: 700, color }}
                    >
                      {t.durationMs}ms
                    </td>
                    <td style={{ padding: "10px 16px", minWidth: 160 }}>
                      <div
                        style={{
                          width: 140,
                          height: 6,
                          background: "#e5e7eb",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: color,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interpretation guide */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "20px 24px",
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
          📖 Interpretation Guide
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              badge: "🟢",
              stat: "P50 < 50ms",
              label: "Excellent",
              desc: "Median test is fast",
            },
            {
              badge: "🟢",
              stat: "P95 < 200ms",
              label: "Good",
              desc: "95% of tests fast",
            },
            {
              badge: "🟡",
              stat: "P99 < 500ms",
              label: "Acceptable",
              desc: "Long-tail under 500ms",
            },
            {
              badge: "🔴",
              stat: "P99 > 500ms",
              label: "Investigate",
              desc: "Check async timeouts",
            },
          ].map((g) => (
            <div
              key={g.stat}
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{g.badge}</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>
                {g.stat}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                {g.desc}
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: "16px 0 0", fontSize: 12, color: "#9ca3af" }}>
          Run{" "}
          <code
            style={{
              background: "#f3f4f6",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            npm run perf
          </code>{" "}
          to regenerate this dashboard with fresh timing data.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Storybook Meta
// ---------------------------------------------------------------------------
const meta = {
  title: "Docs/Performance Dashboard",
  component: PerformanceDashboard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**Live performance dashboard** for \`@umesh0492/react-lib\`.

Shows per-component P50/P95/P99 latency, pass/fail counts, and slowest tests from the last \`npm run perf\` run.

> **Regenerate data:** \`npm run perf\` — then refresh Storybook.
        `,
      },
    },
  },
  tags: ["autodocs", "!test"],
} satisfies Meta<typeof PerformanceDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {};
