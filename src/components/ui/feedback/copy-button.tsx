import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button, type ButtonProps } from "../forms/button";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  value: string;
  timeout?: number;
  onCopy?: () => void;
  showText?: boolean;
  copiedText?: string;
  defaultText?: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      timeout = 2000,
      onCopy,
      showText = false,
      copiedText = "Copied!",
      defaultText = "Copy",
      variant = "ghost",
      size = "icon",
      className,
      ...props
    },
    ref
  ) => {
    const [hasCopied, setHasCopied] = React.useState(false);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(value);
        setHasCopied(true);
        onCopy?.();
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    };

    React.useEffect(() => {
      if (!hasCopied) return;
      const timer = setTimeout(() => {
        setHasCopied(false);
      }, timeout);
      return () => clearTimeout(timer);
    }, [hasCopied, timeout]);

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={showText ? "sm" : size}
        onClick={handleCopy}
        aria-label={hasCopied ? copiedText : defaultText}
        className={cn(
          "transition-colors",
          hasCopied && "text-emerald-600 dark:text-emerald-400",
          className
        )}
        {...props}
      >
        {hasCopied ? (
          <Check className="h-4 w-4 stroke-[2.5]" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {showText && <span className="ml-1.5">{hasCopied ? copiedText : defaultText}</span>}
      </Button>
    );
  }
);

CopyButton.displayName = "CopyButton";
