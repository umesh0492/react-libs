import * as React from "react";
import { cn } from "../../../lib/utils";

export interface RadarBlip {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label?: string;
  tone?: "primary" | "emerald" | "amber" | "rose" | "indigo" | "purple" | "cyan";
  pulse?: boolean;
}

export interface RadarSweepProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  blips?: RadarBlip[];
  isScanning?: boolean;
  statusText?: string;
}

export function RadarSweep({
  size = 320,
  blips = [],
  isScanning = true,
  statusText = "AI Radar Active",
  className,
  ...props
}: RadarSweepProps) {
  const getBlipColor = (tone?: string) => {
    switch (tone) {
      case "emerald":
        return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]";
      case "amber":
        return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]";
      case "rose":
        return "bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]";
      case "indigo":
        return "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]";
      case "purple":
        return "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]";
      case "cyan":
        return "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]";
      default:
        return "bg-primary shadow-[0_0_8px_var(--primary)]";
    }
  };

  return (
    <div
      className={cn("relative flex flex-col items-center justify-center p-4", className)}
      {...props}
    >
      <div
        className="relative overflow-hidden rounded-full border border-indigo-500/20 bg-slate-950/80 shadow-2xl backdrop-blur-md"
        style={{ width: size, height: size }}
      >
        {/* Concentric Radar Rings */}
        <div className="absolute inset-[15%] rounded-full border border-indigo-500/15" />
        <div className="absolute inset-[35%] rounded-full border border-indigo-500/15" />
        <div className="absolute inset-[55%] rounded-full border border-indigo-500/15" />
        <div className="absolute inset-[75%] rounded-full border border-indigo-500/15" />

        {/* Crosshairs */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-500/15 -translate-x-1/2" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-500/15 -translate-y-1/2" />

        {/* Rotating Radar Sweep Cone */}
        {isScanning && (
          <div
            className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite]"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, transparent 0deg, color-mix(in srgb, var(--primary) 25%, transparent) 60deg, transparent 60.1deg)",
            }}
          />
        )}

        {/* Center Target Dot */}
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />

        {/* Blips / Radar Targets */}
        {blips.map((blip) => (
          <div
            key={blip.id}
            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
          >
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-transform hover:scale-150",
                getBlipColor(blip.tone),
                blip.pulse && "animate-ping"
              )}
            />
            {blip.label ? (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 hidden whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-md group-hover:inline-block border border-slate-700">
                {blip.label}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      {statusText ? (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{statusText}</span>
        </div>
      ) : null}
    </div>
  );
}
