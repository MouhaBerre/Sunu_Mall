import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { User, Mail, Phone, Lock } from "lucide-react";

export const Route = createFileRoute("/screens/register-client")({ component: RegisterClient });

function RegisterClient() {
  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-stretch min-h-[720px]">
      <div className="hidden lg:flex navy-panel rounded-2xl relative overflow-hidden p-10 flex-col justify-between">
        <Logo variant="white" size={44} />
        <div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Rejoignez <span className="text-orange-light">500 000+</span><br />acheteurs sénégalais.
          </h2>
          <ul className="text-white/70 mt-6 space-y-2 text-sm">
            {["Livraison partout au Sénégal", "Paiement Wave, Orange Money, CB", "Wishlist multi-boutiques", "Support 7j/7 en Wolof et Français"].map((f) => (
              <li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-orange-light" />{f}</li>
            ))}
          </ul>
        </div>
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange/20 blur-3xl" />
      </div>

      <div className="surface-card p-10">
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-navy">Créer votre compte</h1>
          <p className="text-sm text-muted-foreground mt-1">Rejoignez la marketplace en 30 secondes.</p>

          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field icon={<User className="h-4 w-4" />} label="Prénom" placeholder="Aminata" />
              <Field icon={<User className="h-4 w-4" />} label="Nom" placeholder="Fall" />
            </div>
            <Field icon={<Mail className="h-4 w-4" />} label="Email" placeholder="exemple@email.com" />
            <Field icon={<Phone className="h-4 w-4" />} label="Téléphone" placeholder="+221 77 123 45 67" />
            <Field icon={<Lock className="h-4 w-4" />} label="Mot de passe" placeholder="••••••••" type="password" />
            <Field icon={<Lock className="h-4 w-4" />} label="Confirmer le mot de passe" placeholder="••••••••" type="password" />

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="mt-0.5 rounded" defaultChecked />
              J'accepte les <a className="text-orange font-medium">Conditions d'utilisation</a> et la <a className="text-orange font-medium">Politique de confidentialité</a>.
            </label>

            <button className="btn-orange w-full rounded-xl py-3 text-sm font-semibold">S'inscrire</button>

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
