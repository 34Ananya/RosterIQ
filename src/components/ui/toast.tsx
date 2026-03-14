import * as React from "react";
import { cn } from "@/lib/cn";

export type ToastType = "info" | "success" | "error";

export interface Toast {
  id: number;
  title?: string;
  message: string;
  type: ToastType;
}

type ToastContextValue = {
  push: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const push = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 sm:items-end sm:pr-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg shadow-black/40 backdrop-blur bg-slate-900/90",
              t.type === "success" && "border-emerald-500/70",
              t.type === "error" && "border-rose-500/70",
              t.type === "info" && "border-sky-500/70"
            )}
          >
            {t.title && <div className="font-medium mb-1">{t.title}</div>}
            <div className="text-muted-foreground">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

