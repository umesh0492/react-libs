import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Combobox } from "../combobox";

describe("Combobox", () => {
  const options = [
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ];

  it("renders with placeholder when no value is selected", () => {
    render(
      <Combobox
        options={options}
        onChange={() => {}}
        placeholder="Select framework"
      />
    );
    expect(screen.getByText("Select framework")).toBeInTheDocument();
  });

  it("renders selected option label", () => {
    render(
      <Combobox
        options={options}
        value="vue"
        onChange={() => {}}
      />
    );
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  it("forwards ref to trigger button", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Combobox
        ref={ref}
        options={options}
        placeholder="Select framework"
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute("role", "combobox");
  });

  it("supports uncontrolled mode with defaultValue", () => {
    render(
      <Combobox
        options={options}
        defaultValue="svelte"
      />
    );
    expect(screen.getByText("Svelte")).toBeInTheDocument();
  });

  it("supports uncontrolled mode without value and onChange props", () => {
    render(
      <Combobox
        options={options}
        placeholder="Select framework"
      />
    );
    expect(screen.getByText("Select framework")).toBeInTheDocument();
  });
});
