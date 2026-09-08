"use client";

import { ChevronDown, Globe } from "lucide-react"
import { Button } from "../forms/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../overlays/dropdown-menu"

export interface LanguageOption<T extends string = string> {
  code: T;
  name: string;
  nativeName?: string;
}

export type SupportedLanguage = "en" | "es" | "fr" | "de" | "ja" | "zh" | (string & {});

export const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
];

export interface LanguageToggleProps<T extends string = string> {
  language: T;
  setLanguage: (lang: T) => void;
  languages?: LanguageOption<T>[];
  className?: string;
}

/**
 * LanguageToggle — portable language-switcher dropdown.
 *
 * Configurable with custom languages list or defaults to standard international locales.
 *
 * Usage:
 * ```tsx
 * <LanguageToggle language={language} setLanguage={setLanguage} />
 * ```
 */
export function LanguageToggle<T extends string = string>({
  language,
  setLanguage,
  languages = DEFAULT_LANGUAGES as unknown as LanguageOption<T>[],
  className,
}: LanguageToggleProps<T>) {
  const fallbackLanguage: LanguageOption<T> = languages[0] ?? {
    code: language,
    name: String(language).toUpperCase(),
    nativeName: String(language).toUpperCase(),
  };
  const current = languages.find((l) => l.code === language) ?? fallbackLanguage;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-1.5 ${className ?? ""}`}
          aria-label={`Language: ${current.name}. Click to change.`}
        >
          {/* Globe icon for context */}
          <Globe className="h-4 w-4 shrink-0" />

          {/* Show language code only — concise, no "active:" confusion */}
          <span className="font-semibold text-xs tracking-wide">
            {current.code.toUpperCase()}
          </span>

          {/* Chevron signals this is a dropdown */}
          <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={
              language === lang.code
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/60"
            }
          >
            {/* Code badge + native name */}
            <span className="inline-flex items-center gap-2.5 w-full">
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none text-muted-foreground shrink-0">
                {lang.code.toUpperCase()}
              </kbd>
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm leading-none">{lang.nativeName ?? lang.name}</span>
                {lang.nativeName && lang.nativeName !== lang.name && (
                  <span className="text-xs text-muted-foreground leading-none">
                    {lang.name}
                  </span>
                )}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
