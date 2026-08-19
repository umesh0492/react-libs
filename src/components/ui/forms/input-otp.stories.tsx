// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./input-otp";

/**
 * A one-time-password input built on `input-otp`.
 *
 * **Phase 1 fixes:**
 * - Each slot is now a **standalone rounded cell** (not a connected bar)
 * - `gap-2` spacing between cells per group; groups also have `gap-2` between them
 * - Cell size: `h-12 w-11` — taller and more touch-friendly
 * - `inputMode="numeric"` + `pattern="[0-9]*"` enforced by default
 * - Caret blink: `h-5 w-0.5` for better visibility
 * - Active cell highlights with `border-primary ring-2 ring-primary/20`
 */
const meta = {
  title: "UI/Forms/InputOTP",
  component: InputOTP,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "OTP input with isolated, individually-rounded slots. Each `InputOTPSlot` " +
          "renders as its own pill with a full border. Groups are separated with `gap-2`. " +
          "Numeric-only by default. Use `InputOTPSeparator` for split layouts.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    maxLength: {
      control: { type: "number", min: 4, max: 8 },
      description: "Total number of OTP digits.",
      table: { category: "Config", defaultValue: { summary: "6" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire input.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
    onComplete: {
      action: "onComplete",
      description: "Fired with the complete value when all slots are filled.",
      table: { category: "Events" },
    },
  },
  args: { maxLength: 6, disabled: false },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard 6-digit OTP — standalone rounded cells with gap spacing.
 * Click the field and type digits to see cells fill left-to-right.
 */
export const SixDigit: Story = {
  render: (args) => (
    <div className="p-8 flex flex-col gap-3 items-center">
      <label className="text-sm font-medium" htmlFor="otp-6">
        Verification Code
      </label>
      <InputOTP {...args} id="otp-6">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground">
        Each slot is its own rounded pill ↑
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    expect(input).toBeInTheDocument();
  },
};

/** 4-digit PIN — works great for ATM / order confirmation flows. */
export const FourDigitPin: Story = {
  args: { maxLength: 4 },
  render: (args) => (
    <div className="p-8 flex flex-col gap-3 items-center">
      <label className="text-sm font-medium" htmlFor="otp-4">
        ATM PIN
      </label>
      <InputOTP {...args} id="otp-4">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
};

/**
 * Split 3-3 layout — two groups separated by a dash.
 * Both groups use `gap-2` internally; a visual separator appears between them.
 */
export const SplitWithSeparator: Story = {
  render: (args) => (
    <div className="p-8 flex flex-col gap-3 items-center">
      <label className="text-sm font-medium" htmlFor="otp-split">
        Backup Code
      </label>
      <InputOTP {...args} id="otp-split">
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
    </div>
  ),
};

/**
 * Pre-filled value demonstration.
 */
export const PreFilled: Story = {
  render: () => (
    <div className="p-8 flex flex-col gap-3 items-center">
      <label className="text-sm font-medium" htmlFor="otp-prefilled">
        Pre-filled Code
      </label>
      <InputOTP
        maxLength={6}
        value="48291"
        id="otp-prefilled"
        onChange={() => {}}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
};

/** Disabled — all slots are non-interactive and appear faded. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="p-8 flex flex-col gap-3 items-center">
      <label
        className="text-sm font-medium text-muted-foreground"
        htmlFor="otp-disabled"
      >
        Code Expired
      </label>
      <InputOTP {...args} id="otp-disabled">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("textbox")).toBeDisabled();
  },
};
