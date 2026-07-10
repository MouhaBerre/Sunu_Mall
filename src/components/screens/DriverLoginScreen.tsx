import Link from "next/link";
import { PhoneFrame, StatusBar } from "@/components/mock/PhoneFrame";
import { Logo } from "@/components/brand/Logo";
import { Phone, Lock, Bike } from "lucide-react";

function DriverLogin() {
  return (
    <div className="flex justify-center py-6">
      <PhoneFrame label="13 — Connexion Livreur">
        <StatusBar />
        <div className="navy-panel px-6 pt-6 pb-10 rounded-b-[32px] relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-orange/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <Logo variant="white" size={40} showWordmark={false} />
            <div>
              <p className="text-white font-display font-bold">SUNU MALL</p>
              <p className="text-white/70 text-xs">Espace Livreur</p>
            </div>
          </div>
          <div className="relative mt-6 flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-2 w-fit">
            <Bike className="h-4 w-4 text-orange-light" />
            <span className="text-xs text-white font-medium">Mode livreur — GPS actif</span>
          </div>
          <h1 className="relative mt-6 font-display text-2xl font-extrabold text-white">Bienvenue Modou</h1>
          <p className="relative text-white/70 text-sm">Connectez-vous pour voir vos courses du jour.</p>
        </div>

        <div className="px-6 pt-6 space-y-4 fade-in-up">
          <div>
            <label className="text-xs font-semibold text-navy">Numéro de téléphone</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 focus-within:border-orange">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <input defaultValue="+221 77 512 88 44" className="flex-1 bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-navy">Mot de passe</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 focus-within:border-orange">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input type="password" defaultValue="********" className="flex-1 bg-transparent text-sm outline-none" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" defaultChecked className="accent-orange" />
            Rester connecté
          </label>

          <Link href="/driver-dashboard" className="btn-orange block text-center rounded-xl py-3 text-sm font-bold">
            Se connecter
          </Link>

          <div className="rounded-xl border border-border bg-muted/40 p-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              💡 Votre compte livreur est créé par le commerçant qui vous a affilié. Contactez-le si vous n'avez pas encore reçu vos identifiants.
            </p>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

export default DriverLogin;
