import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-surface-subtle text-foreground hover:bg-primary-subtle",
        outline: "border border-input bg-surface text-foreground hover:border-primary hover:bg-primary-subtle",
        ghost: "text-foreground hover:bg-surface-subtle",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
        link: "text-primary underline-offset-4 hover:underline",
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive: "bg-danger text-danger-foreground hover:bg-danger/90",
        hero: "bg-accent text-accent-foreground hover:bg-accent/90",
        heroOutline: "border border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/10",
        success: "bg-success text-success-foreground hover:bg-success/90",
        info: "bg-info text-info-foreground hover:bg-info/90",
      },
      size: {
        sm: "min-h-9 px-3 text-sm",
        md: "min-h-11 px-4 text-sm",
        lg: "min-h-12 px-6 text-base",
        default: "min-h-11 px-4 text-sm",
        xl: "min-h-12 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
