import * as React from "react";
import { CheckCircle2, ExternalLink, GitPullRequest, Award, ShieldCheck } from "lucide-react";
import { SectionCard } from "../layout/section-card";
import { Badge } from "./badge";
import { cn } from "../../../lib/utils";

export interface ProofOfWorkItem {
  id?: string;
  title: string;
  type: "github" | "live_project" | "certificate" | "architecture";
  description?: string;
  linkUrl?: string;
  score?: number; // e.g. 98/100
  verified?: boolean;
  tags?: string[];
}

export interface ProofOfWorkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ProofOfWorkItem;
  onOpen?: (item: ProofOfWorkItem) => void;
}

export function ProofOfWorkCard({
  item,
  onOpen,
  className,
  ...props
}: ProofOfWorkCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case "github":
        return <GitPullRequest className="h-4 w-4 text-purple-500" />;
      case "certificate":
        return <Award className="h-4 w-4 text-amber-500" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
    }
  };

  return (
    <SectionCard className={cn("p-4 space-y-2.5 transition-hover hover:border-indigo-400 dark:hover:border-indigo-500", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>{item.title}</span>
              {item.verified && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 inline shrink-0" />
              )}
            </h4>
            <span className="text-[11px] font-medium text-slate-400 capitalize">
              {item.type.replace("_", " ")}
            </span>
          </div>
        </div>

        {item.score !== undefined && (
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            {item.score}/100
          </span>
        )}
      </div>

      {item.description ? (
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      ) : null}

      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-wrap gap-1">
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {item.linkUrl && (
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View Artifact</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </SectionCard>
  );
}
