import * as React from "react";
import { FolderSearch } from "lucide-react";
import { Button } from "../forms/button";
import { cn } from "../../../lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: React.ReactNode;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  bordered?: boolean;
  className?: string;
}

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
  const renderIcon = () => {
    if (!icon) return <FolderSearch className="w-8 h-8 text-muted-foreground/60" />;
    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-8 h-8 text-muted-foreground/60" />;
    }
    return icon;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl",
        bordered && "border-2 border-dashed border-border/60 bg-muted/20",
        className
      )}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4 text-muted-foreground">
        {renderIcon()}
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>

      {description ? (
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      ) : null}

      {actionLabel && onAction && (
        <Button onClick={onAction} className="gap-2">
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
