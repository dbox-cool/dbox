import { forwardRef } from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/dbox/utils/cn";

/** All Style Variants */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border border-primary",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive",
        outline:
          "bg-transparent text-text-secondary border border-secondary",
        "outline-primary":
          "border border-primary bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "text-primary border-none",
        "icon-destructive": "text-destructive border-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-6 rounded-md px-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "p-0",
      },
      hover: {
        default: "",
        outline:
          "hover:bg-background hover:text-primary hover:border hover:border-primary",
        "outline-destructive": "hover:bg-background hover:text-destructive hover:border hover:border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "default",
    },
  }
);

/**
 * @typedef  {object|HTMLButtonElement} ButtonProps
 * @property {string}  className tw clases
 * @property {"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}  variant default | destructive | outline | secondary | ghost | link
 * @property {"default" | "outline" | "outline-destructive"}  hover default | outline | (TODO: destructive | secondary | ghost | link )
 * @property {"icon" | "sm" | "default" | "lg"}  size icon | sm | default | lg
 * @property {boolean} asChild
 * @property {Element} children JSX Elements inside the Button
 */

const Button = forwardRef(
  /**
   * @param {ButtonProps} props
   * @param {import("react").Ref<HTMLButtonElement>} ref Reference to the Component
   * @returns {Element}
   */
  ({ className, variant, hover, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, hover, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;

export { Button };
