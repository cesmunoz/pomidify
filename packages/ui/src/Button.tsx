import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium text-white transition-colors hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-pink-500",
        primary: "bg-pink-500",
        secondary: "bg-pink-200",
        tertiary: "bg-pink-100",
        destructive: "bg-red-500",
        outline:
          "border border-pink-500 bg-transparent text-pink-600 hover:bg-pink-50",
        ghost: "bg-transparent text-pink-600 hover:bg-pink-50",
        link: "bg-transparent text-pink-600 underline-offset-4 hover:underline",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        success: "bg-green-500",
      },
      size: {
        default: "px-4 py-2 text-base",
        xs: "px-1 py-0.5 text-xs",
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const intentVariant = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  error: "error",
  warning: "warning",
  success: "success",
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  intent?: keyof typeof intentVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, intent, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const resolved = variant ?? (intent ? intentVariant[intent] : "default");

    return (
      <Comp
        className={cn(buttonVariants({ variant: resolved, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
