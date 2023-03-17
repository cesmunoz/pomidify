import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const typographyStyles = cva("font-sans text-black", {
  variants: {
    intent: {
      base: "text-black",
      primary: "text-pink-500",
      secondary: "text-pink-200",
      tertiary: "text-red-600",
      error: "text-red-500",
      warning: "text-yellow-500",
      success: "text-green-500",
    },
  },
  defaultVariants: {
    intent: "base",
  },
});

type TypographyProps = VariantProps<typeof typographyStyles> &
  React.HTMLAttributes<HTMLDivElement>;

export const Typography = ({
  intent = "base",
  className,
  children,
  ...rest
}: TypographyProps) => (
  <div
    className={twMerge(
      typographyStyles({
        intent,
        className,
      })
    )}
    {...rest}
  >
    {children}
  </div>
);
