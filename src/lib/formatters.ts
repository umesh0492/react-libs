/**
 * @umesh0492/react-libs — Shared Formatters
 *
 * Consistent formatting utilities for currency, dates, weights, sizes, and times.
 * Use these instead of inline `toLocaleString` or manual format strings.
 */

export type NumericValue = number | string | null | undefined;
export type DateValue = Date | string | null | undefined;
export type AppLocale = "en" | "hi" | string;

// ─── Currency ────────────────────────────────────────────────────────────────

/**
 * Format a number as Indian Rupee currency.
 * @example formatCurrency(123456.78) → "₹1,23,456.78"
 */
export function formatCurrency(
  amount: NumericValue,
  currency = "INR",
  locale = "en-IN"
): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount
  if (value == null || isNaN(value)) return "—"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format a number with locale-aware grouping (no currency symbol).
 * @example formatNumber(1234567) → "12,34,567"
 */
export function formatNumber(
  value: NumericValue,
  options?: Intl.NumberFormatOptions,
  locale = "en-IN"
): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (num == null || isNaN(num)) return "—"
  return new Intl.NumberFormat(locale, options).format(num)
}

// ─── Dates ───────────────────────────────────────────────────────────────────

/**
 * Format a date as "DD MMM YYYY" (e.g. "27 Mar 2026").
 */
export function formatDate(
  date: DateValue,
  options?: Intl.DateTimeFormatOptions,
  locale = "en-IN"
): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  if (!d || typeof d.getTime !== 'function' || isNaN(d.getTime())) return "—"
  return d.toLocaleDateString(locale, options ?? {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/**
 * Format a date as "DD MMM YYYY, HH:MM" (e.g. "27 Mar 2026, 14:32").
 */
export function formatDateTime(
  date: DateValue,
  locale = "en-IN"
): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  if (!d || typeof d.getTime !== 'function' || isNaN(d.getTime())) return "—"
  return d.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

/**
 * Format a date relative to now (e.g. "2 hours ago", "in 3 days").
 * Falls back to formatDate if more than 7 days away.
 */
export function formatRelativeTime(
  date: DateValue
): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  if (!d || typeof d.getTime !== 'function' || isNaN(d.getTime())) return "—"

  const diffMs = d.getTime() - Date.now()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHr = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHr / 24)

  if (Math.abs(diffSec) < 60) return "just now"
  if (Math.abs(diffMin) < 60)
    return diffMin > 0 ? `in ${diffMin}m` : `${Math.abs(diffMin)}m ago`
  if (Math.abs(diffHr) < 24)
    return diffHr > 0 ? `in ${diffHr}h` : `${Math.abs(diffHr)}h ago`
  if (Math.abs(diffDay) <= 7)
    return diffDay > 0 ? `in ${diffDay}d` : `${Math.abs(diffDay)}d ago`

  return formatDate(d)
}

// ─── Weight / Units ───────────────────────────────────────────────────────────

/**
 * Format a weight value with unit.
 * @example formatWeight(12.5) → "12.5 kg"
 * @example formatWeight(1200, "g") → "1,200 g"
 */
export function formatWeight(
  value: NumericValue,
  unit: "kg" | "g" | "mt" | "lb" = "kg",
  locale = "en-IN"
): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (num == null || isNaN(num)) return "—"
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(num)
  return `${formatted} ${unit}`
}

/**
 * Format a quantity with optional unit.
 * @example formatQuantity(150, "boxes") → "150 boxes"
 */
export function formatQuantity(
  value: NumericValue,
  unit?: string,
  locale = "en-IN"
): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (num == null || isNaN(num)) return "—"
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
  return unit ? `${formatted} ${unit}` : formatted
}

// ─── File Size ────────────────────────────────────────────────────────────────

/**
 * Format a byte count as a human-readable file size.
 * @example formatFileSize(1234567) → "1.2 MB"
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || isNaN(bytes)) return "—"
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const val = bytes / Math.pow(1024, i)
  return `${val.toFixed(i > 0 ? 1 : 0)} ${units[Math.min(i, units.length - 1)]}`
}

// ─── Percentage ───────────────────────────────────────────────────────────────

/**
 * Format a ratio (0–1) or percentage (0–100) as a percentage string.
 * @example formatPercent(0.856) → "85.6%"
 * @example formatPercent(85.6, false) → "85.6%"
 */
export function formatPercent(
  value: number | null | undefined,
  isRatio = true,
  decimals = 1
): string {
  if (value == null || isNaN(value)) return "—"
  const pct = isRatio ? value * 100 : value
  return `${pct.toFixed(decimals)}%`
}

// ─── Localized Formatters (i18n-aware) ───────────────────────────────────────

/**
 * Format a date with locale awareness (en-IN default, hi-IN for Hindi).
 * @example formatLocalizedDate("2026-03-27", "hi") → "२७ मार्च २०२६"
 */
export function formatLocalizedDate(
  date: DateValue,
  locale: AppLocale = "en"
): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  if (!d || typeof d.getTime !== 'function' || isNaN(d.getTime())) return date?.toString?.() ?? ""
  return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d)
}

/**
 * Format a date+time with locale awareness.
 */
export function formatLocalizedDateTime(
  date: DateValue,
  locale: AppLocale = "en"
): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  if (!d || typeof d.getTime !== 'function' || isNaN(d.getTime())) return date?.toString?.() ?? ""
  return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d)
}

/**
 * Format a number with locale-aware grouping (supports Hindi numerals).
 * @example formatLocalizedNumber(1234.5, "hi") → "१,२३४.५"
 */
export function formatLocalizedNumber(
  value: number | null | undefined,
  locale: AppLocale = "en"
): string {
  if (value == null || isNaN(value)) return ""
  return new Intl.NumberFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    maximumFractionDigits: 2,
  }).format(value)
}

