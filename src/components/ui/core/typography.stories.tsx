import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Typography } from "./typography"

const meta = {
  title: "UI/Core/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Typography primitives for consistent headings, body text, captions, and inline code. " +
          "Uses semantic Tailwind/theme classes (no raw colors).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "lead",
        "p",
        "small",
        "muted",
        "caption",
        "code",
      ],
      table: { category: "Style" },
    },
    as: {
      control: false,
      table: { category: "Polymorphic" },
      description: "Override the underlying element tag.",
    },
    className: { control: "text", table: { category: "Style" } },
    children: { control: "text", table: { category: "Content" } },
  },
  args: {
    variant: "p",
    children: "A quick brown fox jumps over the lazy dog.",
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <Typography {...args} />,
  play: async ({ canvas }) => {
    expect(
      canvas.getByText("A quick brown fox jumps over the lazy dog.")
    ).toBeInTheDocument()
  },
}

export const HeadingScale: Story = {
  render: () => (
    <div className="space-y-3">
      <Typography variant="h1">H1 Heading</Typography>
      <Typography variant="h2">H2 Heading</Typography>
      <Typography variant="h3">H3 Heading</Typography>
      <Typography variant="h4">H4 Heading</Typography>
      <Typography variant="lead">
        Lead text gives subtle hierarchy and reads well in intros.
      </Typography>
    </div>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByRole("heading", { name: "H1 Heading" })).toBeInTheDocument()
    expect(canvas.getByRole("heading", { name: "H2 Heading" })).toBeInTheDocument()
    expect(canvas.getByRole("heading", { name: "H3 Heading" })).toBeInTheDocument()
    expect(canvas.getByRole("heading", { name: "H4 Heading" })).toBeInTheDocument()
    expect(canvas.getByText(/lead text gives/i)).toBeInTheDocument()
  },
}

export const BodyText: Story = {
  render: () => (
    <div className="max-w-prose space-y-2">
      <Typography variant="p">
        This is body text. It should be readable and follow the app theme tokens.
      </Typography>
      <Typography variant="p">
        Paragraph spacing is applied via Tailwind utilities, keeping the rendering predictable.
      </Typography>
      <Typography variant="small">Small text is useful for subtle metadata.</Typography>
    </div>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText(/this is body text/i)).toBeInTheDocument()
    expect(canvas.getByText(/paragraph spacing/i)).toBeInTheDocument()
    expect(canvas.getByText(/small text/i)).toBeInTheDocument()
  },
}

export const MutedAndCaption: Story = {
  render: () => (
    <div className="space-y-2">
      <Typography variant="muted">Muted text for secondary descriptions.</Typography>
      <Typography variant="caption">Caption text for helper hints and footnotes.</Typography>
    </div>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText(/muted text/i)).toBeInTheDocument()
    expect(canvas.getByText(/caption text/i)).toBeInTheDocument()
  },
}

export const InlineCode: Story = {
  render: () => (
    <Typography variant="p">
      Override tokens like{" "}
      <Typography variant="code">--color-primary</Typography> in your app theme.
    </Typography>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText("--color-primary")).toBeInTheDocument()
  },
}

export const CustomElement: Story = {
  render: () => (
    <div className="space-y-2">
      <Typography variant="h2" as="div">
        Styled like H2, rendered as a div
      </Typography>
      <Typography variant="muted" as="span">
        Muted rendered as a span
      </Typography>
    </div>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText(/styled like h2/i).tagName.toLowerCase()).toBe("div")
    expect(canvas.getByText(/muted rendered/i).tagName.toLowerCase()).toBe("span")
  },
}

export const LongContentWrapping: Story = {
  render: () => (
    <div className="max-w-md space-y-3">
      <Typography variant="h3">
        A long heading that should wrap naturally across multiple lines without breaking layout
      </Typography>
      <Typography variant="p">
        This paragraph contains enough text to demonstrate wrapping behavior. It should remain readable,
        respect the theme colors, and avoid overflow in typical container widths.
      </Typography>
    </div>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText(/a long heading/i)).toBeInTheDocument()
    expect(canvas.getByText(/this paragraph contains/i)).toBeInTheDocument()
  },
}

