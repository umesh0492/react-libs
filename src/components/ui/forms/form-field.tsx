import * as React from "react";
import { cn } from "../../../lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  description,
  error,
  required,
  htmlFor,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
        >
          <span>{label}</span>
          {required ? <span className="text-rose-500 font-bold">*</span> : null}
        </label>
      ) : null}
      {children}
      {description ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
