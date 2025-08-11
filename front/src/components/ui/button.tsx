import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 active:shadow-sm",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 active:shadow-sm focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:border-accent-foreground/20 dark:bg-transparent dark:border-input dark:hover:bg-input/50 hover:translate-y-[-1px] active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 active:shadow-sm",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-sm dark:hover:bg-accent/50 hover:backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        agentic:
          "bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 text-white shadow-lg hover:shadow-2xl hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 transform hover:scale-105 active:scale-100 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        "agentic-outline":
          "border-2 border-transparent bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-blue-600 dark:text-blue-400 hover:from-blue-500/30 hover:to-purple-600/30 hover:border-blue-500/50 hover:shadow-lg backdrop-blur-sm hover:translate-y-[-1px] active:translate-y-0",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-7 has-[>svg]:px-5 text-base",
        xl: "h-14 rounded-xl px-10 has-[>svg]:px-8 text-lg",
        icon: "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
