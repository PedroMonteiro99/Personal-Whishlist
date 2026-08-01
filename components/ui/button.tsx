import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = {
  default:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-ring",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive",
  outline:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:ring-ring",
  ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
