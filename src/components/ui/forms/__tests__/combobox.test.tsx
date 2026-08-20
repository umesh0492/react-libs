import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
});
