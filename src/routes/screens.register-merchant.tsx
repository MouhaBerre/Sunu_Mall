import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Store, Mail, Phone, Lock, ChevronDown, Check } from "lucide-react";

export const Route = createFileRoute("/screens/register-merchant")({ component: RegisterMerchant });

const PLANS = [
  { name: "Standard", price: "Gratuit", features: ["50 produits", "Commission 8%", "Support email"] },
  { name: "Premium", price: "15 000 FCFA/mois", features: ["500 produits", "Commission 5%", "Analytics"], highlight: true },
  { name: "Premium+", price: "25 000 FCFA/mois", features: ["Illimité", "Commission 3%", "Live shopping"] },
];

function RegisterMerchant() {
  return (
    <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8">
      <div className="navy-panel rounded-2xl relative overflow-hidden p-10">
        <Logo variant="white" size={44} />
        <h2 className="font-display text-3xl font-extrabold text-white mt-10 leading-tight">
          Vendez à toute<br /><span className="text-orange-light">l'Afrique de l'Ouest</span>
        </h2>
        <p className="text-white/70 mt-3 text-sm">Ouvrez votre boutique en ligne en 5 min. 0 frais d'installation.</p>
        <div className="mt-8 space-y-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-xl border p-4 ${p.highlight ? "border-orange bg-orange/10" : "border-white/20 bg-white/5"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{p.name}</span>
                <span className="text-orange-light text-sm font-bold">{p.price}</span>
              </div>
              <ul className="space-y-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-white/70"><Check className="h-3 w-3 text-orange-light" />{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card p-10">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-3xl font-bold text-navy">Créer votre compte Commerçant</h1>
          <p className="text-sm text-muted-foreground mt-1">Commencez à vendre dès aujourd'hui.</p>

          <div className="mt-8 space-y-4">
            <Field icon={<Store className="h-4 w-4" />} label="Nom du commerçant" placeholder="Ousmane Diop" />
            <Field icon={<Mail className="h-4 w-4" />} label="Email professionnel" placeholder="exemple@boutique.com" />
            <Field icon={<Phone className="h-4 w-4" />} label="Téléphone" placeholder="+221 77 123 45 67" />

            <div>
              <label className="text-xs font-medium text-navy mb-1.5 block">Choisir un abonnement</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3">
                <span className="flex-1 text-sm">Standard — Gratuit</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Field icon={<Lock className="h-4 w-4" />} label="Mot de passe" placeholder="••••••••" type="password" />
            <Field icon={<Lock className="h-4 w-4" />} label="Confirmer le mot de passe" placeholder="••••••••" type="password" />

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="mt-0.5 rounded" defaultChecked />
              J'accepte les <a className="text-orange font-medium">Conditions vendeur</a> et la <a className="text-orange font-medium">Politique de commission</a>.
            </label>

            <button className="btn-orange w-full rounded-xl py-3 text-sm font-semibold">Créer mon compte</button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Déjà un compte ? <Link to="/screens/login" className="text-orange font-semibold hover:underline">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, placeholder, type = "text" }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-navy mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 focus-within:border-orange">
        <span className="text-muted-foreground">{icon}</span>
        <input type={type} placeholder={placeholder} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
    </div>
  );
}
