import * as React from "react"
import { cn } from "../../../lib/utils"

/**
 * Skeleton — pulsing placeholder for loading states.
 *
 * Uses `bg-muted` by default. The pulse animation is handled
 * by Tailwind's `animate-pulse` which already uses CSS keyframes.
 *
 * Phase 4 fix: increased contrast slightly using `bg-muted` (was already correct)
 * and ensured `rounded-md` is always applied. Added `aria-hidden="true"` for screen readers.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-muted/80",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
