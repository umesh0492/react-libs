import { cn } from "../../../lib/utils"

export type StatusValue =
  // Generic lifecycle
  | "pending"
  | "active"
  | "inactive"
  | "suspended"           // ← added: orange palette, distinct from inactive grey
  | "draft"
  | "completed"
  | "cancelled"
  | "rejected"
  | "approved"
  | "in_progress"
  | "overdue"
  | "on_hold"
  // Order / PO  
  | "confirmed"
  | "dispatched"
  | "delivered"
  | "partially_delivered"
  | "returned"
  // Payment / Finance
  | "paid"
  | "unpaid"
  | "overdue_payment"
  | "partially_paid"
  // GRN / Quality
  | "accepted"
  | "partially_accepted"
  | "grn_pending"
  // RFQ / Auction
  | "open"
  | "closed"
  | "awarded"
  | "expired"
  // Dispute
  | "under_review"
  | "resolved"
  | "escalated"
  // Document
  | "uploaded"
  | "verified"
  | "expired_doc"

const STATUS_CONFIG: Record<
  StatusValue,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  // ── Generic ───────────────────────────────────────────────────────────
  pending:             { label: "Pending",             dot: "bg-amber-400",   bg: "bg-amber-50  dark:bg-amber-950/30",  text: "text-amber-700  dark:text-amber-400",  border: "border-amber-200  dark:border-amber-800" },
  active:              { label: "Active",              dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  inactive:            { label: "Inactive",            dot: "bg-slate-400",   bg: "bg-slate-100  dark:bg-slate-800/50",  text: "text-slate-600  dark:text-slate-400",  border: "border-slate-200  dark:border-slate-700" },
  // Suspended: orange — account is blocked/frozen (not just idle like inactive)
  suspended:           { label: "Suspended",           dot: "bg-orange-500",  bg: "bg-orange-50  dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  draft:               { label: "Draft",               dot: "bg-slate-400",   bg: "bg-slate-100  dark:bg-slate-800/50",  text: "text-slate-600  dark:text-slate-400",  border: "border-slate-200  dark:border-slate-700" },
  completed:           { label: "Completed",           dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  cancelled:           { label: "Cancelled",           dot: "bg-red-400",     bg: "bg-red-50     dark:bg-red-950/30",    text: "text-red-700    dark:text-red-400",    border: "border-red-200    dark:border-red-800" },
  rejected:            { label: "Rejected",            dot: "bg-red-500",     bg: "bg-red-50     dark:bg-red-950/30",    text: "text-red-700    dark:text-red-400",    border: "border-red-200    dark:border-red-800" },
  approved:            { label: "Approved",            dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  in_progress:         { label: "In Progress",         dot: "bg-blue-500",    bg: "bg-blue-50    dark:bg-blue-950/30",   text: "text-blue-700   dark:text-blue-400",   border: "border-blue-200   dark:border-blue-800" },
  overdue:             { label: "Overdue",             dot: "bg-red-500",     bg: "bg-red-50     dark:bg-red-950/30",    text: "text-red-700    dark:text-red-400",    border: "border-red-200    dark:border-red-800" },
  on_hold:             { label: "On Hold",             dot: "bg-orange-400",  bg: "bg-orange-50  dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  // ── Order / PO ────────────────────────────────────────────────────────
  confirmed:           { label: "Confirmed",           dot: "bg-blue-500",    bg: "bg-blue-50    dark:bg-blue-950/30",   text: "text-blue-700   dark:text-blue-400",   border: "border-blue-200   dark:border-blue-800" },
  dispatched:          { label: "Dispatched",          dot: "bg-indigo-500",  bg: "bg-indigo-50  dark:bg-indigo-950/30", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800" },
  delivered:           { label: "Delivered",           dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  partially_delivered: { label: "Partial Delivery",   dot: "bg-amber-400",   bg: "bg-amber-50   dark:bg-amber-950/30",  text: "text-amber-700  dark:text-amber-400",  border: "border-amber-200  dark:border-amber-800" },
  returned:            { label: "Returned",            dot: "bg-orange-500",  bg: "bg-orange-50  dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  // ── Payment ───────────────────────────────────────────────────────────
  paid:                { label: "Paid",                dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  unpaid:              { label: "Unpaid",              dot: "bg-red-400",     bg: "bg-red-50     dark:bg-red-950/30",    text: "text-red-700    dark:text-red-400",    border: "border-red-200    dark:border-red-800" },
  overdue_payment:     { label: "Overdue",             dot: "bg-red-600",     bg: "bg-red-50     dark:bg-red-950/30",    text: "text-red-800    dark:text-red-300",    border: "border-red-300    dark:border-red-700" },
  partially_paid:      { label: "Partially Paid",      dot: "bg-amber-400",   bg: "bg-amber-50   dark:bg-amber-950/30",  text: "text-amber-700  dark:text-amber-400",  border: "border-amber-200  dark:border-amber-800" },
  // ── GRN ───────────────────────────────────────────────────────────────
  accepted:            { label: "Accepted",            dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  partially_accepted:  { label: "Partial Accept",     dot: "bg-amber-400",   bg: "bg-amber-50   dark:bg-amber-950/30",  text: "text-amber-700  dark:text-amber-400",  border: "border-amber-200  dark:border-amber-800" },
  grn_pending:         { label: "GRN Pending",         dot: "bg-amber-400",   bg: "bg-amber-50   dark:bg-amber-950/30",  text: "text-amber-700  dark:text-amber-400",  border: "border-amber-200  dark:border-amber-800" },
  // ── RFQ ───────────────────────────────────────────────────────────────
  open:                { label: "Open",                dot: "bg-blue-500",    bg: "bg-blue-50    dark:bg-blue-950/30",   text: "text-blue-700   dark:text-blue-400",   border: "border-blue-200   dark:border-blue-800" },
  closed:              { label: "Closed",              dot: "bg-slate-500",   bg: "bg-slate-100  dark:bg-slate-800/50",  text: "text-slate-600  dark:text-slate-400",  border: "border-slate-200  dark:border-slate-700" },
  awarded:             { label: "Awarded",             dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  expired:             { label: "Expired",             dot: "bg-slate-400",   bg: "bg-slate-100  dark:bg-slate-800/50",  text: "text-slate-600  dark:text-slate-400",  border: "border-slate-200  dark:border-slate-700" },
  // ── Dispute ───────────────────────────────────────────────────────────
  under_review:        { label: "Under Review",        dot: "bg-purple-500",  bg: "bg-purple-50  dark:bg-purple-950/30", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  resolved:            { label: "Resolved",            dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  escalated:           { label: "Escalated",           dot: "bg-red-600",     bg: "bg-red-50     dark:bg-red-950/30",    text: "text-red-800    dark:text-red-300",    border: "border-red-300    dark:border-red-700" },
  // ── Document ──────────────────────────────────────────────────────────
  uploaded:            { label: "Uploaded",            dot: "bg-blue-400",    bg: "bg-blue-50    dark:bg-blue-950/30",   text: "text-blue-700   dark:text-blue-400",   border: "border-blue-200   dark:border-blue-800" },
  verified:            { label: "Verified",            dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  expired_doc:         { label: "Expired",             dot: "bg-red-400",     bg: "bg-red-50     dark:bg-red-950/30",    text: "text-red-700    dark:text-red-400",    border: "border-red-200    dark:border-red-800" },
}

export interface StatusBadgeProps {
  status: StatusValue | string
  /** Override the display label */
  label?: string
  className?: string
  /** Show the color dot indicator (default: true) */
  showDot?: boolean
  size?: "sm" | "default"
}

/**
 * StatusBadge — platform-wide consistent status indicator.
 *
 * Usage:
 * ```tsx
 * <StatusBadge status="pending" />
 * <StatusBadge status="confirmed" label="PO Confirmed" />
 * <StatusBadge status="rejected" size="sm" />
 * ```
 */
export function StatusBadge({
  status,
  label,
  className,
  showDot = true,
  size = "default",
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as StatusValue]

  if (!config) {
    // Fallback for unknown statuses — render as grey with raw value
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 font-medium",
          size === "sm" ? "py-0.5 text-xs" : "py-1 text-xs",
          "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700",
          className
        )}
      >
        {showDot && <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />}
        {label ?? status}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 font-medium",
        size === "sm" ? "py-0.5 text-xs" : "py-1 text-xs",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      )}
      {label ?? config.label}
    </span>
  )
}
