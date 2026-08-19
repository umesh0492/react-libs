"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"

// ── Size CVA ──────────────────────────────────────────────────────────────────
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-base",
        xl: "h-20 w-20 text-lg",
      },
    },
    defaultVariants: { size: "default" },
  }
)

// ── Avatar root ────────────────────────────────────────────────────────────────
const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

// ── AvatarImage ───────────────────────────────────────────────────────────────
const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// ── AvatarFallback ────────────────────────────────────────────────────────────
// Font-size inherits from the Avatar root's size token (text-xs → text-lg)
const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "bg-muted font-medium text-muted-foreground select-none",
      // Inherit font-size from parent Avatar size token
      "text-[1em]",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// ── AvatarGroup ───────────────────────────────────────────────────────────────
/**
 * AvatarGroup — Stacks multiple Avatar components with a ring gap so the
 * borders don't visually merge.
 *
 * @example
 * <AvatarGroup>
 *   <Avatar><AvatarImage src="..." /></Avatar>
 *   <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
 * </AvatarGroup>
 */
function AvatarGroup({
  className,
  max,
  children,
  ...props
}: React.ComponentProps<"div"> & { max?: number }) {
  const childArray = React.Children.toArray(children)
  const visible = max ? childArray.slice(0, max) : childArray
  const overflow = max ? childArray.length - max : 0

  return (
    <div
      className={cn("flex items-center -space-x-2.5 rtl:space-x-reverse", className)}
      {...props}
    >
      {visible.map((child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
              key: i,
              className: cn(
                (child as React.ReactElement<{ className?: string }>).props.className,
                // Ring creates a gap between overlapping avatars
                "ring-2 ring-background"
              ),
            })
          : child
      )}
      {overflow > 0 && (
        <div
          className={cn(
            avatarVariants({ size: "default" }),
            "ring-2 ring-background bg-muted text-muted-foreground",
            "flex items-center justify-center text-xs font-medium"
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants }
