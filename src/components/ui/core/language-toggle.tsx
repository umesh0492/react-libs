import { ChevronDown, Globe } from "lucide-react"
import { Button } from "../forms/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../overlays/dropdown-menu"

export type SupportedLanguage = "en" | "hi" | "ta" | "te" | "kn" | "mr" | "gu"

export interface LanguageToggleProps {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  className?: string
}

const LANGUAGES: { code: SupportedLanguage; name: string; nativeName: string }[] = [
  { code: "en", name: "English",   nativeName: "English" },
  { code: "hi", name: "Hindi",     nativeName: "हिंदी" },
  { code: "ta", name: "Tamil",     nativeName: "தமிழ்" },
  { code: "te", name: "Telugu",    nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada",  nativeName: "ಕನ್ನಡ" },
  { code: "mr", name: "Marathi",  nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
]

/**
 * LanguageToggle — portable language-switcher dropdown.
 *
 * Fixed issues:
 * 1. Shows language CODE only in the trigger (no "active: Name" label)
 * 2. ChevronDown inside the trigger indicates it's a dropdown
 * 3. Proper hover/active/focus states via buttonVariants
 *
 * Usage:
 * ```tsx
 * <LanguageToggle language={language} setLanguage={setLanguage} />
 * ```
 */
export function LanguageToggle({
  language,
  setLanguage,
  className,
}: LanguageToggleProps) {
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

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
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={
              language === lang.code
                ? "bg-primary/8 text-primary font-medium"
                : "hover:bg-muted/60"
            }
          >
            {/* Code badge + native name */}
            <span className="inline-flex items-center gap-2.5 w-full">
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none text-muted-foreground shrink-0">
                {lang.code.toUpperCase()}
              </kbd>
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm leading-none">{lang.nativeName}</span>
                {lang.nativeName !== lang.name && (
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
