import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  triggerSuccessConfetti,
  triggerMicroConfetti,
  triggerEmeraldConfetti,
  triggerGovernanceConfetti,
} from '../success-micro-interaction';

// Mock canvas-confetti so no actual DOM canvas operations happen  
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

import confetti from 'canvas-confetti';

const mockConfetti = confetti as unknown as ReturnType<typeof vi.fn>;


describe('Success Micro-Interaction Confetti', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockConfetti.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggerSuccessConfetti calls confetti within the interval', () => {
    triggerSuccessConfetti();
    vi.advanceTimersByTime(300);
    expect(mockConfetti).toHaveBeenCalled();
  });

  it('triggerSuccessConfetti stops after duration', () => {
    triggerSuccessConfetti();
    vi.advanceTimersByTime(2100);
    const callCount = mockConfetti.mock.calls.length;
    vi.advanceTimersByTime(1000);
    // No additional calls after the animation ends
    expect(mockConfetti.mock.calls.length).toBe(callCount);
  });

  it('triggerMicroConfetti calls confetti with x/y origin', () => {
    triggerMicroConfetti(0.5, 0.4);
    expect(mockConfetti).toHaveBeenCalledTimes(1);
    expect(mockConfetti).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: { x: 0.5, y: 0.4 },
        particleCount: 30,
      })
    );
  });

  it('triggerMicroConfetti passes disableForReducedMotion', () => {
    triggerMicroConfetti(0.3, 0.7);
    expect(mockConfetti).toHaveBeenCalledWith(
      expect.objectContaining({ disableForReducedMotion: true })
    );
  });

  it('triggerEmeraldConfetti fires confetti within the interval', () => {
    triggerEmeraldConfetti();
    vi.advanceTimersByTime(300);
    expect(mockConfetti).toHaveBeenCalled();
  });

  it('triggerGovernanceConfetti fires confetti within the interval', () => {
    triggerGovernanceConfetti();
    vi.advanceTimersByTime(300);
    expect(mockConfetti).toHaveBeenCalled();
  });

  it('triggerMicroConfetti handles edge-case origin at (0, 0)', () => {
    triggerMicroConfetti(0, 0);
    expect(mockConfetti).toHaveBeenCalledWith(
      expect.objectContaining({ origin: { x: 0, y: 0 } })
    );
  });

  it('triggerMicroConfetti handles edge-case origin at (1, 1)', () => {
    triggerMicroConfetti(1, 1);
    expect(mockConfetti).toHaveBeenCalledWith(
      expect.objectContaining({ origin: { x: 1, y: 1 } })
    );
  });
});
