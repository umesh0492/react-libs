import * as React from "react"

import { cn } from "../../../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Phase 5 fix: line separator between header and body (border-b) instead of dot
    className={cn("flex flex-col space-y-1 p-5 border-b border-border/60", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props} />
))
CardContent.displayName = "CardContent"

// CardSeparator — explicit horizontal divider inside a card body
const CardSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-0 h-px bg-border/60", className)}
    role="separator"
    {...props}
  />
))
CardSeparator.displayName = "CardSeparator"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Phase 5 fix: line separator above footer via border-t
    className={cn("flex items-center p-5 border-t border-border/60", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export interface StandardCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
  headerActions?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  actions?: React.ReactNode
  contentClassName?: string
  footerClassName?: string
}

const StandardCard = React.forwardRef<HTMLDivElement, StandardCardProps>(
  (
    {
      className,
      title,
      description,
      badge,
      headerActions,
      children,
      footer,
      actions,
      contentClassName,
      footerClassName,
      ...props
    },
    ref
  ) => (
    <Card ref={ref} className={className} {...props}>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            {badge}
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {headerActions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {headerActions}
          </div>
        )}
      </CardHeader>

      <CardContent className={contentClassName}>{children}</CardContent>

      {(footer || actions) && (
        <CardFooter
          className={cn(
            "justify-between gap-3 flex-col sm:flex-row sm:items-center",
            footerClassName
          )}
        >
          {footer ? (
            <div className="min-w-0 flex-1 text-sm text-muted-foreground">
              {footer}
            </div>
          ) : (
            <div />
          )}
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
)
StandardCard.displayName = "StandardCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardSeparator,
  StandardCard,
}
