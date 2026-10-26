"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { CURRENCIES, OFFER_TYPES } from "@/lib/format";

type OfferType = (typeof OFFER_TYPES)[number]["id"];

export function MissionForm({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [offerType, setOfferType] = useState<OfferType>("digital");
  const [locations, setLocations] = useState("Cameroun");
  const [currency, setCurrency] = useState("XAF");
  const [custom, setCustom] = useState(false);
  const [customStrategy, setCustomStrategy] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          offerType,
          targetLocations: locations.split(",").map((l) => l.trim()).filter(Boolean),
          currency,
          strategyMode: custom ? "custom" : "ai_recommended",
          customStrategy: custom ? customStrategy : "",
          rawInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'analyse.");
      router.push(`/offers/${data.offerId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="card space-y-5 p-6">
        <div>
          <label htmlFor="title" className="label">Nom de l&apos;offre *</label>
          <input id="title" required minLength={2} maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} className="field" placeholder="Ex : Crème au karité éclat naturel" />
        </div>

        <fieldset>
          <legend className="label">Type d&apos;offre</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {OFFER_TYPES.map((t) => (
              <label
                key={t.id}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  offerType === t.id ? "border-sun bg-sun/5" : "border-line-strong hover:border-faint"
                }`}
              >
                <input type="radio" name="offerType" value={t.id} checked={offerType === t.id} onChange={() => setOfferType(t.id)} className="sr-only" />
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="block text-xs text-muted">{t.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <div>
            <label htmlFor="zones" className="label">Zones ciblées (séparées par des virgules) *</label>
            <input id="zones" required value={locations} onChange={(e) => setLocations(e.target.value)} className="field" placeholder="Cameroun, Côte d'Ivoire" />
          </div>
          <div>
            <label htmlFor="currency" className="label">Devise</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="field">
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="raw" className="label">Description, bénéfices, notes brutes *</label>
          <textarea
            id="raw"
            required
            minLength={15}
            maxLength={8000}
            rows={7}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="field resize-y"
            placeholder="Le problème résolu, la promesse, le prix, la cible, ce qui vous différencie, les conditions de livraison…"
          />
          <p className="mt-1.5 text-xs text-faint">Plus c&apos;est précis, plus la stratégie est pertinente. {rawInput.length}/8000</p>
        </div>

        <div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} className="size-4 accent-[#ffb547]" />
            J&apos;impose ma propre structure de campagne
          </label>
          {custom && (
            <textarea
              rows={3}
              value={customStrategy}
              onChange={(e) => setCustomStrategy(e.target.value)}
              className="field mt-3"
              placeholder="Ex : 1 campagne CBO, 2 ensembles (large + reciblage 7 jours), 3 créatifs vidéo."
              aria-label="Structure de campagne imposée"
            />
          )}
        </div>
      </div>

      <aside className="space-y-4 self-start lg:sticky lg:top-8">
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Ce que vous obtenez</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>Positionnement et prix conseillé</li>
            <li>Personas, douleurs, désirs, objections</li>
            <li>4 angles et copies AIDA / PAS / Hook-Story-Offer</li>
            <li>Hooks Reels, scripts vidéo, prompts visuels</li>
            <li>Plan de campagne Meta CBO et KPI cibles</li>
          </ul>
          {demoMode && (
            <p className="flex gap-2 rounded-lg border border-sun/40 bg-sun/10 p-3 text-xs text-sun">
              <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              Aucune clé IA configurée : le résultat sera généré en mode démo (modèle de base, non personnalisé par IA).
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-lg border border-bad/40 bg-bad/10 p-3 text-sm text-bad">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary h-12 w-full">
            {loading ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <Sparkles size={17} aria-hidden="true" />}
            {loading ? "Analyse en cours…" : "Lancer l'analyse"}
          </button>
          {loading && <p className="text-center text-xs text-muted">Cela peut prendre jusqu&apos;à une minute.</p>}
        </div>
      </aside>
    </form>
  );
}
