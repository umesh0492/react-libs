import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileUpload, FileItem } from "../file-upload";

describe("FileUpload", () => {
  it("renders upload dropzone with label and description", () => {
    render(
      <FileUpload
        label="Upload documents"
        description="PDF up to 5MB"
      />
    );
    expect(screen.getByText("Upload documents")).toBeInTheDocument();
    expect(screen.getByText("PDF up to 5MB")).toBeInTheDocument();
  });

  it("renders list of files with remove buttons", () => {
    const mockFiles: FileItem[] = [
      {
        id: "1",
        file: new File(["hello world"], "test.pdf", { type: "application/pdf" }),
      },
    ];
    const handleChange = vi.fn();

    render(
      <FileUpload
        value={mockFiles}
        onChange={handleChange}
      />
    );

    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    const removeBtn = screen.getByRole("button", { name: /remove test\.pdf/i });
    fireEvent.click(removeBtn);
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it("handles file input change event", () => {
    const handleChange = vi.fn();
    render(<FileUpload onChange={handleChange} />);

    const input = screen.getByTestId("file-upload-input");
    const file = new File(["dummy content"], "invoice.png", { type: "image/png" });

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/dummy");

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalled();
    const passedFiles = handleChange.mock.calls[0][0];
    expect(passedFiles.length).toBe(1);
    expect(passedFiles[0].file.name).toBe("invoice.png");
  });

  it("displays custom error message", () => {
    render(<FileUpload error="File is corrupted" />);
    expect(screen.getByText("File is corrupted")).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(<FileUpload disabled label="Disabled upload" />);
    const dropzone = screen.getByRole("button");
    expect(dropzone).toHaveAttribute("aria-disabled", "true");
  });
});
