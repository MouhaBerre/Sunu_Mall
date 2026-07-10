"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Store, Bike, Shield, AlertCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { TEST_ACCOUNTS, findTestAccount, type TestAccount } from "@/lib/mock-data";

const ROLE_ICONS: Record<TestAccount["role"], any> = {
  client: ShoppingBag,
  vendeur: Store,
  livreur: Bike,
  admin: Shield,
};

function safeNext(next: string | null) {
  return next && next.startsWith("/") ? next : null;
}

function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const login = useStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const signIn = (account: TestAccount) => {
    login({ name: account.name, email: account.email, role: account.role });
    router.push(next ?? account.redirect);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const account = findTestAccount(email, password);
    if (!account) {
      setError("Email ou mot de passe incorrect. Utilisez un compte de test ci-dessous.");
      return;
    }
    signIn(account);
  };

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

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-danger/10 text-danger px-3 py-2.5 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-navy mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 focus-within:border-orange">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="exemple@email.com" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-navy mb-1.5 block">Mot de passe</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 focus-within:border-orange">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPwd ? "text" : "password"} placeholder="••••••••" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="text-muted-foreground" aria-label={showPwd ? "Masquer" : "Afficher"}>
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded" defaultChecked /> Se souvenir de moi
              </label>
              <a className="text-orange font-medium hover:underline cursor-pointer">Mot de passe oublié ?</a>
            </div>

            <button type="submit" className="btn-orange w-full rounded-xl py-3 text-sm font-semibold">Se connecter</button>
          </form>

          {/* Comptes de test */}
          <div className="mt-6 rounded-xl border border-dashed border-orange/40 bg-orange/5 p-4">
            <p className="text-xs font-bold text-navy flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" /> Comptes de test — connexion rapide
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Cliquez pour vous connecter instantanément selon le rôle.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {TEST_ACCOUNTS.map((a) => {
                const Ic = ROLE_ICONS[a.role];
                return (
                  <button
                    key={a.role}
                    type="button"
                    onClick={() => signIn(a)}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left hover:border-orange hover:bg-white transition-colors"
                  >
                    <span className="h-7 w-7 rounded-md bg-orange/10 text-orange grid place-items-center shrink-0"><Ic className="h-4 w-4" /></span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-navy">{a.label}</span>
                      <span className="block text-[10px] text-muted-foreground truncate">{a.email}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Mot de passe : <code className="text-navy">rôle+123</code> (ex. <code className="text-navy">admin123</code>)</p>
          </div>

          <p className="text-center text-sm text-muted-foreground pt-5">
            Pas encore de compte ? <Link href="/register-client" className="text-orange font-semibold hover:underline">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
