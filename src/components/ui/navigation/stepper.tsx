"use client";

import * as React from "react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface StepItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isError?: boolean;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: "horizontal" | "vertical";
  clickable?: boolean;
}

function renderStepMarker(step: StepItem, index: number, isCompleted: boolean) {
  if (step.isError) {
    return <AlertCircle className="h-4 w-4" />;
  }
  if (isCompleted) {
    return <Check className="h-4 w-4 stroke-[2.5]" />;
  }
  if (step.icon) {
    return step.icon;
  }
  return index + 1;
}

interface StepRowProps {
  step: StepItem;
  index: number;
  activeStep: number;
  stepsCount: number;
  isVertical: boolean;
  clickable: boolean;
  onStepClick?: (stepIndex: number) => void;
  renderStepMarker: (step: StepItem, index: number, isCompleted: boolean) => React.ReactNode;
}

function getCircleVariantClass(
  isCompleted: boolean,
  isActive: boolean,
  isUpcoming: boolean,
  isError: boolean
) {
  if (isError) return "border-destructive bg-destructive text-destructive-foreground";
  if (isCompleted) return "border-primary bg-primary text-primary-foreground";
  if (isActive) return "border-primary bg-background text-primary ring-2 ring-primary/20 ring-offset-2";
  if (isUpcoming) return "border-border bg-muted text-muted-foreground";
  return "";
}

function StepLabelContent({
  title,
  description,
  isActive,
  isError,
  isVertical,
}: {
  title: string;
  description?: string;
  isActive: boolean;
  isError: boolean;
  isVertical: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        isVertical ? "min-w-0 pb-6" : "mt-2 px-1 max-w-[140px]"
      )}
    >
      <span
        className={cn(
          "text-xs font-medium truncate",
          isActive ? "text-foreground font-semibold" : "text-muted-foreground",
          isError && "text-destructive font-semibold"
        )}
      >
        {title}
      </span>
      {description && (
        <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
          {description}
        </span>
      )}
    </div>
  );
}

function StepItem({
  step,
  index,
  activeStep,
  stepsCount,
  isVertical,
  clickable,
  onStepClick,
  renderStepMarker,
}: StepRowProps) {
  const isCompleted = index < activeStep;
  const isActive = index === activeStep;
  const isUpcoming = index > activeStep;
  const isError = Boolean(step.isError);
  const isClickable = Boolean(clickable && onStepClick && !isError);
  const isLast = index === stepsCount - 1;

  const currentLabel = isActive ? " (current step)" : "";
  const accessibleLabel = isClickable ? `${step.title}${currentLabel}` : undefined;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onStepClick?.(index);
    }
  };

  const showHorizontalLine = !isLast && !isVertical;

  return (
    <div
      aria-current={isActive ? "step" : undefined}
      className={cn(
        "relative flex",
        isVertical ? "flex-row items-start gap-4" : "flex-1 flex-col items-center text-center",
        showHorizontalLine && "after:content-[''] after:absolute after:top-4 after:left-[50%] after:w-full after:h-[2px] after:-translate-y-1/2 after:bg-border after:z-0",
        showHorizontalLine && isCompleted && "after:bg-primary"
      )}
    >
      {/* Step Circle Marker */}
      <div
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-current={isActive ? "step" : undefined}
        aria-label={accessibleLabel}
        onClick={() => isClickable && onStepClick?.(index)}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all select-none",
          isClickable && "cursor-pointer hover:ring-2 hover:ring-ring hover:ring-offset-2",
          getCircleVariantClass(isCompleted, isActive, isUpcoming, isError)
        )}
      >
        {renderStepMarker(step, index, isCompleted)}
      </div>

      {/* Step Label Content */}
      <StepLabelContent
        title={step.title}
        description={step.description}
        isActive={isActive}
        isError={isError}
        isVertical={isVertical}
      />

      {/* Vertical Connector Line */}
      {isVertical && !isLast && (
        <div
          className={cn(
            "absolute left-4 top-8 -bottom-4 w-[2px] -translate-x-1/2 bg-border",
            isCompleted && "bg-primary"
          )}
        />
      )}
    </div>
  );
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      activeStep = 0,
      orientation = "horizontal",
      clickable = false,
      onStepClick,
      className,
      ...props
    },
    ref
  ) => {
    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        role="navigation"
        aria-label="Progress Stepper"
        className={cn(
          "w-full",
          isVertical ? "flex flex-col space-y-4" : "flex items-start justify-between",
          className
        )}
        {...props}
      >
        {steps.map((step, index) => (
          <StepItem
            key={index}
            step={step}
            index={index}
            activeStep={activeStep}
            stepsCount={steps.length}
            isVertical={isVertical}
            clickable={clickable}
            onStepClick={onStepClick}
            renderStepMarker={renderStepMarker}
          />
        ))}
      </div>
    );
  }
);

Stepper.displayName = "Stepper";
