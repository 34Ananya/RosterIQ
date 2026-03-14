import * as React from "react";
import { cn } from "@/lib/cn";

export type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: "right" | "left";
  widthClassName?: string;
};

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = "right",
  widthClassName = "w-[520px] max-w-[92vw]"
}: SheetProps) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close panel"
        className="absolute inset-0 bg-black/30"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute top-0 h-full bg-card shadow-2xl border flex flex-col",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          widthClassName
        )}
      >
        {(title || description) && (
          <div className="p-5 border-b">
            {title && <div className="text-sm font-semibold">{title}</div>}
            {description && (
              <div className="text-sm text-muted-foreground mt-1">{description}</div>
            )}
          </div>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

