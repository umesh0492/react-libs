import * as React from "react";
import { UserCheck, LogOut } from "lucide-react";
import { Button } from "../forms/button";
import { cn } from "../../../lib/utils";

export interface ImpersonationBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  impersonatedUser: {
    name?: string;
    email?: string;
    role?: string;
    orgName?: string;
  };
  onEndImpersonation: () => void;
  isLoading?: boolean;
}

export function ImpersonationBanner({
  impersonatedUser,
  onEndImpersonation,
  isLoading = false,
  className,
  ...props
}: ImpersonationBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between border-b border-amber-300 bg-amber-500 px-4 py-2 text-slate-950 shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <UserCheck className="h-4 w-4 shrink-0 text-slate-950" />
        <p className="text-xs font-semibold truncate">
          Impersonating: <span className="underline">{impersonatedUser.name || impersonatedUser.email}</span>
          {impersonatedUser.role ? ` (${impersonatedUser.role})` : ""}
          {impersonatedUser.orgName ? ` • ${impersonatedUser.orgName}` : ""}
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onEndImpersonation}
        disabled={isLoading}
        className="h-7 border-slate-900/40 bg-slate-950 text-white hover:bg-slate-900 text-xs shrink-0 ml-3"
      >
        <LogOut className="h-3 w-3 mr-1" />
        Exit Impersonation
      </Button>
    </div>
  );
}
