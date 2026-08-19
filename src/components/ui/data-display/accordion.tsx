import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "../../../lib/utils"

// Inject accordion animation keyframes
const RADIX_STYLE_ID = "radix-ui-animations"
if (typeof document !== "undefined" && !document.getElementById(RADIX_STYLE_ID)) {
  const style = document.createElement("style")
  style.id = RADIX_STYLE_ID
  style.textContent = `
    @keyframes accordion-down { from { height: 0 } to { height: var(--radix-accordion-content-height) } }
    @keyframes accordion-up   { from { height: var(--radix-accordion-content-height) } to { height: 0 } }
    [data-radix-accordion-content][data-state=open]   { animation: accordion-down 0.2s ease-out }
    [data-radix-accordion-content][data-state=closed]  { animation: accordion-up 0.2s ease-out }
  `
  document.head.appendChild(style)
}

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    // Soft border using opacity-muted value; remove on last child via parent context
    className={cn("border-b border-border/70 last:border-b-0", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Layout
        "flex flex-1 items-center justify-between py-4 text-sm font-medium text-left",
        // Hover: background highlight instead of underline (more convention-friendly)
        "rounded-sm transition-colors duration-150",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        // Chevron rotates 180° when open
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm text-muted-foreground"
    {...props}
  >
    <div className={cn("pb-4 pt-0 leading-relaxed", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
