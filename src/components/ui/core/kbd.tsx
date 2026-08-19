import * as React from "react"
import { cn } from "../../../lib/utils"

/**
 * Kbd — A single keyboard key pill.
 *
 * @example
 * <Kbd>⌘</Kbd>  →  renders a single ⌘ key badge
 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // Base: muted pill
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5",
        "select-none items-center justify-center gap-1 rounded-sm px-1.5",
        "font-sans text-xs font-medium leading-none",
        "[&_svg:not([class*='size-'])]:size-3",
        // Inside tooltips: invert colours
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background",
        "dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

/**
 * KbdGroup — Wraps multiple Kbd pills and a + separator into one row.
 *
 * @example
 * <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
 */
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

/** Detect macOS at runtime (SSR-safe). */
function isMac(): boolean {
  if (typeof window === "undefined") return false
  return (
    /Mac|iPhone|iPad|iPod/.test(navigator.platform) ||
    /Mac/.test(navigator.userAgent)
  )
}

interface KbdShortcutProps {
  /**
   * The key(s) to display, e.g. `["K"]` or `["Shift", "P"]`.
   * Each key renders as its own pill.
   */
  keys: string[]
  /**
   * When true, prepends the platform modifier:
   *   - macOS  → ⌘
   *   - Windows / Linux → Ctrl
   */
  meta?: boolean
  /**
   * Explicit OS override. Auto-detected from `navigator.platform` when omitted.
   */
  os?: "mac" | "windows" | "linux"
  className?: string
}

/**
 * KbdShortcut — OS-aware keyboard shortcut renderer.
 * Every key gets its own <Kbd> pill, separated by a `+` glyph.
 *
 * @example
 * // Renders [⌘] + [K] on mac  /  [Ctrl] + [K] on windows
 * <KbdShortcut keys={["K"]} meta />
 *
 * @example
 * // Explicit OS
 * <KbdShortcut keys={["Shift", "P"]} meta os="windows" />
 */
function KbdShortcut({ keys, meta = false, os, className }: KbdShortcutProps) {
  const resolvedOs = os ?? (isMac() ? "mac" : "windows")
  const isMacOs = resolvedOs === "mac"

  const allKeys: string[] = [
    ...(meta ? [isMacOs ? "⌘" : "Ctrl"] : []),
    ...keys,
  ]

  return (
    <span
      data-slot="kbd-shortcut"
      className={cn("inline-flex items-center gap-1 font-sans", className)}
    >
      {allKeys.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span
              aria-hidden="true"
              className="text-muted-foreground text-[10px] select-none leading-none"
            >
              +
            </span>
          )}
          <Kbd>{key}</Kbd>
        </React.Fragment>
      ))}
    </span>
  )
}

export { Kbd, KbdGroup, KbdShortcut }
