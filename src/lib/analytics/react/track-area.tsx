import * as React from "react";

export interface TrackAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  journey?: string;
  step?: string;
  metadata?: Record<string, unknown>;
  children: React.ReactNode;
}

export const TrackArea = React.forwardRef<HTMLDivElement, TrackAreaProps>(
  ({ journey, step, metadata, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-track-area=""
        data-track-area-journey={journey}
        data-track-area-step={step}
        data-track-area-metadata={metadata ? JSON.stringify(metadata) : undefined}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TrackArea.displayName = "TrackArea";
