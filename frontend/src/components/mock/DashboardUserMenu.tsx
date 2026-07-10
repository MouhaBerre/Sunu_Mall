"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useStore } from "@/store/useStore";

const ROLE_LABELS: Record<string, string> = {
  client: "Client",
  vendeur: "Vendeur",
  livreur: "Livreur",
  admin: "Super Admin",
};

export function DashboardUserMenu({ fallback }: { fallback: { name: string; role: string } }) {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  const name = user?.name ?? fallback.name;
  const role = user ? (ROLE_LABELS[user.role] ?? user.role) : fallback.role;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 hover:bg-muted">
        <div className="h-8 w-8 rounded-full bg-navy grid place-items-center text-white text-xs font-bold">{name.charAt(0)}</div>
        <div className="text-xs text-left">
          <div className="font-semibold">{name}</div>
          <div className="text-muted-foreground">{role}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-elevated z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-navy truncate">{name}</p>
              {user?.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
            </div>
            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-navy hover:bg-muted">
              <UserIcon className="h-4 w-4" /> Mon profil
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 border-t border-border">
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
