import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CopyButton } from "../copy-button";

describe("CopyButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("copies text to clipboard when clicked", async () => {
    const handleCopy = vi.fn();
    render(<CopyButton value="test string" onCopy={handleCopy} />);

    const button = screen.getByRole("button", { name: /copy/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test string");
    expect(handleCopy).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /copied!/i })).toBeInTheDocument();
  });

  it("renders with text label if showText is true", () => {
    render(<CopyButton value="code snippet" showText defaultText="Copy Code" />);
    expect(screen.getByText("Copy Code")).toBeInTheDocument();
  });
});
