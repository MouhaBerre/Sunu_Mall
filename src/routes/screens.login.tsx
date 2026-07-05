import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Mail, Lock, Eye } from "lucide-react";

export const Route = createFileRoute("/screens/login")({ component: LoginScreen });

function LoginScreen() {
  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-stretch min-h-[720px]">
      {/* Illustration panel */}
      <div className="hidden lg:flex navy-panel rounded-2xl relative overflow-hidden p-10 flex-col justify-between">
        <Logo variant="white" size={44} />
        <div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
            Le meilleur du <span className="text-orange-light">Sénégal</span>,<br />livré chez vous.
          </h2>
          <p className="text-white/70 mt-4 max-w-sm">Achetez local, payez facile, livraison rapide partout.</p>
          <div className="mt-8 flex gap-3">
            {["Wave", "Orange Money", "Carte bancaire"].map((m) => (
              <span key={m} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80">{m}</span>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-orange/30 blur-3xl" />
      </div>

      {/* Login form */}
      <div className="surface-card p-10 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo size={40} /></div>
          <h1 className="font-display text-3xl font-bold text-navy">Bienvenue !</h1>
          <p className="text-sm text-muted-foreground mt-1">Connectez-vous à votre compte SUNU MALL.</p>

          <div className="mt-8 space-y-4">
            <Field icon={<Mail className="h-4 w-4" />} label="Email" placeholder="exemple@email.com" />
            <Field icon={<Lock className="h-4 w-4" />} label="Mot de passe" placeholder="••••••••" type="password" trailing={<Eye className="h-4 w-4 text-muted-foreground" />} />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded" defaultChecked /> Se souvenir de moi
              </label>
              <a className="text-orange font-medium hover:underline">Mot de passe oublié ?</a>
            </div>
            <button className="btn-orange w-full rounded-xl py-3 text-sm font-semibold">Se connecter</button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">ou continuer avec</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialBtn label="Google" />
              <SocialBtn label="Facebook" />
            </div>

            <p className="text-center text-sm text-muted-foreground pt-4">
              Pas encore de compte ? <Link to="/screens/register-client" className="text-orange font-semibold hover:underline">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, placeholder, type = "text", trailing }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-navy mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 focus-within:border-orange">
        <span className="text-muted-foreground">{icon}</span>
        <input type={type} placeholder={placeholder} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        {trailing}
      </div>
    </div>
  );
}

function SocialBtn({ label }: { label: string }) {
  return (
    <button className="rounded-xl border border-border bg-card py-2.5 text-sm font-medium hover:bg-muted flex items-center justify-center gap-2">
      <span className="h-4 w-4 rounded-full bg-gradient-to-br from-orange to-navy" />
      {label}
    </button>
  );
}
