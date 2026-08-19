import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../forms/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  showDots?: boolean;
  showArrows?: boolean;
  dotsPosition?: "bottom" | "left" | "right";
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (index: number) => void;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      showDots = true,
      showArrows = true,
      dotsPosition,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
    const resolvedDotsPosition =
      dotsPosition ?? (orientation === "vertical" ? "right" : "bottom");

    const scrollTo = React.useCallback(
      (index: number) => api?.scrollTo(index),
      [api],
    );

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const onInit = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setScrollSnaps(api.scrollSnapList());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (orientation === "horizontal") {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollPrev();
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollNext();
          }
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          scrollNext();
        }
      },
      [orientation, scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onInit(api);
      onSelect(api);
      api.on("reInit", onInit);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api.off("reInit", onInit);
        api.off("reInit", onSelect);
        api.off("select", onSelect);
      };
    }, [api, onInit, onSelect]);

    const contextValue = React.useMemo(
      () => ({
        carouselRef,
        api,
        opts,
        showDots,
        showArrows,
        dotsPosition: resolvedDotsPosition,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
      }),
      [
        carouselRef,
        api,
        opts,
        showDots,
        showArrows,
        resolvedDotsPosition,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
      ],
    );

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className={cn("overflow-hidden", orientation === "vertical" && "h-full")}
    >
      <div
        ref={ref}
        className={cn(
          "flex h-full",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev, showArrows } = useCarousel();
  const Icon = orientation === "horizontal" ? ArrowLeft : ArrowUp;

  if (!showArrows) return null;

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext, showArrows } = useCarousel();
  const Icon = orientation === "horizontal" ? ArrowRight : ArrowDown;

  if (!showArrows) return null;

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

/**
 * CarouselDots — Pagination dot indicators below the carousel.
 * Each dot is a clickable circle; the active slide's dot is filled.
 *
 * @example
 * <Carousel setApi={setApi}>
 *   ...
 *   <CarouselDots />
 * </Carousel>
 */
const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { selectedIndex, scrollSnaps, scrollTo, showDots, orientation, dotsPosition } =
    useCarousel();

  if (!showDots) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === "horizontal" || dotsPosition === "bottom"
          ? "justify-center gap-1.5 pt-4"
          : "absolute top-1/2 -translate-y-1/2 flex-col gap-2",
        orientation === "vertical" && dotsPosition === "left" && "-left-8",
        orientation === "vertical" && dotsPosition === "right" && "-right-8",
        className,
      )}
      {...props}
    >
      {scrollSnaps.map((_, i) => {
        const isHorizontal = orientation === "horizontal" || dotsPosition === "bottom";
        const isActive = i === selectedIndex;
        let sizingClass = "";
        
        if (isActive) {
          sizingClass = isHorizontal ? "w-4 bg-primary" : "h-4 bg-primary";
        } else {
          sizingClass = isHorizontal ? "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60" : "h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60";
        }

        return (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-200",
              isHorizontal ? "h-1.5" : "w-1.5",
              sizingClass
            )}
          />
        );
      })}
    </div>
  );
});
CarouselDots.displayName = "CarouselDots";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
};
