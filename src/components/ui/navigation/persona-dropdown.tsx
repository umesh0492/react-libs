import * as React from "react";
import { ChevronDown, Check, User } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../overlays/dropdown-menu";
import { Button } from "../forms/button";

export interface PersonaOption {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface PersonaDropdownProps {
  personas: PersonaOption[];
  activePersonaId?: string;
  onSelectPersona: (personaId: string) => void;
  triggerLabel?: string;
  className?: string;
}

export function PersonaDropdown({
  personas = [],
  activePersonaId,
  onSelectPersona,
  triggerLabel,
  className,
}: PersonaDropdownProps) {
  const activePersona = personas.find((p) => p.id === activePersonaId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-2 rounded-full border-slate-200 bg-white/80 px-3 text-xs font-semibold backdrop-blur-xs hover:bg-white dark:border-slate-800 dark:bg-slate-900",
            className
          )}
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            {activePersona?.icon || <User className="h-3 w-3" />}
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {triggerLabel || activePersona?.title || "Select Role"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1.5">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Switch Persona / View
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {personas.map((persona) => {
          const isSelected = persona.id === activePersonaId;
          return (
            <DropdownMenuItem
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className={cn(
                "flex items-start gap-2.5 p-2 rounded-lg cursor-pointer",
                isSelected && "bg-indigo-50/70 dark:bg-indigo-950/40"
              )}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 mt-0.5">
                {persona.icon || <User className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {persona.title}
                  </span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </div>
                {persona.subtitle && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {persona.subtitle}
                  </p>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
