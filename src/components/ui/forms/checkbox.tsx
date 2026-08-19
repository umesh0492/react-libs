import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "../../../lib/utils"

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, style, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
      // Smooth bg colour transition on check/uncheck
      "transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      // Checked & indeterminate both fill with primary colour
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
      "inline-flex items-center justify-center",
      className
    )}
    style={{ minHeight: "1rem", minWidth: "1rem", ...style }}
    {...props}
  >
    {/*
      forceMount keeps the Indicator in the DOM so we can animate via
      opacity instead of abrupt mount/unmount. Radix sets data-state on
      the Indicator element itself, so the selectors work correctly here.

      The icon inside is chosen via data-state attribute on the Indicator
      using a CSS trick — both icons always render but only one is visible.
      We avoid reading props.checked (which is undefined in uncontrolled
      stories) by letting Radix's data-state drive visibility.
    */}
    <CheckboxPrimitive.Indicator
      forceMount
      className={cn(
        "flex items-center justify-center text-current",
        "transition-opacity duration-150",
        "opacity-0 data-[state=checked]:opacity-100 data-[state=indeterminate]:opacity-100"
      )}
    >
      {/* Check shown for checked state */}
      <Check
        className="h-3 w-3 data-[state=indeterminate]:hidden"
        strokeWidth={3}
      />
      {/* Minus shown for indeterminate state — hidden by default */}
      <Minus
        className="hidden h-3 w-3 data-[state=indeterminate]:block"
        strokeWidth={3}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
