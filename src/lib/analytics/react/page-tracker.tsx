import * as React from "react";
import { useAnalytics } from "./provider";

export interface PageViewTrackerProps {
  pageTitle?: string;
  path?: string;
  metadata?: Record<string, unknown>;
}

export function PageViewTracker({
  pageTitle,
  path,
  metadata,
}: PageViewTrackerProps) {
  const { trackPageView } = useAnalytics();

  React.useEffect(() => {
    trackPageView(
      {
        title: pageTitle,
        path,
      },
      metadata
    );
  }, [pageTitle, path, metadata, trackPageView]);

  return null;
}
