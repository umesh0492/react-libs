import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiSelect, Option } from "../multi-select";

const options: Option[] = [
  { label: "Option Alpha", value: "alpha" },
  { label: "Option Beta", value: "beta" },
  { label: "Option Gamma", value: "gamma" },
];

describe("MultiSelect", () => {
  it("renders placeholder when no options are selected", () => {
    render(<MultiSelect options={options} placeholder="Pick elements" />);
    expect(screen.getByText("Pick elements")).toBeInTheDocument();
  });

  it("renders selected option badges", () => {
    render(<MultiSelect options={options} value={["alpha", "beta"]} />);
    expect(screen.getByText("Option Alpha")).toBeInTheDocument();
    expect(screen.getByText("Option Beta")).toBeInTheDocument();
  });

  it("toggles options on click from dropdown", () => {
    const handleChange = vi.fn();
    render(<MultiSelect options={options} value={["alpha"]} onChange={handleChange} />);

    const combobox = screen.getByRole("combobox");
    fireEvent.click(combobox);

    const betaOption = screen.getByText("Option Beta");
    fireEvent.click(betaOption);

    expect(handleChange).toHaveBeenCalledWith(["alpha", "beta"]);
  });

  it("handles remove tag button click", () => {
    const handleChange = vi.fn();
    render(<MultiSelect options={options} value={["alpha", "beta"]} onChange={handleChange} />);

    const removeBtn = screen.getByLabelText("Remove Option Alpha");
    fireEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith(["beta"]);
  });

  it("handles clear all click", () => {
    const handleChange = vi.fn();
    render(<MultiSelect options={options} value={["alpha", "beta"]} onChange={handleChange} />);

    const clearBtn = screen.getByLabelText("Clear all selections");
    fireEvent.click(clearBtn);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it("respects disabled state", () => {
    render(<MultiSelect options={options} disabled placeholder="Disabled multi-select" />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-disabled", "true");
  });
});
