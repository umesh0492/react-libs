import * as React from "react";
import { CheckCircle2, AlertCircle, Clock, Info, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id?: string;
  title: string;
  description?: React.ReactNode;
  timestamp?: string;
  status?: "default" | "success" | "warning" | "destructive" | "info";
  icon?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
}

function renderTimelineIcon(item: TimelineItem, status: string) {
  if (item.icon) {
    return item.icon;
  }
  if (status === "success") {
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  }
  if (status === "warning" || status === "destructive") {
    return <AlertCircle className="h-3.5 w-3.5" />;
  }
  if (status === "info") {
    return <Info className="h-3.5 w-3.5" />;
  }
  return <Circle className="h-2 w-2 fill-current" />;
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="feed"
        aria-label="Activity timeline"
        className={cn("relative space-y-6 pl-6", className)}
        {...props}
      >
        {/* Continuous connector track */}
        <div className="absolute left-2.5 top-3 bottom-3 w-[2px] -translate-x-1/2 bg-border" />

        {items.map((item, index) => {
          const status = item.status || "default";

          return (
            <div
              key={item.id || index}
              className="relative flex items-start group"
            >
              {/* Status Marker Icon */}
              <div
                className={cn(
                  "absolute -left-6 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background border ring-4 ring-background z-10",
                  status === "default" && "border-border text-muted-foreground",
                  status === "success" && "border-emerald-500 text-emerald-500",
                  status === "warning" && "border-amber-500 text-amber-500",
                  status === "destructive" && "border-destructive text-destructive",
                  status === "info" && "border-blue-500 text-blue-500"
                )}
              >
                {renderTimelineIcon(item, status)}
              </div>

              {/* Event Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-foreground leading-tight">
                    {item.title}
                  </h4>
                  {item.timestamp && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </span>
                  )}
                </div>

                {item.description && (
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";
