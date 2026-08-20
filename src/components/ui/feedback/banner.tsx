import * as React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../forms/button";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "info" | "success" | "warning" | "destructive";
  icon?: React.ReactNode;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onClose?: () => void;
  sticky?: boolean;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = "info",
      icon,
      title,
      children,
      action,
      dismissible = false,
      onClose,
      sticky = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) return null;

    function getBannerIcon() {
      if (icon) return icon;
      switch (variant) {
        case "info":
          return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
        case "success":
          return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
        case "warning":
          return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
        case "destructive":
          return <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
        default:
          return <Info className="h-4 w-4" />;
      }
    }

    return (
      <aside
        ref={ref}
        role="region"
        aria-label={title || "Notification banner"}
        className={cn(
          "w-full px-4 py-3 border-b text-sm transition-all flex items-center justify-between gap-3",
          sticky && "sticky top-0 z-40 backdrop-blur-md",
          variant === "default" && "bg-muted/80 text-foreground border-border",
          variant === "info" && "bg-blue-50/90 text-blue-950 border-blue-200 dark:bg-blue-950/40 dark:text-blue-100 dark:border-blue-800",
          variant === "success" && "bg-emerald-50/90 text-emerald-950 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:border-emerald-800",
          variant === "warning" && "bg-amber-50/90 text-amber-950 border-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-800",
          variant === "destructive" && "bg-rose-50/90 text-rose-950 border-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:border-rose-800",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">{getBannerIcon()}</div>
          <div className="min-w-0 text-xs sm:text-sm">
            {title && <span className="font-semibold mr-1.5">{title}</span>}
            <span className="opacity-90">{children}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="h-7 text-xs bg-background/80 hover:bg-background"
            >
              {action.label}
            </Button>
          )}

          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>
    );
  }
);

Banner.displayName = "Banner";
