import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchField } from "../search-field";

describe("SearchField", () => {
  it("renders with placeholder and handles onChange", () => {
    const handleChange = vi.fn();
    render(<SearchField value="" onChange={handleChange} placeholder="Search suppliers..." />);

    const input = screen.getByPlaceholderText("Search suppliers...");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Mahavir" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("clears search input when clear button is clicked", () => {
    const handleClear = vi.fn();
    render(
      <SearchField
        value="Steel"
        onChange={() => {}}
        onClear={handleClear}
        placeholder="Search..."
      />
    );

    const clearButton = screen.getByRole("button", { name: /clear search/i });
    fireEvent.click(clearButton);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
