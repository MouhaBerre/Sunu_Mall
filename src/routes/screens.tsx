import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SCREENS } from "@/lib/screens";

export const Route = createFileRoute("/screens")({
  component: ScreensLayout,
});

function ScreensLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentIndex = SCREENS.findIndex((s) => s.path === pathname);
  const current = SCREENS[currentIndex];
  const prev = currentIndex > 0 ? SCREENS[currentIndex - 1] : null;
  const next = currentIndex < SCREENS.length - 1 ? SCREENS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-navy">
            <ArrowLeft className="h-4 w-4" /> Galerie
          </Link>
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-border">
            <Logo size={28} showWordmark={false} />
            {current && (
              <>
                <span className="font-display text-sm font-bold text-orange">{current.num}</span>
                <span className="text-sm font-semibold text-navy">{current.title}</span>
                <span className="text-xs text-muted-foreground">• {current.category}</span>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {prev && (
              <Link to={prev.path} className="rounded-lg border border-border bg-card p-2 hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}
            <span className="text-xs text-muted-foreground tabular-nums">{currentIndex + 1} / {SCREENS.length}</span>
            {next && (
              <Link to={next.path} className="rounded-lg border border-border bg-card p-2 hover:bg-muted">
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}
