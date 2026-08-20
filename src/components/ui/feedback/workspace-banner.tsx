import * as React from "react";
import { cn } from "../../../lib/utils";

export interface WorkspaceBannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  gradientClassName?: string;
}

export function WorkspaceBanner({
  title,
  subtitle,
  icon: Icon,
  gradientClassName = "from-indigo-600 to-indigo-800",
  className,
  ...props
}: WorkspaceBannerProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-r px-5 py-4 text-white shadow-sm",
        gradientClassName,
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs">
            <Icon className="h-5 w-5 text-white" />
          </div>
        ) : null}
        <div className="space-y-0.5 min-w-0">
          <h2 className="text-lg font-semibold tracking-tight truncate">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-white/80 line-clamp-1">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
