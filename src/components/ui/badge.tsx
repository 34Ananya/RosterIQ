import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "secondary" | "outline" | "destructive";

const variantClass: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-input bg-background",
  destructive: "bg-destructive text-destructive-foreground"
};

export function Badge({
  className,
  variant = "secondary",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variantClass[variant],
        className
      )}
      {...props}
    />
  );
}

