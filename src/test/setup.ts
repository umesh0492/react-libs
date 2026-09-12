import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically cleanup DOM after each assertion
afterEach(() => {
    cleanup();
});

// SSR / Node environment polyfills
const globalScope = globalThis as unknown as { DOMMatrix?: typeof DOMMatrix };
if (typeof globalScope.DOMMatrix === 'undefined') {
  globalScope.DOMMatrix = class DOMMatrix {} as unknown as typeof DOMMatrix;
}

// JSDOM specific mocks
if (typeof window !== 'undefined') {
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
      this.callback(
        [{ isIntersecting: true, intersectionRatio: 1 } as unknown as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };

  // cmdk (Command) calls scrollIntoView internally — mock it
  if (window.HTMLElement) {
    window.HTMLElement.prototype.scrollIntoView = () => {};
  }

  // Provide standard requestAnimationFrame fallback if not available in environment
  if (typeof window.requestAnimationFrame === "undefined") {
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(performance.now()), 0);
    };
    window.cancelAnimationFrame = (id: number) => {
      clearTimeout(id);
    };
  }
}
