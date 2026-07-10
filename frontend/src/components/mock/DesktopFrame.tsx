import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function DesktopFrame({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div className={cn("flex w-full flex-col items-stretch gap-3", className)}>
      {label && <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>}
      <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <div className="ml-4 flex-1 rounded-md bg-card px-3 py-1 text-xs text-muted-foreground border border-border">
            sunumall.sn
          </div>
        </div>
        <div className="bg-background">{children}</div>
      </div>
    </div>
  );
}
