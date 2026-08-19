import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "../../../lib/utils";

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, style, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 shrink-0 rounded-full border border-primary text-primary ring-offset-background",
        "transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "flex items-center justify-center",
        className,
      )}
      style={{ minHeight: "1rem", minWidth: "1rem", ...style }}
      {...props}
    >
      {/*
        forceMount keeps Indicator in the DOM at all times.
        The scale + opacity transition is applied TO THE INDICATOR ITSELF —
        Radix sets data-state on the Indicator element, not on its SVG child.
        Putting data-[state=checked] on a child SVG has no effect.
      */}
      <RadioGroupPrimitive.Indicator
        forceMount
        className={cn(
          "flex items-center justify-center",
          "transition-all duration-150",
          "scale-0 opacity-0",
          "data-[state=checked]:scale-100 data-[state=checked]:opacity-100",
        )}
      >
        <Circle className="h-2.5 w-2.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
