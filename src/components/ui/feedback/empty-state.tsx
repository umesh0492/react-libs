import type { ReactNode } from "react";
import { FolderSearch } from "lucide-react";
import { Button } from "../forms/button";
import { cn } from "../../../lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  /** When false, removes the dashed border (e.g. when embedded inside a card) */
  bordered?: boolean;
  className?: string;
}

/**
 * EmptyState — shown when a list or page has no content.
 *
 * Phase 4 fixes:
 * - Removed hardcoded `bg-slate-50/50`, `border-slate-200`, `text-slate-900` — uses tokens
 * - `bordered` prop controls dashed border (default: true)
 * - CTA gets an optional `actionIcon` (e.g. `<Plus />`)
 * - Title uses `font-semibold` (not bold) for hierarchy consistency
 * - Description uses `text-muted-foreground`
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  bordered = true,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl",
        bordered && "border-2 border-dashed border-border/60 bg-muted/20",
        className
      )}
    >
      {/* Icon container */}
      <div className="w-14 h-14 bg-card border border-border/60 shadow-sm text-muted-foreground rounded-full flex items-center justify-center mb-5">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>

      {/* CTA */}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="default"
          size="default"
          className="min-w-[140px]"
        >
          {actionIcon && <span className="mr-1.5 -ml-0.5">{actionIcon}</span>}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
