import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { SCREENS } from "@/lib/screens";
import { Smartphone, Monitor, MonitorSmartphone, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const CATEGORIES = ["Onboarding", "Admin", "Commerçant", "Marketplace", "Checkout", "Post-commande", "Premium"] as const;

function DeviceBadge({ device }: { device: string }) {
  const Icon = device === "mobile" ? Smartphone : device === "desktop" ? Monitor : MonitorSmartphone;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2 py-0.5 text-[10px] font-medium text-navy">
      <Icon className="h-3 w-3" />
      {device}
    </span>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <section className="navy-panel relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          background: "radial-gradient(circle at 20% 20%, #FF8C00 0%, transparent 40%), radial-gradient(circle at 80% 80%, #FFA31A 0%, transparent 50%)",
        }} />
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <Logo variant="white" size={64} />
          <div className="mt-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              🇸🇳 Maquette UI/UX complète — 28 écrans
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-6xl font-extrabold text-white leading-[1.05]">
              La marketplace qui livre <span className="bg-gradient-to-r from-orange-light to-orange bg-clip-text text-transparent">tout le Sénégal</span>.
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-2xl">
              Design system moderne, minimaliste et professionnel — inspiré d'Amazon, Jumia, Shopify et Airbnb.
              Parcours acheteur, commerçant, admin et livreur.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/screens/home" className="btn-orange rounded-xl px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
                Voir la marketplace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/screens/admin" className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Dashboard admin
              </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[["28", "écrans conçus"], ["4", "types d'utilisateurs"], ["3", "modes de paiement"], ["100%", "responsive"]].map(([n, l]) => (
              <div key={l} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-display text-3xl font-extrabold text-orange-light">{n}</div>
                <div className="text-xs text-white/60 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-navy">Les 28 écrans</h2>
          <p className="text-muted-foreground mt-1">Cliquez sur une carte pour explorer la maquette.</p>
        </div>
        {CATEGORIES.map((cat) => {
          const list = SCREENS.filter((s) => s.category === cat);
          return (
            <div key={cat} className="mb-12">
              <div className="mb-4 flex items-baseline gap-3">
                <h3 className="font-display text-xl font-bold text-navy">{cat}</h3>
                <span className="text-xs text-muted-foreground">{list.length} écrans</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {list.map((s) => (
                  <Link key={s.id} to={s.path} className="group surface-card p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5">
                    <div className="flex items-start justify-between mb-4">
                      <span className="font-display text-xs font-bold text-orange">{s.num}</span>
                      <DeviceBadge device={s.device} />
                    </div>
                    <div className="mb-6 aspect-[4/3] rounded-lg bg-gradient-to-br from-navy to-navy-2 grid place-items-center relative overflow-hidden">
                      <span className="font-display text-4xl font-extrabold text-white/10">{s.num}</span>
                      <span className="absolute inset-x-4 bottom-4 text-white/90 text-sm font-semibold text-center">{s.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-navy">{s.title}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between flex-wrap gap-4">
          <Logo size={32} />
          <p className="text-xs text-muted-foreground">© 2026 SUNU MALL — Maquette UI/UX. Made in Dakar 🇸🇳</p>
        </div>
      </footer>
    </div>
  );
}
