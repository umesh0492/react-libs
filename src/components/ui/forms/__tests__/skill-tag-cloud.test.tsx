import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkillTagCloud, SkillTag } from "../skill-tag-cloud";

describe("SkillTagCloud", () => {
  const tags: SkillTag[] = [
    { id: "1", name: "Golang", level: "Expert", verified: true },
    { id: "2", name: "React 19", level: "Advanced" },
    { id: "3", name: "Kubernetes", level: "Intermediate" },
  ];

  it("renders skill tags and handles remove/add", () => {
    const handleRemove = vi.fn();
    const handleAdd = vi.fn();

    render(
      <SkillTagCloud
        tags={tags}
        onRemoveTag={handleRemove}
        onAddTag={handleAdd}
      />
    );

    expect(screen.getByText("Golang")).toBeInTheDocument();
    expect(screen.getByText("React 19")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();

    const removeBtn = screen.getByRole("button", { name: "Remove Golang" });
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledWith(expect.objectContaining({ name: "Golang" }));

    const input = screen.getByPlaceholderText(/Add skill/i);
    fireEvent.change(input, { target: { value: "PostgreSQL" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(handleAdd).toHaveBeenCalledWith("PostgreSQL");
  });
});
