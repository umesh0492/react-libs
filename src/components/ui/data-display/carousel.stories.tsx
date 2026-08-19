// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "./carousel";

/**
 * A swipeable carousel built on the Embla Carousel engine.
 *
 * **Phase 3 additions:**
 * - `CarouselDots` — pagination dot indicator bar below the carousel
 *   - Active dot grows to `w-4` with `bg-primary`
 *   - Inactive dots are `w-1.5 bg-muted-foreground/30`, hoverable
 *   - Each dot is clickable (scrolls directly to that slide)
 * - `selectedIndex` and `scrollSnaps` now tracked from Embla API
 */
const meta = {
  title: "UI/Data-display/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Embla Carousel wrapper. Add `CarouselDots` below `CarouselContent` for pagination indicators. " +
          "Keyboard navigation (← →) is built in. Use `opts={{ loop: true }}` to wrap.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      table: { category: "Config", defaultValue: { summary: "horizontal" } },
    },
    showDots: {
      control: "boolean",
      description: "Controls whether pagination dots are rendered.",
      table: { category: "Config", defaultValue: { summary: "true" } },
    },
    showArrows: {
      control: "boolean",
      description:
        "Controls whether previous and next arrow buttons are rendered.",
      table: { category: "Config", defaultValue: { summary: "true" } },
    },
    dotsPosition: {
      control: "inline-radio",
      options: ["bottom", "left", "right"],
      description:
        "Controls where pagination dots appear. `left` and `right` are primarily intended for vertical carousels.",
      table: {
        category: "Config",
        defaultValue: { summary: "horizontal: bottom, vertical: right" },
      },
    },
  },
  args: {
    orientation: "horizontal",
    showDots: true,
    showArrows: true,
    dotsPosition: "bottom",
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const SLIDES = [
  {
    title: "Agro Supplies Co.",
    subtitle: "Fresh produce · Delhi",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  {
    title: "Metro Grains Ltd.",
    subtitle: "Bulk grains · Mumbai",
    bg: "bg-amber-50  dark:bg-amber-950/20",
  },
  {
    title: "South Agrotech",
    subtitle: "Spices & rice · Chennai",
    bg: "bg-rose-50   dark:bg-rose-950/20",
  },
  {
    title: "Punjab Farms",
    subtitle: "Wheat & dairy · Ludhiana",
    bg: "bg-sky-50    dark:bg-sky-950/20",
  },
  {
    title: "Deccan Organic",
    subtitle: "Certified organic · Pune",
    bg: "bg-violet-50 dark:bg-violet-950/20",
  },
];

function getCarouselFrameClassName(orientation: "horizontal" | "vertical") {
  return orientation === "vertical"
    ? "p-8 w-[320px] h-[240px]"
    : "p-10 w-[420px]";
}

function getCarouselClassName(orientation: "horizontal" | "vertical") {
  return orientation === "vertical" ? "w-full h-full" : "w-full";
}

function getSlideCardClassName(
  orientation: "horizontal" | "vertical",
  baseClassName: string,
) {
  return `${baseClassName} ${orientation === "vertical" ? "h-full" : ""}`;
}

/** Standard carousel with prev/next arrows. */
export const Default: Story = {
  args: {
    showDots: false,
    showArrows: true,
  },
  render: (args) => (
    <div className={getCarouselFrameClassName(args.orientation)}>
      <Carousel {...args} className={getCarouselClassName(args.orientation)}>
        <CarouselContent>
          {SLIDES.map((s, i) => (
            <CarouselItem key={i}>
              <div
                className={getSlideCardClassName(
                  args.orientation,
                  `rounded-xl border ${s.bg} p-8 flex flex-col gap-1 h-40`,
                )}
              >
                <p className="text-lg font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.subtitle}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[role="region"]')).toBeInTheDocument();
    const buttons = canvasElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  },
};

/**
 * With dot indicators — `CarouselDots` renders below the slides.
 * Active dot is wider (`w-4`); click any dot to jump to that slide.
 */
export const WithDots: Story = {
  args: {
    showDots: true,
    showArrows: true,
    dotsPosition: "bottom",
  },
  render: (args) => (
    <div className={getCarouselFrameClassName(args.orientation)}>
      <Carousel {...args} className={getCarouselClassName(args.orientation)}>
        <CarouselContent>
          {SLIDES.map((s, i) => (
            <CarouselItem key={i}>
              <div
                className={getSlideCardClassName(
                  args.orientation,
                  `rounded-xl border ${s.bg} p-8 flex flex-col gap-1 h-40`,
                )}
              >
                <p className="text-lg font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.subtitle}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Active dot = wide primary pill. Others are small muted circles. All are clickable.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll('[aria-label*="slide" i]');
    expect(dots.length).toBeGreaterThanOrEqual(SLIDES.length);
  },
};

/** Dots only — no arrow buttons (useful for marketing carousels). */
export const DotsOnly: Story = {
  args: {
    showDots: true,
    showArrows: false,
    dotsPosition: "bottom",
  },
  render: (args) => (
    <div
      className={
        args.orientation === "vertical"
          ? "p-6 w-[320px] h-[420px]"
          : "p-6 w-[420px]"
      }
    >
      <Carousel
        {...args}
        opts={{ loop: true }}
        className={getCarouselClassName(args.orientation)}
      >
        <CarouselContent>
          {SLIDES.map((s, i) => (
            <CarouselItem key={i}>
              <div
                className={getSlideCardClassName(
                  args.orientation,
                  `rounded-xl border ${s.bg} p-8 flex flex-col gap-2 h-44`,
                )}
              >
                <p className="text-xl font-bold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.subtitle}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

/** Multi-slide view — 3 cards at a time via `basis-1/3`. */
export const MultipleSlides: Story = {
  args: {
    showDots: true,
    showArrows: true,
    dotsPosition: "bottom",
  },
  render: (args) => (
    <div
      className={
        args.orientation === "vertical"
          ? "p-8 w-[320px] h-[460px]"
          : "p-10 w-[560px]"
      }
    >
      <Carousel {...args} className={getCarouselClassName(args.orientation)}>
        <CarouselContent
          className={args.orientation === "vertical" ? "-mt-2" : "-ml-2"}
        >
          {SLIDES.map((s, i) => (
            <CarouselItem
              key={i}
              className={
                args.orientation === "vertical"
                  ? "pt-2 basis-1/3"
                  : "pl-2 basis-1/3"
              }
            >
              <div
                className={`rounded-lg border ${s.bg} p-4 h-28 flex flex-col gap-1`}
              >
                <p className="text-sm font-semibold truncate">{s.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.subtitle}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

/** Looping with dots — wraps back to first slide. */
export const Looping: Story = {
  args: {
    opts: { loop: true },
    showDots: true,
    showArrows: true,
    dotsPosition: "bottom",
  },
  render: (args) => (
    <div className={getCarouselFrameClassName(args.orientation)}>
      <Carousel {...args} className={getCarouselClassName(args.orientation)}>
        <CarouselContent>
          {SLIDES.map((s, i) => (
            <CarouselItem key={i}>
              <div
                className={getSlideCardClassName(
                  args.orientation,
                  `rounded-xl border ${s.bg} p-8 flex flex-col gap-1 h-40`,
                )}
              >
                <p className="text-lg font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.subtitle}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};
