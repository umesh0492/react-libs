import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ImageViewer } from "../image-viewer"

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "mock-url")
global.URL.revokeObjectURL = vi.fn()

describe("ImageViewer", () => {
  const mockFile = new File([""], "test.png", { type: "image/png" })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders loading state initially", () => {
    render(<ImageViewer file={mockFile} />)
    expect(screen.getByText(/Loading Image.../i)).toBeInTheDocument()
  })

  it("renders image after loading succeeds", () => {
    render(<ImageViewer file="test-image.jpg" />)
    const img = screen.getByAltText("Image preview")
    fireEvent.load(img)
    expect(screen.queryByText(/Loading Image.../i)).not.toBeInTheDocument()
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", "test-image.jpg")
  })

  it("renders error state when loading fails", () => {
    render(<ImageViewer file="invalid-image.jpg" />)
    const img = screen.getByAltText("Image preview")
    fireEvent.error(img)
    // Use exact match to avoid finding both "Failed to load Image" and "Failed to load image."
    expect(screen.getByText("Failed to load Image")).toBeInTheDocument()
    expect(screen.getByText("Failed to load image.")).toBeInTheDocument()
  })

  it("handles File objects correctly", () => {
    render(<ImageViewer file={mockFile} />)
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockFile)
    const img = screen.getByAltText("Image preview")
    expect(img).toHaveAttribute("src", "mock-url")
  })

  it("shows error for non-image files", () => {
    const textFile = new File([""], "test.txt", { type: "text/plain" })
    render(<ImageViewer file={textFile} />)
    expect(screen.getByText("Provided file is not an image.")).toBeInTheDocument()
  })

  it("zooms in when Zoom In button is clicked", () => {
    render(<ImageViewer file="test.jpg" />)
    const img = screen.getByAltText("Image preview")
    fireEvent.load(img)
    
    const zoomInBtn = screen.getByLabelText("Zoom In")
    fireEvent.click(zoomInBtn)
    
    const container = img.parentElement
    expect(container).toHaveStyle({ transform: "scale(1.5) rotate(0deg)" })
  })

  it("zooms out when Zoom Out button is clicked", () => {
    render(<ImageViewer file="test.jpg" />)
    const img = screen.getByAltText("Image preview")
    fireEvent.load(img)
    
    const zoomOutBtn = screen.getByLabelText("Zoom Out")
    fireEvent.click(zoomOutBtn)
    
    const container = img.parentElement
    expect(container).toHaveStyle({ transform: "scale(0.8) rotate(0deg)" })
  })

  it("resets zoom when Reset Zoom button is clicked", () => {
    render(<ImageViewer file="test.jpg" />)
    const img = screen.getByAltText("Image preview")
    fireEvent.load(img)
    
    const zoomInBtn = screen.getByLabelText("Zoom In")
    fireEvent.click(zoomInBtn) // Scale to 1.5
    
    const resetBtn = screen.getByLabelText("Reset Zoom")
    fireEvent.click(resetBtn)
    
    const container = img.parentElement
    expect(container).toHaveStyle({ transform: "scale(1) rotate(0deg)" })
  })

  it("rotates image when Rotate button is clicked", () => {
    render(<ImageViewer file="test.jpg" />)
    const img = screen.getByAltText("Image preview")
    fireEvent.load(img)
    
    const rotateBtn = screen.getByLabelText("Rotate")
    fireEvent.click(rotateBtn)
    
    const container = img.parentElement
    expect(container).toHaveStyle({ transform: "scale(1) rotate(90deg)" })
    
    fireEvent.click(rotateBtn)
    expect(container).toHaveStyle({ transform: "scale(1) rotate(180deg)" })
  })

  it("shows download button when showDownload is true", () => {
    render(<ImageViewer file="test.jpg" showDownload={true} />)
    const img = screen.getByAltText("Image preview")
    fireEvent.load(img)
    
    expect(screen.getByLabelText("Download")).toBeInTheDocument()
  })

  it("handles download correctly for string files", () => {
    // Save original
    const originalCreateElement = document.createElement
    const link = originalCreateElement.call(document, "a")
    const clickSpy = vi.spyOn(link, "click").mockImplementation(() => {})
    
    // Mock only for "a" tag to avoid HierarchyRequestError during React rendering
    const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") return link as any
      return originalCreateElement.call(document, tagName)
    })
    
    render(<ImageViewer file="https://example.com/test.png" showDownload={true} />)
    const img = screen.getByAltText("Image preview")
    fireEvent.load(img)
    
    const downloadBtn = screen.getByLabelText("Download")
    fireEvent.click(downloadBtn)
    
    expect(link.getAttribute("href")).toBe("https://example.com/test.png")
    expect(link.getAttribute("download")).toBe("test.png")
    expect(clickSpy).toHaveBeenCalled()
    
    createElementSpy.mockRestore()
  })
})
