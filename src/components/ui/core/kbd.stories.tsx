// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Kbd, KbdGroup, KbdShortcut } from "./kbd";

/**
 * Keyboard shortcut display components.
 *
 * **Phase 2 fixes & additions:**
 * - `Kbd` — single key pill (unchanged, already correct)
 * - `KbdGroup` — layout wrapper, `gap-1` between pills
 * - **`KbdShortcut`** *(NEW)* — OS-aware shortcut renderer:
 *   - Auto-detects macOS → shows `⌘`; Windows/Linux → shows `Ctrl`
 *   - Each key in its own pill; `+` separator between them
 *   - Pass `meta` to prepend the platform modifier
 *   - Override detection with `os="mac"` or `os="windows"`
 */
const meta = {
  title: "UI/Core/Kbd",
  component: Kbd,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Styled `<kbd>` element for displaying keyboard shortcuts. " +
          "Use `KbdShortcut` for OS-aware multi-key combos with auto-detected modifier.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Key label (e.g., ⌘, Ctrl, K, Enter).",
      table: { category: "Content" },
    },
    className: {
      control: "text",
      description: "Additional CSS classes.",
      table: { category: "Styling" },
    },
  },
  args: { children: "⌘" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single key pill. */
export const Default: Story = {
  render: (args) => (
    <div className="p-4 flex items-center justify-center">
      <Kbd {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("⌘")).toBeInTheDocument();
  },
};

/** Multi-key group using `KbdGroup` — each key in its own pill. */
export const MultiKey: Story = {
  render: () => (
    <div className="p-4 flex items-center gap-2">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("⌘")).toBeInTheDocument();
    expect(canvas.getByText("Shift")).toBeInTheDocument();
    expect(canvas.getByText("P")).toBeInTheDocument();
  },
};

/**
 * `KbdShortcut` — macOS variant.
 * `meta` prepends ⌘; each key in its own pill with + separator.
 */
export const ShortcutMac: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4 items-start">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-40">Open palette</span>
        <KbdShortcut keys={["K"]} meta os="mac" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-40">Save</span>
        <KbdShortcut keys={["S"]} meta os="mac" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-40">Select all</span>
        <KbdShortcut keys={["A"]} meta os="mac" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-40">
          Find & replace
        </span>
        <KbdShortcut keys={["Shift", "H"]} meta os="mac" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`os="mac"` → ⌘ modifier. Multi-key: each token in its own pill with + separator.',
      },
    },
  },
};

/**
 * `KbdShortcut` — Windows/Linux variant.
 * Same `meta` flag, different modifier text.
 */
export const ShortcutWindows: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4 items-start">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-40">Open palette</span>
        <KbdShortcut keys={["K"]} meta os="windows" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-40">Save</span>
        <KbdShortcut keys={["S"]} meta os="windows" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-40">Select all</span>
        <KbdShortcut keys={["A"]} meta os="windows" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-40">
          Find & replace
        </span>
        <KbdShortcut keys={["Shift", "H"]} meta os="windows" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: { story: '`os="windows"` → Ctrl modifier instead of ⌘.' },
    },
  },
};

/**
 * Shortcut reference list using `KbdShortcut`.
 * Previously used raw `KbdGroup` — now uses the semantic component.
 */
export const ShortcutList: Story = {
  render: () => (
    <div className="p-6 w-[600px] space-y-2.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Keyboard Shortcuts
      </p>
      <div className="flex gap-10 ">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Mac ShortCuts
          </p>
          {[
            { label: "Open command palette", keys: ["K"], meta: true },
            { label: "Save document", keys: ["S"], meta: true },
            { label: "Undo", keys: ["Z"], meta: true },
            { label: "Redo", keys: ["Shift", "Z"], meta: true },
            { label: "Find", keys: ["F"], meta: true },
            { label: "Select all", keys: ["A"], meta: true },
            { label: "Close dialog", keys: ["Escape"], meta: false },
          ].map(({ label, keys, meta }) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm py-1"
            >
              <span className="text-muted-foreground">{label}</span>
              <KbdShortcut keys={keys} meta={meta} os="mac" />
            </div>
          ))}
        </div>
        <div>
          <p className=" text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Windows Shortcut
          </p>
          <div>
            {[
              { label: "Open command palette", keys: ["K"], meta: true },
              { label: "Save document", keys: ["S"], meta: true },
              { label: "Undo", keys: ["Z"], meta: true },
              { label: "Redo", keys: ["Shift", "Z"], meta: true },
              { label: "Find", keys: ["F"], meta: true },
              { label: "Select all", keys: ["A"], meta: true },
              { label: "Close dialog", keys: ["Escape"], meta: false },
            ].map(({ label, keys, meta }) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="text-muted-foreground">{label}</span>
                <KbdShortcut keys={keys} meta={meta} os="mac" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Reference table using `KbdShortcut`. Each row auto-composes modifier + key pills.",
      },
    },
  },
};

/** Common standalone key badges. */
export const CommonKeys: Story = {
  render: () => (
    <div className="p-6 flex flex-wrap gap-2">
      {[
        "⌘",
        "⌥",
        "⇧",
        "Ctrl",
        "Alt",
        "Tab",
        "Enter",
        "Esc",
        "Delete",
        "↑",
        "↓",
        "←",
        "→",
      ].map((k) => (
        <Kbd key={k}>{k}</Kbd>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All common key labels rendered as individual `Kbd` pills.",
      },
    },
  },
};
