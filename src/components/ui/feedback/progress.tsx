"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"

// Inject shimmer keyframe once
const SHIMMER_STYLE_ID = "progress-shimmer"
if (typeof document !== "undefined" && !document.getElementById(SHIMMER_STYLE_ID)) {
  const style = document.createElement("style")
  style.id = SHIMMER_STYLE_ID
  // eslint-disable-next-line design-tokens/no-hardcoded-colors
  style.textContent = `
    @keyframes progress-shimmer {
      0%   { transform: translateX(-100%) skewX(-15deg); }
      100% { transform: translateX(200%)  skewX(-15deg); }
    }
    .progress-shimmer::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255,255,255,0.25) 50%,
        transparent 100%
      );
      animation: progress-shimmer 1.6s ease-in-out infinite;
    }
  `
  document.head.appendChild(style)
}

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        success: "bg-emerald-200 dark:bg-emerald-900/40",
        warning: "bg-amber-200  dark:bg-amber-900/40",
        danger:  "bg-red-200    dark:bg-red-900/40",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-emerald-500 dark:bg-emerald-400",
        warning: "bg-amber-500  dark:bg-amber-400",
        danger:  "bg-red-500    dark:bg-red-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  /** Show a shimmer animation over the progress bar */
  shimmer?: boolean
  /** Show a percentage label to the right of the bar */
  showLabel?: boolean
}

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, shimmer = false, showLabel = false, ...props }, ref) => (
  <div className={cn("flex items-center gap-2", showLabel && "gap-3")}>
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant }), "flex-1", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          indicatorVariants({ variant }),
          shimmer && "progress-shimmer relative"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    {showLabel && (
      <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {Math.round(value || 0)}%
      </span>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
