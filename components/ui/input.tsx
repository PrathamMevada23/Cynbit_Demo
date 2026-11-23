import type { ComponentProps } from "react";
import { cn } from "./button";

export const fieldStyle = "min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground aria-invalid:border-[#ad3038]";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input data-slot="input" className={cn(fieldStyle, className)} {...props} />;
}
