import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PhoneFrame({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {label && <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>}
      <div className="relative w-[360px] h-[740px] rounded-[42px] bg-[#0A163A] p-[10px] shadow-elevated">
        <div className="absolute left-1/2 top-3 z-20 h-6 w-32 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-background">
          <div className="h-full w-full overflow-y-auto scrollbar-hide">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-foreground">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span>●●●●</span>
        <span>100%</span>
      </span>
    </div>
  );
}
