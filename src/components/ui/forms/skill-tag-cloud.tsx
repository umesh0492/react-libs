import * as React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../data-display/badge";
import { Button } from "./button";
import { Input } from "./input";

export interface SkillTag {
  id?: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  verified?: boolean;
}

export interface SkillTagCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: SkillTag[];
  onAddTag?: (name: string) => void;
  onRemoveTag?: (tag: SkillTag) => void;
  readOnly?: boolean;
  maxTags?: number;
  placeholder?: string;
  categoryLabel?: string;
}

export function SkillTagCloud({
  tags = [],
  onAddTag,
  onRemoveTag,
  readOnly = false,
  maxTags,
  placeholder = "Add skill (e.g. Go, React, Python)...",
  categoryLabel,
  className,
  ...props
}: SkillTagCloudProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onAddTag?.(inputValue.trim());
      setInputValue("");
    }
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddTag?.(inputValue.trim());
      setInputValue("");
    }
  };

  const getLevelVariant = (level?: string) => {
    switch (level) {
      case "Expert":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
      case "Advanced":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "Intermediate":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className={cn("space-y-2.5", className)} {...props}>
      {categoryLabel ? (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {categoryLabel}
        </span>
      ) : null}

      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag, idx) => (
          <span
            key={tag.id || `${tag.name}-${idx}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              getLevelVariant(tag.level)
            )}
          >
            <span>{tag.name}</span>
            {tag.level ? (
              <span className="text-[10px] opacity-75 font-semibold">
                • {tag.level}
              </span>
            ) : null}
            {!readOnly && onRemoveTag ? (
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="hover:opacity-75 focus:outline-none"
                aria-label={`Remove ${tag.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </span>
        ))}

        {tags.length === 0 && readOnly && (
          <span className="text-xs text-slate-400 italic">No skills listed</span>
        )}
      </div>

      {!readOnly && (!maxTags || tags.length < maxTags) && (
        <div className="flex items-center gap-2 max-w-sm pt-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-8 text-xs"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="h-8 shrink-0 px-2.5"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
