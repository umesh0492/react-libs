import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../input-otp';

describe('InputOTP Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders InputOTPGroup', () => {
    const { container } = render(<InputOTPGroup><div>Slot</div></InputOTPGroup>);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders InputOTPSeparator with role="separator"', () => {
    render(<InputOTPSeparator />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders InputOTP with maxLength and renders slots', () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('renders InputOTP with separator between groups', () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('applies custom className to InputOTPGroup', () => {
    const { container } = render(
      <InputOTPGroup className="custom-group"><div>content</div></InputOTPGroup>
    );
    expect(container.querySelector('.custom-group')).toBeInTheDocument();
  });

  it('renders InputOTP with disabled state', () => {
    const { container } = render(
      <InputOTP maxLength={4} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    const input = container.querySelector('input');
    expect(input).toBeDisabled();
  });

  it('renders InputOTP with pattern prop', () => {
    const { container } = render(
      <InputOTP maxLength={6} pattern="^[0-9]+$">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(container.querySelector('input')).toBeInTheDocument();
  });
});
