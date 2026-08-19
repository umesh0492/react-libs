/* eslint-disable sonarjs/pseudo-random */
/* eslint-disable design-tokens/no-hardcoded-colors */
import confetti from "canvas-confetti";

export const triggerSuccessConfetti = () => {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Fire from left and right edges
    confetti({
      ...defaults, 
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'] // Emerald, Blue, Amber
    });
    confetti({
      ...defaults, 
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#10b981', '#3b82f6', '#f59e0b']
    });
  }, 250);
};

export const triggerMicroConfetti = (x: number, y: number) => {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { x, y },
    colors: ['#10b981', '#3b82f6', '#f59e0b'],
    disableForReducedMotion: true
  });
};

export const triggerEmeraldConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 45, spread: 360, ticks: 60, zIndex: 100 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 75 * (timeLeft / duration);
    
    // Emerald green palette
    const colors = ['#059669', '#10b981', '#34d399', '#6ee7b7'];
    
    confetti({
      ...defaults, 
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors
    });
    confetti({
      ...defaults, 
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors
    });
  }, 250);
};

export const triggerGovernanceConfetti = () => {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 100 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    
    // Gold and Navy palette
    const colors = ['#d97706', '#fbbf24', '#fcd34d', '#1e3a8a', '#1e40af'];
    
    confetti({
      ...defaults, 
      particleCount,
      origin: { x: randomInRange(0.2, 0.8), y: -0.1 }, // cascading from top center
      colors
    });
  }, 250);
};
