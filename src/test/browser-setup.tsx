import { beforeAll } from 'vitest';

beforeAll(() => {
  if (typeof window !== 'undefined') {
    // 1. CSS Performance Overrides
    const style = document.createElement('style');
    style.innerHTML = `
      /* Disable all animations and transitions */
      *, *::before, *::after {
        transition-property: none !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        animation-property: none !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-iteration-count: 1 !important;
        
        /* Disable expensive effects */
        box-shadow: none !important;
        text-shadow: none !important;
        backdrop-filter: none !important;
        filter: none !important;
      }

      /* Prevent layout shifts from images */
      img {
        content-visibility: auto;
        display: block;
        max-width: 100%;
        height: auto;
      }
    `;
    document.head.appendChild(style);

    // 2. Mock Image to prevent network requests
    const windowObj = window as unknown as Record<string, unknown>;
    const NativeImage = window.Image;
    windowObj.Image = class extends NativeImage {
      constructor() {
        super();
        setTimeout(() => {
          if (this.onload) this.onload(new Event('load'));
        }, 0);
      }
      set src(_value: string) {
        setTimeout(() => {
          if (this.onload) this.onload(new Event('load'));
        }, 0);
      }
    };

    // 3. Mock MatchMedia
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

    // 4. Mock IntersectionObserver
    windowObj.IntersectionObserver = class IntersectionObserver {
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

    // 5. Mock ResizeObserver (if not already handled)
    windowObj.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // 6. Mock expensive DOM methods
    window.HTMLElement.prototype.scrollIntoView = () => {};

    // 7. Accelerate Timers
    const originalSetTimeout = window.setTimeout;
    windowObj.setTimeout = (
      fn: (...args: unknown[]) => void,
      delay?: number,
      ...args: unknown[]
    ) => {
      if (delay !== undefined && delay > 0 && delay <= 300) {
        return originalSetTimeout(fn, 0, ...args);
      }
      return originalSetTimeout(fn, delay, ...args);
    };

    // 8. Accelerate requestAnimationFrame
    
    windowObj.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return originalSetTimeout(() => callback(performance.now()), 0);
    };

  }
});
