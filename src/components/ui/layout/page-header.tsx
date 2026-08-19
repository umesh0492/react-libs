import * as React from "react"
import { cn } from "../../../lib/utils"

export interface PageHeaderProps {
  title: string
  description?: string
  /** Slot for breadcrumbs or back button */
  breadcrumbs?: React.ReactNode
  /** Action buttons rendered on the right */
  actions?: React.ReactNode
  className?: string
  /** Optional badge/status next to title */
  badge?: React.ReactNode
}

/**
 * PageHeader — standard top-of-page layout used on every page.
 *
 * Usage:
 * ```tsx
 * <PageHeader
 *   title="Purchase Orders"
 *   description="Manage and track all purchase orders"
 *   actions={<Button>Create PO</Button>}
 *   breadcrumbs={<Breadcrumb>...</Breadcrumb>}
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 pb-4", className)}>
      {breadcrumbs && (
        <div className="mb-1 text-sm text-muted-foreground">{breadcrumbs}</div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * PageHeaderSkeleton — loading placeholder matching PageHeader dimensions.
 */
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-1 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-7 w-48 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-72 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  )
}
