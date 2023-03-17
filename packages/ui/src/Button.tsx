import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
  "rounded-md text-white hover:bg-pink-600 focus:ring-pink-600 px-4 py-2",
  {
    variants: {
      intent: {
        primary: "bg-pink-500",
        secondary: "bg-pink-200",
        tertiary: "bg-pink-100",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        success: "bg-green-500",
      },
      size: {
        xs: "text-xs px-1 py-0.5",
        sm: "text-sm px-2 py-1",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3",
        xl: "text-xl px-8 py-4",
        "2xl": "text-2xl px-10 py-5",
        "3xl": "text-3xl px-12 py-6",
        "4xl": "text-4xl px-14 py-7",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

type ButtonProps = VariantProps<typeof buttonStyles> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  intent = "primary",
  className,
  children,
  size,
  ...rest
}: ButtonProps) => (
  <button
    className={twMerge(
      buttonStyles({
        intent,
        size,
        className,
      })
    )}
    {...rest}
  >
    {children}
  </button>
);
