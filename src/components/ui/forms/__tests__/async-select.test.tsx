import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AsyncSelect } from "../async-select";

const mockFetchFn = vi.fn();

const mockData = [
  { id: "1", name: "Apple", type: "fruit" },
  { id: "2", name: "Banana", type: "fruit" },
];

describe("AsyncSelect", () => {
  beforeEach(() => {
    mockFetchFn.mockReset();
    mockFetchFn.mockResolvedValue(mockData);
  });

  it("renders with placeholder and fetches on focus", async () => {
    render(
      <AsyncSelect<{ id: string; name: string; type: string }>
        value=""
        onChange={vi.fn()}
        fetchFn={mockFetchFn}
        getOptionValue={(opt) => opt.id}
        getOptionLabel={(opt) => opt.name}
        getOptionStringValue={(opt) => opt.name}
        placeholder="Select a fruit"
        debounceMs={0} // speeds up tests
      />
    );

    const input = screen.getByPlaceholderText("Type to search...");
    expect(input).toBeInTheDocument();

    // Focus triggers fetch
    fireEvent.focus(input);
    
    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith("");
    });
    
    // Result should appear
    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });
  });

  it("triggers onChange with correct value when option is selected", async () => {
    const mockOnChange = vi.fn();
    
    // Create a stateful wrapper to simulate parent component behavior
    const Wrapper = () => {
      const [val, setVal] = React.useState("");
      return (
        <AsyncSelect<{ id: string; name: string; type: string }>
          value={val}
          onChange={(v, item) => {
            setVal(v);
            mockOnChange(v, item);
          }}
          fetchFn={mockFetchFn}
          getOptionValue={(opt) => opt.id}
          getOptionLabel={(opt) => opt.name}
          getOptionStringValue={(opt) => opt.name}
          debounceMs={0}
        />
      );
    };

    render(<Wrapper />);

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.focus(input);
    
    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Apple"));

    expect(mockOnChange).toHaveBeenCalledWith("1", mockData[0]);
    // The input should update to "Apple" because the wrapper updated the value
    expect(input).toHaveValue("Apple");
  });
});
