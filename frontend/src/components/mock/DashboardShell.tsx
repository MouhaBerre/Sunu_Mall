import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import { DashboardUserMenu } from "@/components/mock/DashboardUserMenu";

interface NavItem {
  label: string;
  icon: ReactNode;
  active?: boolean;
  badge?: string;
  href?: string;
}

export function DashboardShell({
  nav,
  title,
  subtitle,
  actions,
  children,
  user = { name: "Ousmane Sall", role: "Admin Super" },
}: {
  nav: NavItem[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  user?: { name: string; role: string };
}) {
  return (
    <div className="flex min-h-[820px] bg-background">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 navy-panel flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Logo variant="white" size={36} />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item, i) => {
            const className = cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors",
              item.active
                ? "bg-orange text-white shadow-orange"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            );
            const inner = (
              <>
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">{item.badge}</span>
                )}
              </>
            );
            return item.href ? (
              <Link key={i} href={item.href} className={className}>{inner}</Link>
            ) : (
              <div key={i} className={className}>{inner}</div>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-white/50">v1.0 • Dakar 🇸🇳</div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center gap-4 border-b border-border bg-card px-8 py-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-orange"
              placeholder="Rechercher..."
            />
          </div>
          <button className="relative rounded-lg border border-border bg-card p-2 hover:bg-muted">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-orange text-[10px] text-white grid place-items-center">3</span>
          </button>
          <DashboardUserMenu fallback={user} />
        </header>
        <div className="flex-1 p-8">
          <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-navy">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            <div className="flex gap-2">{actions}</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
