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

  it("handles out-of-order async responses without overwriting with stale results", async () => {
    let resolveSlow!: (data: typeof mockData) => void;
    let resolveFast!: (data: typeof mockData) => void;

    const slowPromise = new Promise<typeof mockData>((res) => {
      resolveSlow = res;
    });
    const fastPromise = new Promise<typeof mockData>((res) => {
      resolveFast = res;
    });

    const mockRaceFetch = vi.fn((q: string) => {
      if (q === "slow") return slowPromise;
      if (q === "fast") return fastPromise;
      return Promise.resolve([]);
    });

    render(
      <AsyncSelect<{ id: string; name: string; type: string }>
        value=""
        onChange={vi.fn()}
        fetchFn={mockRaceFetch}
        getOptionValue={(opt) => opt.id}
        getOptionLabel={(opt) => opt.name}
        debounceMs={0}
      />
    );

    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.focus(input);

    // 1. User types "slow"
    fireEvent.change(input, { target: { value: "slow" } });

    // 2. User quickly replaces with "fast"
    fireEvent.change(input, { target: { value: "fast" } });

    // 3. Fast response resolves first
    resolveFast([{ id: "fast-1", name: "Fast Option", type: "fruit" }]);

    await waitFor(() => {
      expect(screen.getByText("Fast Option")).toBeInTheDocument();
    });

    // 4. Slow (stale) response resolves late
    resolveSlow([{ id: "slow-1", name: "Stale Slow Option", type: "fruit" }]);

    // 5. Verify the stale slow option is NOT displayed
    await waitFor(() => {
      expect(screen.queryByText("Stale Slow Option")).not.toBeInTheDocument();
      expect(screen.getByText("Fast Option")).toBeInTheDocument();
    });
  });
});
