"use client";

/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable design-tokens/no-hardcoded-colors */
import confetti, { type Options as ConfettiOptions } from "canvas-confetti";

export interface ConfettiCannonOptions {
  duration?: number;
  intervalMs?: number;
  baseParticleCount?: number;
  colors: string[];
  startVelocity?: number;
  spread?: number;
  ticks?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
  getOrigins?: (random: (min: number, max: number) => number) => Array<{ x: number; y: number }>;
}

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Reusable animated confetti runner that orchestrates periodic particle bursts over a duration.
 */
export function runConfettiAnimation(options: ConfettiCannonOptions): ReturnType<typeof setInterval> {
  const {
    duration = 2000,
    intervalMs = 250,
    baseParticleCount = 50,
    colors,
    startVelocity = 30,
    spread = 360,
    ticks = 60,
    zIndex = 100,
    disableForReducedMotion,
    getOrigins = (rnd) => [
      { x: rnd(0.1, 0.3), y: Math.random() - 0.2 },
      { x: rnd(0.7, 0.9), y: Math.random() - 0.2 },
    ],
  } = options;

  const animationEnd = Date.now() + duration;
  const baseDefaults: ConfettiOptions = {
    startVelocity,
    spread,
    ticks,
    zIndex,
    disableForReducedMotion,
  };

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = baseParticleCount * (timeLeft / duration);
    const origins = getOrigins(randomInRange);

    for (const origin of origins) {
      confetti({
        ...baseDefaults,
        particleCount,
        origin,
        colors,
      });
    }
  }, intervalMs);

  return interval;
}

/**
 * Trigger a celebration confetti cannon with emerald, blue, and amber particles.
 */
export const triggerSuccessConfetti = () => {
  return runConfettiAnimation({
    duration: 2000,
    baseParticleCount: 50,
    startVelocity: 30,
    colors: ["#10b981", "#3b82f6", "#f59e0b"],
  });
};

/**
 * Trigger an immediate localized micro confetti burst at given screen coordinates.
 */
export const triggerMicroConfetti = (x: number, y: number) => {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { x, y },
    colors: ["#10b981", "#3b82f6", "#f59e0b"],
    disableForReducedMotion: true,
  });
};

/**
 * Trigger an emerald green themed confetti celebration.
 */
export const triggerEmeraldConfetti = () => {
  return runConfettiAnimation({
    duration: 2500,
    baseParticleCount: 75,
    startVelocity: 45,
    colors: ["#059669", "#10b981", "#34d399", "#6ee7b7"],
  });
};

/**
 * Trigger a corporate navy and gold cascading confetti celebration.
 */
export const triggerGovernanceConfetti = () => {
  return runConfettiAnimation({
    duration: 2000,
    baseParticleCount: 40,
    startVelocity: 25,
    colors: ["#d97706", "#fbbf24", "#fcd34d", "#1e3a8a", "#1e40af"],
    getOrigins: (rnd) => [{ x: rnd(0.2, 0.8), y: -0.1 }],
  });
};
