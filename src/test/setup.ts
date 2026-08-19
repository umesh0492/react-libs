import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically cleanup DOM after each assertion
afterEach(() => {
    cleanup();
});

// JSDOM does not implement matchMedia — mock it globally
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// JSDOM does not implement ResizeObserver — mock it globally
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// JSDOM does not implement IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  callback: IntersectionObserverCallback;
  root = null;
  rootMargin = "";
  thresholds = [];
  observe() {
    this.callback([{ isIntersecting: true, intersectionRatio: 1 } as any], this as any);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};

// cmdk (Command) calls scrollIntoView internally — mock it
window.HTMLElement.prototype.scrollIntoView = () => {};

// Accelerate Timers in JSDOM as well
const originalSetTimeout = window.setTimeout;
(window as any).setTimeout = (fn: Function, delay?: number, ...args: any[]) => {
  if (delay !== undefined && delay > 0 && delay <= 300) {
    return originalSetTimeout(fn, 0, ...args);
  }
  return originalSetTimeout(fn, delay, ...args);
};

// Mock requestAnimationFrame to execute synchronously
(window as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(performance.now());
  return 0;
};
(window as any).cancelAnimationFrame = () => {};
