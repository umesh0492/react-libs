// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "../forms/button";
import { Input } from "../forms/input";
import { Label } from "../forms/label";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

type PopoverContentStoryArgs = React.ComponentProps<typeof PopoverContent>;

const meta = {
  title: "UI/Core/Popover",
  component: PopoverContent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A low-level Radix-based popover primitive for lightweight overlays such as contextual help, compact forms, and inline actions. `Popover` manages trigger and open-state behavior, while `PopoverContent` controls placement and surface presentation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      description:
        "Preferred side of the trigger to place the popover content.",
      table: { category: "Positioning" },
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      description: "Alignment of the popover content relative to the trigger.",
      table: { category: "Positioning" },
    },
    sideOffset: {
      control: { type: "number", min: 0, max: 24, step: 1 },
      description: "Spacing between the trigger and the popover content.",
      table: { category: "Positioning" },
    },
    className: {
      control: "text",
      description: "Additional classes for the popover surface.",
      table: { category: "Styling" },
    },
  },
  args: {
    side: "bottom",
    align: "start",
    sideOffset: 8,
    className: "",
  },
} satisfies Meta<typeof PopoverContent>;

export default meta;

type Story = StoryObj<typeof meta>;

function getStoryDocument(canvasElement: HTMLElement) {
  return within(canvasElement.ownerDocument.body);
}

function BasicPopover(
  args: PopoverContentStoryArgs & {
    body?: string;
    descriptionId: string;
    title?: string;
    titleId: string;
    triggerLabel?: string;
  },
) {
  const {
    body = "Use this surface for compact, contextual UI without leaving the current page.",
    descriptionId,
    title = "Popover title",
    titleId,
    triggerLabel = "Open popover",
    ...contentProps
  } = args;

  return (
    <Popover onOpenChange={fn()}>
      <PopoverTrigger asChild>
        <Button variant="outline" aria-label={triggerLabel}>
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        forceMount
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        {...contentProps}
      >
        <div className="space-y-2">
          <div className="space-y-1">
            <h4 id={titleId} className="text-sm font-semibold leading-none">
              {title}
            </h4>
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {body}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const Default: Story = {
  render: (args) => (
    <BasicPopover
      {...args}
      descriptionId="popover-default-description"
      titleId="popover-default-title"
      triggerLabel="More details"
      title="Shipping update"
      body="Your next dispatch is scheduled for tomorrow at 9:30 AM. Open the order panel if you need to adjust the delivery slot."
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "More details" }));

    const doc = getStoryDocument(canvasElement);
    expect(doc.getByText("Shipping update")).toBeInTheDocument();
    expect(
      doc.getByText(
        "Your next dispatch is scheduled for tomorrow at 9:30 AM. Open the order panel if you need to adjust the delivery slot.",
      ),
    ).toBeInTheDocument();
  },
};

export const Positions: Story = {
  parameters: {
    controls: {
      exclude: ["side"],
    },
    docs: {
      description: {
        story:
          "Compares all four popover sides at once, so the global `side` control is intentionally hidden for this story.",
      },
    },
  },
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side} onOpenChange={fn()}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-28 capitalize">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            forceMount
            aria-describedby={`popover-${side}-description`}
            aria-labelledby={`popover-${side}-title`}
            {...args}
            side={side}
          >
            <div className="space-y-1">
              <h4
                id={`popover-${side}-title`}
                className="text-sm font-semibold capitalize"
              >
                {side} popover
              </h4>
              <p
                id={`popover-${side}-description`}
                className="text-sm text-muted-foreground"
              >
                The popover prefers the {side} side and repositions if space is
                tight.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

