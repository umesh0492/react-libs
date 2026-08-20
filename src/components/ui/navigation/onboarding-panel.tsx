import * as React from "react";
import { ArrowLeft, ArrowRight, Loader2, LogOut } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Stepper, type StepItem } from "./stepper";
import { Button } from "../forms/button";

export interface OnboardingPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  activeStep: number;
  steps: StepItem[];
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  nextLoading?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  onStepChange?: (stepIndex: number) => void;
  onLogout?: () => void;
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export function OnboardingPanel({
  activeStep,
  steps,
  title,
  subtitle,
  isFirstStep = false,
  isLastStep = false,
  nextDisabled = false,
  nextLabel,
  nextLoading = false,
  onBack,
  onContinue,
  onStepChange,
  onLogout,
  children,
  scrollContainerRef,
  className,
  ...props
}: OnboardingPanelProps) {
  return (
    <section
      className={cn(
        "flex min-h-screen w-full items-center justify-center p-3 sm:p-4 lg:p-6",
        className
      )}
      {...props}
    >
      <div className="flex h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Stepper Header */}
        <div className="shrink-0 border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/40">
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={onStepChange}
          />
        </div>

        {/* Scrollable Step Content Body */}
        <div
          ref={scrollContainerRef}
          className="min-h-0 flex-1 overflow-y-auto custom-scrollbar px-6 py-6 sm:px-8 space-y-4"
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            ) : null}
          </div>
          <div className="pt-2">{children}</div>
        </div>

        {/* Footer Navigation Bar */}
        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-950">
          {onLogout ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="mr-auto text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Logout
            </Button>
          ) : null}

          {onBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBack}
              disabled={isFirstStep}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back
            </Button>
          )}

          {onContinue && (
            <Button
              type="button"
              size="sm"
              onClick={onContinue}
              disabled={nextDisabled || nextLoading}
              className="min-w-28"
            >
              {nextLoading ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : null}
              {nextLabel || (isLastStep ? "Submit & Finish" : "Save & Continue")}
              {!nextLoading && <ArrowRight className="h-3.5 w-3.5 ml-1.5" />}
            </Button>
          )}
        </footer>
      </div>
    </section>
  );
}
