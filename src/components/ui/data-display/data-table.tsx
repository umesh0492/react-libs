import * as React from "react"
import {ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import { Skeleton } from "../feedback/skeleton"
import { cn } from "../../../lib/utils"

export type SortDirection = "asc" | "desc" | null

export interface DataTableColumn<T> {
  key: string
  header: string
  /** Render a custom cell for this column */
  cell?: (row: T, index: number) => React.ReactNode
  /** If true, column header is clickable for sorting */
  sortable?: boolean
  className?: string
  headerClassName?: string
}

export interface DataTablePaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  /** Row key extractor — defaults to index if not provided */
  rowKey?: (row: T, index: number) => string | number
  isLoading?: boolean
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  /** Number of skeleton rows to show while loading */
  skeletonRows?: number
  pagination?: DataTablePaginationProps
  /** Current sort state */
  sortKey?: string
  sortDirection?: SortDirection
  onSort?: (key: string, direction: SortDirection) => void
  className?: string
  /** Highlight rows on hover (default: true) */
  hoverable?: boolean
  /** Callback when a row is clicked */
  onRowClick?: (row: T) => void
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active || !direction) return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />
  return direction === "asc"
    ? <ChevronUp className="ml-1 h-3.5 w-3.5 text-primary" />
    : <ChevronDown className="ml-1 h-3.5 w-3.5 text-primary" />
}

/**
 * DataTable — generic sortable table with loading skeletons, empty states, and pagination.
 *
 * Usage:
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: "id", header: "PO #", sortable: true },
 *     { key: "partner", header: "Partner", cell: (row) => row.partner.name },
 *     { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
 *   ]}
 *   data={orders}
 *   isLoading={isLoading}
 *   sortKey={sortKey}
 *   sortDirection={sortDir}
 *   onSort={handleSort}
 *   pagination={{ page, pageSize: 20, total, onPageChange: setPage }}
 * />
 * ```
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyMessage = "No results found.",
  emptyIcon,
  skeletonRows = 8,
  pagination,
  sortKey,
  sortDirection,
  onSort,
  className,
  hoverable = true,
  onRowClick,
}: DataTableProps<T>) {
  function handleSort(key: string) {
    if (!onSort) return
    if (sortKey !== key) {
      onSort(key, "asc")
    } else if (sortDirection === "asc") {
      onSort(key, "desc")
    } else {
      onSort(key, null)
    }
  }

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.headerClassName,
                    col.sortable && onSort && "cursor-pointer select-none"
                  )}
                  onClick={col.sortable && onSort ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center">
                    {col.header}
                    {col.sortable && onSort && (
                      <SortIcon
                        active={sortKey === col.key}
                        direction={sortKey === col.key ? (sortDirection ?? null) : null}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!isLoading && data.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                    {emptyIcon ?? (
                      <svg
                        className="h-10 w-10 opacity-30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 10h18M3 14h18M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
                        />
                      </svg>
                    )}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              data.length > 0 &&
              data.map((row, i) => (
                <TableRow
                  key={rowKey ? rowKey(row, i) : i}
                  className={cn(
                    hoverable && "cursor-default",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  data-state={undefined}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell
                        ? col.cell(row, i)
                        : (row[col.key] as React.ReactNode) ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination — always single-row ─────────────────────────────── */}
      {pagination && totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between gap-2 text-sm text-muted-foreground">
          {/* Left: record count */}
          <span className="shrink-0 tabular-nums">
            {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            <span className="hidden sm:inline">of {pagination.total}</span>
          </span>

          {/* Center / Right: prev · page numbers · next */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              aria-label="Previous page"
              className="rounded px-2 py-1 text-xs font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-40 h-8"
            >
              ←
            </button>

            {/* Page number window — max 5 visible, with leading/trailing ellipsis */}
            {(() => {
              const window = 5
              const half = Math.floor(window / 2)
              let start = Math.max(1, pagination.page - half)
              const end = Math.min(totalPages, start + window - 1)
              if (end - start < window - 1) start = Math.max(1, end - window + 1)

              const pages: (number | "…")[] = []
              if (start > 1) { pages.push(1); if (start > 2) pages.push("…") }
              for (let p = start; p <= end; p++) pages.push(p)
              if (end < totalPages) {
                if (end < totalPages - 1) {
                  pages.push("…");
                }
                pages.push(totalPages);
              }

              return pages.map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs select-none">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => pagination.onPageChange(p as number)}
                    aria-label={`Page ${p}`}
                    aria-current={p === pagination.page ? "page" : undefined}
                    className={cn(
                      "rounded px-2.5 py-1 text-xs font-medium h-8 min-w-[32px]",
                      p === pagination.page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                )
              )
            })()}

            {/* Next */}
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              aria-label="Next page"
              className="rounded px-2 py-1 text-xs font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-40 h-8"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

