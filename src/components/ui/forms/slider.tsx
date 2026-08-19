import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../../../lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  thumbLabels?: string[];
  getThumbAriaLabel?: (index: number) => string;
};

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      value,
      defaultValue,
      thumbLabels,
      getThumbAriaLabel,
      ...props
    },
    ref,
  ) => {
    // Derive thumb count from controlled value or uncontrolled defaultValue.
    // Falls back to 1 thumb for a standard single-value slider.
    const thumbCount = (value ?? defaultValue ?? [0]).length;

    const thumbClass = cn(
      "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow",
      "transition-all duration-150",
      "hover:border-primary hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]",
      "active:scale-95",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "cursor-grab active:cursor-grabbing",
    );

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          )}
        >
          <SliderPrimitive.Range
            className={cn(
              "absolute h-full bg-primary transition-all duration-150",
              "data-[orientation=vertical]:w-full",
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }).map((_, i) => {
          const ariaLabel =
            getThumbAriaLabel?.(i) ??
            // eslint-disable-next-line security/detect-object-injection
            thumbLabels?.[i] ??
            (thumbCount === 1 ? "Slider value" : `Slider value ${i + 1}`);

          return (
            <SliderPrimitive.Thumb
              key={i}
              className={thumbClass}
              aria-label={ariaLabel}
            />
          );
        })}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
