// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent, waitFor } from "storybook/test";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

/**
 * A vertically stacked set of interactive headings that each reveal content.
 *
 * **Phase 3 fixes:**
 * - `hover:underline` replaced with `hover:bg-muted/50` — more conventional, no text decoration jitter
 * - Last `AccordionItem` no longer renders a stray bottom border (`last:border-b-0`)
 * - Content text uses `text-muted-foreground` + `leading-relaxed` for better readability
 */
const meta = {
  title: "UI/Data-display/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Accessible accordion built on Radix UI. Use `type="single"` with `collapsible` ' +
          'to allow closing, or `type="multiple"` to keep panels independently open.',
      },
    },
  },
  tags: ["autodocs"],
  args: {
    type: "single",
    collapsible: true,
    disabled: false,
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      description:
        "`single` allows only one open panel; `multiple` allows many.",
      table: { category: "Behaviour", defaultValue: { summary: "single" } },
    },
    collapsible: {
      control: "boolean",
      description:
        'When `type="single"`, allows the open panel to be collapsed.',
      table: { category: "Behaviour", defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables all items.",
      table: { category: "State", defaultValue: { summary: "false" } },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const faqItems = [
  {
    value: "what",
    question: "What is this component library?",
    answer:
      "A curated set of accessible, themeable React UI primitives built on Radix UI and Tailwind CSS.",
  },
  {
    value: "open-source",
    question: "Is it open source?",
    answer: "Yes — MIT licensed and free for personal and commercial use.",
  },
  {
    value: "customize",
    question: "Can I customize the styles?",
    answer:
      "Absolutely. All components accept className overrides and are styled via CSS variables.",
  },
  {
    value: "ts",
    question: "Does it support TypeScript?",
    answer: "Yes — every component ships with full TypeScript types.",
  },
];

/**
 * FAQ-style — only one panel open at a time.
 * Notice the last item has no bottom border (fixed `last:border-b-0`).
 */
export const SingleCollapsible: Story = {
  render: (args) => (
    <div className="w-[480px] p-4">
      <Accordion type="single" collapsible>
        {faqItems.map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("What is this component library?"));
    await waitFor(() =>
      expect(canvas.getByText(/curated set/i)).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByText("Is it open source?"));
    await waitFor(() =>
      expect(canvas.getByText(/MIT licensed/i)).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByText("Is it open source?"));
  },
};

/** Multiple mode — several panels can stay open simultaneously. */
export const MultipleOpen: Story = {
  render: () => (
    <div className="w-[480px] p-4">
      <Accordion type="multiple" defaultValue={["what", "ts"]}>
        {faqItems.map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: { story: "Two items (`what` and `ts`) open by default." },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText(/curated set/i)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(canvas.getByText(/full TypeScript/i)).toBeInTheDocument(),
    );
    await userEvent.click(canvas.getByText("Can I customize the styles?"));
    await waitFor(() =>
      expect(canvas.getByText(/CSS variables/i)).toBeInTheDocument(),
    );
  },
};

/**
 * Hover highlight comparison — hover over different items to see `bg-muted/50`
 * background instead of the old text-underline.
 */
export const HoverState: Story = {
  render: (args) => (
    <div className="w-[480px] p-4 border rounded-xl bg-card">
      <p className="text-xs text-muted-foreground mb-3 px-1">
        Hover over items — background highlights, NO underline ✓
      </p>
      <Accordion collapsible {...args}>
        {faqItems.slice(0, 3).map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

/** Nested in a card — last item cleanly ends without double-border. */
export const InCard: Story = {
  render: (args) => (
    <div className="w-[480px] p-5 border rounded-xl shadow-sm bg-card">
      <h2 className="font-semibold text-base mb-4">
        Frequently Asked Questions
      </h2>
      <Accordion collapsible {...args}>
        {faqItems.slice(0, 3).map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};
