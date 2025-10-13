"use client";

import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ToastVariant = "neutral" | "success" | "warning" | "destructive";

export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastState = {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  action?: { label: string; onClick: () => void };
};

type ToastContextValue = {
  push: (toast: ToastOptions) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  neutral: "border-border/80 bg-card text-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
};

const variantAccent: Record<ToastVariant, string> = {
  neutral: "bg-primary/80",
  success: "bg-emerald-500/90",
  warning: "bg-amber-500/90",
  destructive: "bg-destructive",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [mounted, setMounted] = useState(false);
  const timeouts = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    setMounted(true);
    const map = timeouts.current;
    return () => {
      map.forEach((timeout) => window.clearTimeout(timeout));
      map.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timeoutId = timeouts.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeouts.current.delete(id);
    }
  }, []);

  const push = useCallback(
    ({ id, title, description, variant = "neutral", duration = 4000, action }: ToastOptions) => {
      const toastId = id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const state: ToastState = {
        id: toastId,
        title: title ?? "",
        description: description ?? "",
        variant,
        duration,
        action,
      };

      setToasts((current) => {
        const next = current.filter((toast) => toast.id !== toastId);
        return [...next, state];
      });

      if (duration > 0) {
        const timeoutId = window.setTimeout(() => dismiss(toastId), duration);
        timeouts.current.set(toastId, timeoutId);
      }

      return toastId;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex max-w-sm flex-col gap-3">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={cn(
                    "pointer-events-auto overflow-hidden rounded-xl border shadow-lg shadow-black/10",
                    variantStyles[toast.variant],
                  )}
                >
                  <div className="flex items-start gap-3 p-4">
                    <div className={cn("mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full", variantAccent[toast.variant])} />
                    <div className="min-w-0 flex-1">
                      {toast.title ? <p className="text-sm font-semibold leading-5">{toast.title}</p> : null}
                      {toast.description ? (
                        <p className="mt-1 text-sm leading-5 opacity-90">
                          {toast.description}
                        </p>
                      ) : null}
                      {toast.action ? (
                        <button
                          type="button"
                          onClick={() => {
                            dismiss(toast.id);
                            toast.action?.onClick();
                          }}
                          className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                          {toast.action.label}
                        </button>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => dismiss(toast.id)}
                      className="text-muted-foreground transition hover:text-foreground"
                      aria-label="Stäng notis"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast måste användas inom en ToastProvider");
  }
  return ctx;
}