export const Alignments: Story = {
  args: {
    side: "bottom",
  },
  parameters: {
    controls: {
      exclude: ["align"],
    },
    docs: {
      description: {
        story:
          "Compares `start`, `center`, and `end` alignment side by side, so the global `align` control is intentionally hidden for this story.",
      },
    },
  },
  render: (args) => (
    <div className="w-[520px] rounded-lg border bg-muted/20 p-8">
      <div className="flex justify-center">
        {(["start", "center", "end"] as const).map((align) => (
          <div key={align} className="flex-1 text-center">
            <Popover onOpenChange={fn()}>
              <PopoverTrigger asChild>
                <Button variant="outline">{align}</Button>
              </PopoverTrigger>
              <PopoverContent
                forceMount
                aria-describedby={`popover-align-${align}-description`}
                aria-labelledby={`popover-align-${align}-title`}
                {...args}
                align={align}
                side={args.side}
              >
                <div className="space-y-1">
                  <h4
                    id={`popover-align-${align}-title`}
                    className="text-sm font-semibold capitalize"
                  >
                    {align} aligned
                  </h4>
                  <p
                    id={`popover-align-${align}-description`}
                    className="text-sm text-muted-foreground"
                  >
                    This shows how content lines up against the trigger with the
                    {` ${align} `}alignment.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    className: "w-96",
  },
  render: (args) => (
    <Popover onOpenChange={fn()}>
      <PopoverTrigger asChild>
        <Button variant="outline">Read summary</Button>
      </PopoverTrigger>
      <PopoverContent
        forceMount
        aria-describedby="popover-long-description"
        aria-labelledby="popover-long-title"
        {...args}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 id="popover-long-title" className="text-sm font-semibold">
              Quarterly performance note
            </h4>
            <p
              id="popover-long-description"
              className="text-sm text-muted-foreground"
            >
              Organic traffic improved across all three regions, but the west
              zone still has delayed conversions because the latest campaign
              shipped with a narrower audience filter than planned.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Use a wider popover like this for structured explanatory content,
            quick summaries, or decision-support text where a tooltip would be
            too small and a dialog would be unnecessarily heavy.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Read summary" }));

    const doc = getStoryDocument(canvasElement);
    expect(doc.getByText("Quarterly performance note")).toBeInTheDocument();
    expect(
      doc.getByText(/Organic traffic improved across all three regions/),
    ).toBeInTheDocument();
  },
};

export const FormInPopover: Story = {
  render: (args) => (
    <Popover onOpenChange={fn()}>
      <PopoverTrigger asChild>
        <Button variant="outline">Quick invite</Button>
      </PopoverTrigger>
      <PopoverContent
        forceMount
        aria-describedby="popover-form-description"
        aria-labelledby="popover-form-title"
        {...args}
        className="w-80 space-y-4"
      >
        <div className="space-y-1">
          <h4 id="popover-form-title" className="text-sm font-semibold">
            Invite teammate
          </h4>
          <p
            id="popover-form-description"
            className="text-sm text-muted-foreground"
          >
            Add a collaborator without leaving the current workflow.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-email">Work email</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="alex@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-role">Role</Label>
          <Input id="invite-role" placeholder="Operations manager" />
        </div>

        <div className="flex justify-end gap-2">
          <PopoverClose asChild>
            <Button variant="ghost">Cancel</Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button variant="outline">Send invite</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Quick invite" }));

    const doc = getStoryDocument(canvasElement);
    expect(
      doc.getByRole("textbox", { name: "Work email" }),
    ).toBeInTheDocument();
    expect(doc.getByRole("textbox", { name: "Role" })).toBeInTheDocument();
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates controlling the open state externally, which is useful when the popover needs to react to surrounding UI or analytics hooks.",
      },
    },
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="text-sm text-muted-foreground">
          State:{" "}
          <span className="font-medium text-foreground">
            {open ? "Open" : "Closed"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={!open}
          >
            Close from outside
          </Button>

          <Popover
            open={open}
            onOpenChange={(nextOpen) => {
              setOpen(nextOpen);
            }}
          >
            <PopoverTrigger asChild>
              <Button variant="outline">
                {open ? "Close from trigger" : "Open from trigger"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              forceMount
              aria-describedby="popover-controlled-description"
              aria-labelledby="popover-controlled-title"
              {...args}
            >
              <div className="space-y-2">
                <h4
                  id="popover-controlled-title"
                  className="text-sm font-semibold"
                >
                  Controlled popover
                </h4>
                <p
                  id="popover-controlled-description"
                  className="text-sm text-muted-foreground"
                >
                  This popover is driven by React state instead of internal
                  Radix state.
                </p>
                <div className="flex justify-end">
                  <PopoverClose asChild>
                    <Button variant="ghost">Done</Button>
                  </PopoverClose>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: "Open from trigger" });

    await userEvent.click(trigger);
    expect(canvas.getByText("Open")).toBeInTheDocument();

    let doc = getStoryDocument(canvasElement);
    expect(doc.getByText("Controlled popover")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Close from outside" }),
    );
    expect(canvas.getByText("Closed")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Open from trigger" }),
    );
    doc = getStoryDocument(canvasElement);
    await userEvent.click(doc.getByRole("button", { name: "Done" }));
    expect(canvas.getByText("Closed")).toBeInTheDocument();
  },
};
