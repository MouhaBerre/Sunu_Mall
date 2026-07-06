import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { SCREENS } from "@/lib/screens";
import {
  Smartphone, Monitor, MonitorSmartphone, ArrowRight, ShoppingBag, Store, Bike, Shield,
  Sparkles, Truck, CreditCard, MapPin,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SUNU MALL — La marketplace du Sénégal 🇸🇳" },
      { name: "description", content: "SUNU MALL : marketplace sénégalaise moderne. Achats, livraison temps réel, paiements Wave, Orange Money, carte bancaire. 31 écrans mobile & desktop." },
    ],
  }),
  component: Index,
});

const CATEGORIES = ["Onboarding", "Admin", "Commerçant", "Livreur", "Marketplace", "Checkout", "Post-commande", "Premium"] as const;

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
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 15% 15%, rgba(255,140,0,0.3), transparent 40%), radial-gradient(circle at 85% 90%, rgba(255,163,26,0.25), transparent 45%)",
        }} />
        <header className="relative mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Logo variant="white" size={44} />
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#roles" className="hover:text-white">Rôles</a>
            <a href="#features" className="hover:text-white">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white">Abonnements</a>
            <a href="#screens" className="hover:text-white">Écrans</a>
          </nav>
          <Link to="/screens/home" className="btn-orange rounded-xl px-4 py-2 text-xs font-bold">
            Voir la démo
          </Link>
        </header>

        <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-24 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div className="fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1 text-xs font-medium text-white/90">
              🇸🇳 Dakar · Thiès · Saint-Louis · Ziguinchor
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl font-extrabold text-white leading-[1.05]">
              La marketplace<br />qui livre <span className="bg-gradient-to-r from-orange-light to-orange bg-clip-text text-transparent">tout le Sénégal</span>.
            </h1>
            <p className="mt-5 text-lg text-white/75 max-w-xl leading-relaxed">
              Commandez chez plusieurs boutiques d'un seul coup, payez en Wave ou Orange Money, suivez votre livreur en temps réel — le tout dans une app conçue pour le Sénégal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/screens/home" className="btn-orange rounded-xl px-6 py-3.5 text-sm font-semibold inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Explorer la marketplace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/screens/driver-dashboard" className="rounded-xl border border-white/20 bg-white/5 backdrop-blur px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 inline-flex items-center gap-2">
                <Bike className="h-4 w-4" /> Espace livreur
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              {[["31", "écrans conçus"], ["4", "rôles utilisateurs"], ["3", "paiements"], ["100%", "made in 🇸🇳"]].map(([n, l], i) => (
                <div key={l} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="font-display text-3xl font-extrabold text-orange-light">{n}</div>
                  <div className="text-xs text-white/60 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup floating */}
          <div className="relative hidden md:block fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="absolute -inset-4 bg-orange/20 blur-3xl rounded-full" />
            <div className="relative mx-auto w-[280px] h-[560px] rounded-[38px] bg-navy p-2 shadow-navy-glow rotate-3">
              <div className="h-full w-full rounded-[32px] bg-background overflow-hidden">
                <div className="navy-panel px-5 pt-6 pb-8">
                  <p className="text-white/70 text-[11px]">Bonjour Aminata 👋</p>
                  <p className="text-white font-display font-extrabold text-lg">Que cherchez-vous aujourd'hui ?</p>
                  <div className="mt-4 rounded-xl bg-white/95 flex items-center gap-2 px-3 py-2.5">
                    <span className="text-navy text-xs">🔍 Bissap, boubou, Infinix...</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-[11px] font-bold text-navy">🔥 Tendance à Dakar</p>
                  {[
                    { n: "Infinix Hot 40 Pro", s: "Sen'Tech", p: "129 000 F", g: "from-navy to-navy-2" },
                    { n: "Boubou Sereer brodé", s: "Sandaga", p: "45 000 F", g: "from-orange to-orange-light" },
                    { n: "Café Touba 250g", s: "Casamance Bio", p: "1 800 F", g: "from-orange-dark to-navy" },
                  ].map((p) => (
                    <div key={p.n} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${p.g}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-navy truncate">{p.n}</p>
                        <p className="text-[10px] text-muted-foreground">{p.s}</p>
                      </div>
                      <p className="text-[10px] font-bold text-orange">{p.p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ROLES ============ */}
      <section id="roles" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-orange uppercase tracking-widest">4 rôles authentifiés</span>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-navy">Un espace pour chacun</h2>
          <p className="mt-3 text-muted-foreground">Client, Commerçant, Livreur, Administrateur — SUNU MALL orchestre toute la chaîne.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: ShoppingBag, title: "Client", desc: "Panier multi-boutiques, paiement Wave/OM/CB, suivi GPS.", path: "/screens/home", tone: "orange" },
            { icon: Store, title: "Commerçant", desc: "Gestion catalogue, livreurs affiliés, analytics avancées.", path: "/screens/merchant", tone: "navy" },
            { icon: Bike, title: "Livreur", desc: "Courses assignées, itinéraire GPS, preuve de livraison.", path: "/screens/driver-dashboard", tone: "orange" },
            { icon: Shield, title: "Administrateur", desc: "Validation boutiques, commissions, modération globale.", path: "/screens/admin", tone: "navy" },
          ].map((r, i) => (
            <Link
              key={r.title}
              to={r.path}
              className="group surface-card p-6 hover-lift fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`h-12 w-12 rounded-xl grid place-items-center ${r.tone === "orange" ? "bg-orange/10 text-orange" : "bg-navy/10 text-navy"}`}>
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display font-bold text-navy text-lg">{r.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-orange group-hover:gap-2 transition-all">
                Voir l'espace <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CreditCard, title: "Wave · OM · CB", desc: "3 moyens de paiement locaux avec transactions ACID." },
              { icon: MapPin, title: "GPS temps réel", desc: "Suivi de la livraison du point A au point B, notifications live." },
              { icon: Truck, title: "Multi-boutiques", desc: "Un seul panier pour plusieurs boutiques, une livraison par vendeur." },
              { icon: Sparkles, title: "Produits sponsorisés", desc: "Boostez votre visibilité avec un badge et un meilleur ranking." },
              { icon: Store, title: "Livreurs affiliés", desc: "Chaque commerçant gère et affecte ses propres livreurs." },
              { icon: Shield, title: "Validation admin", desc: "Toute nouvelle boutique passe par la validation de la plateforme." },
            ].map((f, i) => (
              <div key={f.title} className="flex gap-4 fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="h-11 w-11 shrink-0 rounded-xl bg-orange/10 grid place-items-center">
                  <f.icon className="h-5 w-5 text-orange" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-navy">{f.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-orange uppercase tracking-widest">Monétisation</span>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-navy">Un abonnement adapté à chaque boutique</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { name: "Standard", price: "Gratuit", quota: "20 produits", perks: ["Fonctionnalités de base", "Support par email"], featured: false },
            { name: "Premium", price: "15 000 F/mois", quota: "200 produits", perks: ["Statistiques avancées", "Meilleure visibilité", "Support prioritaire"], featured: true },
            { name: "Premium+", price: "35 000 F/mois", quota: "Produits illimités", perks: ["Dashboard analytics complet", "Ventes en temps réel", "Mise en avant prioritaire"], featured: false },
          ].map((p) => (
            <div key={p.name} className={`relative rounded-2xl p-6 ${p.featured ? "navy-panel shadow-elevated" : "surface-card"}`}>
              {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-sponsored">POPULAIRE</span>}
              <p className={`text-xs font-bold uppercase tracking-widest ${p.featured ? "text-orange-light" : "text-orange"}`}>{p.name}</p>
              <p className={`mt-2 font-display text-3xl font-extrabold ${p.featured ? "text-white" : "text-navy"}`}>{p.price}</p>
              <p className={`text-sm mt-1 ${p.featured ? "text-white/70" : "text-muted-foreground"}`}>{p.quota}</p>
              <ul className={`mt-5 space-y-2 text-sm ${p.featured ? "text-white/90" : "text-navy"}`}>
                {p.perks.map((pk) => <li key={pk} className="flex gap-2">✓ {pk}</li>)}
              </ul>
              <Link
                to="/screens/subscriptions"
                className={`mt-6 block text-center rounded-xl py-2.5 text-sm font-bold ${p.featured ? "btn-orange" : "border border-border hover:bg-muted"}`}
              >
                Voir le détail
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SCREENS ============ */}
      <section id="screens" className="bg-muted/40 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <span className="text-xs font-bold text-orange uppercase tracking-widest">Showcase</span>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-navy">Les 31 écrans</h2>
            <p className="text-muted-foreground mt-2">Explorez la maquette complète, mobile & desktop.</p>
          </div>
          {CATEGORIES.map((cat) => {
            const list = SCREENS.filter((s) => s.category === cat);
            if (!list.length) return null;
            return (
              <div key={cat} className="mb-12">
                <div className="mb-4 flex items-baseline gap-3">
                  <h3 className="font-display text-xl font-bold text-navy">{cat}</h3>
                  <span className="text-xs text-muted-foreground">{list.length} écrans</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {list.map((s, i) => (
                    <Link
                      key={s.id}
                      to={s.path}
                      className="group surface-card p-5 hover-lift fade-in-up"
                      style={{ animationDelay: `${(i % 4) * 50}ms` }}
                    >
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
        </div>
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
