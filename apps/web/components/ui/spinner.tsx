"use client";

import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  className?: string;
  label?: string;
};

export default function Spinner({ size = 20, className, label }: Props) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
  };
  return (
    <div className={cn("inline-flex items-center gap-2", className)} aria-live="polite" aria-busy="true">
      <div
        className="animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
        style={style}
        role="status"
        aria-label={label || "Laddar"}
      />
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
    </div>
  );
}

