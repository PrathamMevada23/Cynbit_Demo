import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentProps } from "react";

export function cn(...values: ClassValue[]) { return twMerge(clsx(values)); }

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:size-4",
  { variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-[#08645f]",
      outline: "border border-border bg-white text-foreground hover:bg-accent",
      ghost: "text-primary hover:bg-accent",
    },
  }, defaultVariants: { variant: "default" } }
);

export function Button({ className, variant, ...props }: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant }), className)} {...props} />;
}
