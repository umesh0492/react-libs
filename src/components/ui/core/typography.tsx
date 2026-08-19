import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";

const typographyVariants = cva("text-foreground font-sans", {
  variants: {
    variant: {
      h1: "font-display scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "font-display scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "font-display scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "font-display scroll-m-20 text-xl font-semibold tracking-tight",
      lead: "text-lg text-muted-foreground",
      p: "leading-7 [&:not(:first-child)]:mt-4",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      caption: "text-xs text-muted-foreground",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>;

const defaultTagByVariant: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  lead: "p",
  p: "p",
  small: "small",
  muted: "p",
  caption: "span",
  code: "code",
};

type TypographyOwnProps = Omit<
  VariantProps<typeof typographyVariants>,
  "variant"
> & {
  as?: React.ElementType;
  variant?: TypographyVariant;
  children?: React.ReactNode;
};

type TypographyProps<T extends React.ElementType> = TypographyOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof TypographyOwnProps>;

type TypographyComponent = <T extends React.ElementType = "p">(
  props: TypographyProps<T>,
) => React.ReactElement | null;

const Typography: TypographyComponent = ({
  as,
  variant = "p",
  className,
  children,
  ...props
}) => {
  // eslint-disable-next-line security/detect-object-injection
  const Comp = as ?? defaultTagByVariant[variant];

  return (
    <Comp
      data-slot="typography"
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

export { Typography, typographyVariants };
