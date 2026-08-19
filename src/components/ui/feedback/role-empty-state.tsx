import { useState, useEffect } from "react";
import { Search, BookOpen, PlayCircle, FileText as FileTextIcon, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../forms/button";
import { Skeleton } from "./skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../overlays/sheet";

export interface RoleEmptyStateProps {
  /** Main title text */
  title?: string;
  /** Subtitle / description text */
  subtitle?: string;
  /** Lucide icon to display */
  icon?: LucideIcon;
  /** CTA button label. If omitted, no button is shown */
  actionLabel?: string;
  /** CTA click handler. Defaults to opening the help Sheet */
  onAction?: () => void;
  /** Use a primary (filled) button style for the CTA */
  isPrimary?: boolean;
  /** Show a skeleton loading state for `loadingMs` milliseconds */
  loadingMs?: number;
  /** Help sheet title */
  helpTitle?: string;
  /** Help sheet description */
  helpDescription?: string;
  /** Optional additional help links to render in the sheet */
  helpLinks?: { label: string; href: string }[];
}

/**
 * RoleEmptyState — A rich empty-state card with optional skeleton loader,
 * contextual CTA button, and a slide-out help Sheet with video/docs links.
 *
 * Designed to be fully portable: all role-specific text is supplied via props.
 * In client-web, wrap it once per role in a `RoleEmptyState` factory component
 * that reads `useAuth` and calls this with the appropriate props.
 */
export function RoleEmptyState({
  title = "Nothing here yet",
  subtitle = "Get started by completing the action above.",
  icon: Icon = Search,
  actionLabel,
  onAction,
  isPrimary = false,
  loadingMs = 1200,
  helpTitle = "Need Help?",
  helpDescription = "Tutorials and documentation for this section.",
  helpLinks = [],
}: RoleEmptyStateProps) {
  const [isLoading, setIsLoading] = useState(loadingMs > 0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    if (loadingMs <= 0) return;
    const t = setTimeout(() => setIsLoading(false), loadingMs);
    return () => clearTimeout(t);
  }, [loadingMs]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[300px]">
        <Skeleton className="w-20 h-20 rounded-full mb-4" />
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-6" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    );
  }

  const handleAction = onAction ?? (() => setIsHelpOpen(true));

  return (
    <>
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[300px] animate-in fade-in duration-500">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Icon className="w-12 h-12 text-slate-400 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{subtitle}</p>

        {actionLabel && (
          <Button
            variant={isPrimary ? "default" : "outline"}
            className={isPrimary ? "bg-primary text-white" : "text-slate-600 gap-2"}
            onClick={handleAction}
          >
            {!isPrimary && <BookOpen className="w-4 h-4" />}
            {actionLabel}
          </Button>
        )}
      </div>

      {/* Help Slide-out */}
      <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <SheetContent>
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl text-slate-900">{helpTitle}</SheetTitle>
            <SheetDescription>{helpDescription}</SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {/* Placeholder video tutorial */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-indigo-500" />
                Video Tutorials
              </h4>
              <div className="group relative rounded-lg overflow-hidden cursor-pointer border border-slate-200">
                <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                  <PlayCircle className="w-10 h-10 text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    2:45
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-sm font-medium text-slate-900 line-clamp-1">Getting Started Guide</p>
                  <p className="text-xs text-slate-500 mt-1">Learn the basics in 3 minutes</p>
                </div>
              </div>
            </div>

            {/* Documentation links */}
            {helpLinks.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-blue-500" />
                  Documentation
                </h4>
                <div className="space-y-2">
                  {helpLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between p-3 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group"
                    >
                      <span className="text-sm text-slate-700 font-medium">{link.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
