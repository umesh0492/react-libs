import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./sheet";
import { Button } from "../forms/button";
import { cn } from "../../../lib/utils";

export interface CreateEntityPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  onSave?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  readOnly?: boolean;
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "xl";
}

function getSheetSizeClass(size: "default" | "sm" | "lg" | "xl") {
  switch (size) {
    case "sm":
      return "sm:max-w-md";
    case "lg":
      return "sm:max-w-xl";
    case "xl":
      return "sm:max-w-2xl";
    default:
      return "sm:max-w-lg";
  }
}

export function CreateEntityPanel({
  open,
  onOpenChange,
  title,
  description,
  icon,
  onSave,
  isSaving = false,
  saveLabel = "Save & Apply",
  cancelLabel = "Cancel",
  readOnly = false,
  children,
  size = "default",
}: CreateEntityPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "flex flex-col h-full overflow-hidden p-0",
          getSheetSizeClass(size)
        )}
      >
        {/* Header */}
        <SheetHeader className="border-b border-slate-100 px-6 py-5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            {icon ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                {icon}
              </div>
            ) : null}
            <div>
              <SheetTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                {title}
              </SheetTitle>
              {description ? (
                <SheetDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {description}
                </SheetDescription>
              ) : null}
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        <SheetFooter className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-950 flex flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            {cancelLabel}
          </Button>
          {!readOnly && onSave && (
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              {saveLabel}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
