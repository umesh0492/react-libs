"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../../lib/utils"

// ── Keyframes injection (shared with accordion) ───────────────────────────────
const COLLAPSIBLE_STYLE_ID = "collapsible-animations"
if (typeof document !== "undefined" && !document.getElementById(COLLAPSIBLE_STYLE_ID)) {
  const style = document.createElement("style")
  style.id = COLLAPSIBLE_STYLE_ID
  style.textContent = `
    @keyframes collapsible-down {
      from { height: 0; opacity: 0 }
      to   { height: var(--radix-collapsible-content-height); opacity: 1 }
    }
    @keyframes collapsible-up {
      from { height: var(--radix-collapsible-content-height); opacity: 1 }
      to   { height: 0; opacity: 0 }
    }
    [data-radix-collapsible-content][data-state=open]   {
      animation: collapsible-down 0.2s ease-out;
    }
    [data-radix-collapsible-content][data-state=closed] {
      animation: collapsible-up 0.2s ease-out;
    }
  `
  document.head.appendChild(style)
}

// ── Primitive re-exports (unchanged) ─────────────────────────────────────────
const Collapsible = CollapsiblePrimitive.Root
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

// ── Styled card collapsible  ──────────────────────────────────────────────────

/**
 * CollapsibleCard — A bordered, rounded card that reveals content on click.
 * Used for expandable sections like "Advanced filters", "Technical details", etc.
 */
function CollapsibleCard({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      className={cn("rounded-lg border border-border/70 bg-card overflow-hidden", className)}
      {...props}
    />
  )
}

/**
 * CollapsibleCardTrigger — Styled trigger row with hover highlight and an
 * auto-rotating chevron. Always expands downward.
 */
function CollapsibleCardTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        "flex w-full items-center justify-between px-4 py-3",
        "text-sm font-medium text-left",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "transition-colors duration-150",
        // Chevron rotates when open
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </CollapsiblePrimitive.Trigger>
  )
}

/**
 * CollapsibleCardContent — Animated content area with a top divider.
 */
function CollapsibleCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      className={cn("overflow-hidden border-t border-border/60 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleCard,
  CollapsibleCardTrigger,
  CollapsibleCardContent,
}
