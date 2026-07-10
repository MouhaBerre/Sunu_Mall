"use client";

import { useParams } from "next/navigation";
import { getBoutique, getBoutiqueProducts, getBoutiqueCategories } from "@/lib/mock-data";
import { MapPin, Phone, Mail, Clock, Calendar, BadgeCheck, Store, Star, Users } from "lucide-react";

function BoutiqueAproposScreen() {
  const { slug } = useParams<{ slug: string }>();
  const boutique = getBoutique(slug);
  if (!boutique) return null;

  const nbProduits = getBoutiqueProducts(slug).length;
  const categories = getBoutiqueCategories(slug);

  const infos = [
    { icon: MapPin, label: "Adresse", value: `${boutique.adresse} — ${boutique.ville}, Sénégal` },
    { icon: Phone, label: "Téléphone", value: boutique.telephone },
    { icon: Mail, label: "Email", value: boutique.email },
    { icon: Clock, label: "Horaires", value: boutique.horaires },
    { icon: Calendar, label: "Ouvert depuis", value: boutique.dateOuverture },
    { icon: Store, label: "Catégorie", value: boutique.categorie },
  ];

  const stats = [
    { icon: Store, value: nbProduits, label: "Produits" },
    { icon: Star, value: boutique.note, label: "Note moyenne" },
    { icon: Users, value: boutique.nbAbonnes, label: "Abonnés" },
    { icon: BadgeCheck, value: `${boutique.avisPositifs}%`, label: "Avis positifs" },
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-display text-lg font-bold text-navy mb-3">Notre histoire</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{boutique.description}</p>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Chez {boutique.nom}, chaque client compte. Notre équipe s'engage à vous offrir une expérience d'achat
            fluide, des produits authentiques et un service après-vente réactif, partout au Sénégal.
          </p>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <s.icon className="h-5 w-5 text-orange mx-auto" />
              <p className="font-display text-xl font-extrabold text-navy mt-2">{s.value}</p>
              <p className="text-[11px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-display text-lg font-bold text-navy mb-4">Coordonnées & informations</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {infos.map((i) => (
              <div key={i.label} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-orange/10 text-orange grid place-items-center shrink-0"><i.icon className="h-4 w-4" /></div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{i.label}</p>
                  <p className="text-sm text-gray-700">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20">
        {categories.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h4 className="font-display font-bold text-navy mb-3">Catégories de la boutique</h4>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.nom} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{c.nom}</span>
                  <span className="text-gray-400">{c.compteur}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="rounded-xl bg-gradient-to-br from-navy to-navy-2 p-5 text-white">
          <p className="font-display font-bold">Une question ?</p>
          <p className="text-sm text-white/70 mt-1">L'équipe de {boutique.nom} répond en moyenne en {boutique.tempsReponse}.</p>
          <button className="btn-orange w-full rounded-lg py-2.5 text-sm font-bold mt-4">Contacter la boutique</button>
        </div>
      </aside>
    </div>
  );
}

export default BoutiqueAproposScreen;
