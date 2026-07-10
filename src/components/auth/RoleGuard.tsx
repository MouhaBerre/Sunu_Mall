"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore, type UserRole } from "@/store/useStore";
import { Loader2 } from "lucide-react";

/**
 * Client-side role guard (frontend mock auth).
 * Redirects to /login?next=<path> when the user is not authenticated
 * or does not have one of the allowed roles.
 */
export function RoleGuard({ roles, children }: { roles: UserRole[]; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useStore((s) => s.user);
  const hasHydrated = useStore((s) => s.hasHydrated);

  const allowed = !!user && roles.includes(user.role);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!allowed) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hasHydrated, allowed, router, pathname]);

  if (!hasHydrated || !allowed) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-orange" />
          <p className="text-sm">Vérification de l'accès…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
