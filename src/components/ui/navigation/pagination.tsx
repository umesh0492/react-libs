import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "../../../lib/utils"
import { ButtonProps, buttonVariants } from "../forms/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

export type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  (
    | ({ href: string } & React.ComponentProps<"a">)
    | ({ href?: undefined } & React.ComponentProps<"button">)
  )

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => {
  const commonClasses = cn(
    buttonVariants({
      variant: isActive ? "outline" : "ghost",
      size,
    }),
    isActive
      ? "border-emerald-600 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500"
      : "",
    className
  )

  if ("href" in props && props.href !== undefined) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        aria-current={isActive ? "page" : undefined}
        className={commonClasses}
        {...(props as React.ComponentProps<"a">)}
      />
    )
  }

  const { type = "button", ...buttonProps } = props as React.ComponentProps<"button">
  return (
    <button
      type={type}
      aria-current={isActive ? "page" : undefined}
      className={commonClasses}
      {...buttonProps}
    />
  )
}
PaginationLink.displayName = "PaginationLink"

export type PaginationPreviousProps = {
  showText?: boolean
} & PaginationLinkProps

const PaginationPrevious = ({
  className,
  showText = true,
  ...props
}: PaginationPreviousProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size={showText ? "default" : "icon"}
    className={cn(showText ? "gap-1 pl-2.5" : "", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    {showText && <span>Previous</span>}
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

export type PaginationNextProps = {
  showText?: boolean
} & PaginationLinkProps

const PaginationNext = ({
  className,
  showText = true,
  ...props
}: PaginationNextProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size={showText ? "default" : "icon"}
    className={cn(showText ? "gap-1 pr-2.5" : "", className)}
    {...props}
  >
    {showText && <span>Next</span>}
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
  showText?: boolean
}

export type StandalonePaginationProps = DataTablePaginationProps

export function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  showText = true,
}: DataTablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('ellipsis')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className={cn("flex items-center justify-between px-4 py-3 bg-card text-card-foreground border-t border-border", !showText && "sm:justify-center")}>
      {showText && (
        <div className="hidden sm:flex flex-1 text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground mx-1">{totalItems === 0 ? 0 : startItem}</span> to <span className="font-medium text-foreground mx-1">{endItem}</span> of <span className="font-medium text-foreground mx-1">{totalItems}</span> results
        </div>
      )}
      <div className="flex items-center justify-between sm:justify-end flex-1 sm:flex-none">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={currentPage <= 1}
                onClick={() => {
                  if (currentPage > 1) onPageChange(currentPage - 1)
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                showText={showText}
              />
            </PaginationItem>

            {getPageNumbers().map((page, i) => (
              <PaginationItem key={page === 'ellipsis' ? `ellipsis-${i}` : `page-${page}`} className="hidden md:flex">
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => {
                      onPageChange(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() => {
                  if (currentPage < totalPages) onPageChange(currentPage + 1)
                }}
                className={currentPage >= totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                showText={showText}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
