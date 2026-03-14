"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileDropzone({
  accept,
  onFile,
  className
}: {
  accept: string;
  onFile: (file: File) => void;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-sky-500/50 bg-slate-950/70 p-6 transition-all duration-150",
        dragOver
          ? "border-sky-400 bg-sky-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.5)]"
          : "hover:border-sky-400 hover:bg-slate-950/80",
        className
      )}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />

      <div className="flex flex-col items-center text-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-muted grid place-items-center">
          <UploadCloud className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium">Drop your roster here</div>
          <div className="text-sm text-muted-foreground">
            CSV and Excel accepted. We’ll preview before ingesting.
          </div>
        </div>
        <Button variant="outline" onClick={() => inputRef.current?.click()}>
          Choose file
        </Button>
      </div>
    </div>
  );
}

