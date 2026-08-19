import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Typography } from "../typography"

describe("Typography", () => {
  it("renders as a paragraph by default", () => {
    render(<Typography>Hello World</Typography>)
    const element = screen.getByText("Hello World")
    expect(element.tagName).toBe("P")
    expect(element).toHaveClass("text-foreground", "font-sans", "leading-7")
  })

  it("renders h1 variant correctly", () => {
    render(<Typography variant="h1">Heading 1</Typography>)
    const element = screen.getByText("Heading 1")
    expect(element.tagName).toBe("H1")
    expect(element).toHaveClass("text-4xl", "font-extrabold", "tracking-tight")
  })

  it("renders h2 variant correctly", () => {
    render(<Typography variant="h2">Heading 2</Typography>)
    const element = screen.getByText("Heading 2")
    expect(element.tagName).toBe("H2")
    expect(element).toHaveClass("text-3xl", "font-semibold")
  })

  it("renders h3 variant correctly", () => {
    render(<Typography variant="h3">Heading 3</Typography>)
    const element = screen.getByText("Heading 3")
    expect(element.tagName).toBe("H3")
    expect(element).toHaveClass("text-2xl", "font-semibold")
  })

  it("renders h4 variant correctly", () => {
    render(<Typography variant="h4">Heading 4</Typography>)
    const element = screen.getByText("Heading 4")
    expect(element.tagName).toBe("H4")
    expect(element).toHaveClass("text-xl", "font-semibold")
  })

  it("renders lead variant correctly", () => {
    render(<Typography variant="lead">Lead Text</Typography>)
    const element = screen.getByText("Lead Text")
    expect(element.tagName).toBe("P")
    expect(element).toHaveClass("text-lg", "text-muted-foreground")
  })

  it("renders small variant correctly", () => {
    render(<Typography variant="small">Small Text</Typography>)
    const element = screen.getByText("Small Text")
    expect(element.tagName).toBe("SMALL")
    expect(element).toHaveClass("text-sm", "font-medium")
  })

  it("renders muted variant correctly", () => {
    render(<Typography variant="muted">Muted Text</Typography>)
    const element = screen.getByText("Muted Text")
    expect(element.tagName).toBe("P")
    expect(element).toHaveClass("text-sm", "text-muted-foreground")
  })

  it("renders caption variant correctly", () => {
    render(<Typography variant="caption">Caption Text</Typography>)
    const element = screen.getByText("Caption Text")
    expect(element.tagName).toBe("SPAN")
    expect(element).toHaveClass("text-xs", "text-muted-foreground")
  })

  it("renders code variant correctly", () => {
    render(<Typography variant="code">Code Text</Typography>)
    const element = screen.getByText("Code Text")
    expect(element.tagName).toBe("CODE")
    expect(element).toHaveClass("bg-muted", "font-mono")
  })

  it("renders as a custom tag when 'as' prop is provided", () => {
    render(<Typography as="section">Section Content</Typography>)
    const element = screen.getByText("Section Content")
    expect(element.tagName).toBe("SECTION")
  })

  it("combines custom className with variant classes", () => {
    render(<Typography className="custom-class">Content</Typography>)
    const element = screen.getByText("Content")
    expect(element).toHaveClass("custom-class", "text-foreground")
  })

  it("passes additional props to the underlying element", () => {
    render(<Typography id="test-id" aria-label="Test Label">Content</Typography>)
    const element = screen.getByText("Content")
    expect(element).toHaveAttribute("id", "test-id")
    expect(element).toHaveAttribute("aria-label", "Test Label")
  })
})
