"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Rocket } from "lucide-react";
import type { BrainAnalysis } from "@/lib/schemas";
import { defaultDailyBudget, formatMoney } from "@/lib/format";
import { CopyButton } from "@/components/copy-button";
import { StatusBadge } from "@/components/page-kit";

const TABS = [
  { id: "strategy", label: "Stratégie" },
  { id: "personas", label: "Personas" },
  { id: "copies", label: "Copies" },
  { id: "studio", label: "Studio" },
  { id: "video", label: "Vidéo" },
  { id: "meta", label: "Campagne Meta" },
] as const;
type TabId = (typeof TABS)[number]["id"];

interface CampaignRow {
  id: string;
  campaign_name: string;
  status: string;
  daily_budget: number;
  currency: string;
  is_simulated: boolean;
}

export function OfferView({
  offerId,
  currency,
  analysis,
  campaigns,
  metaLive,
}: {
  offerId: string;
  currency: string;
  analysis: BrainAnalysis;
  campaigns: CampaignRow[];
  metaLive: boolean;
}) {
  const [tab, setTab] = useState<TabId>("strategy");
  const angleName = (id: number) => analysis.angles.find((a) => a.id === id)?.name;

  return (
    <div>
      <div role="tablist" aria-label="Sections de l'offre" className="-mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.id ? "border-sun text-text" : "border-transparent text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "strategy" && (
          <div className="space-y-6">
            <section className="card p-6">
              <p className="eyebrow mb-3">Promesse unique</p>
              <p className="font-display text-2xl font-semibold leading-snug">{analysis.positioning.unique_value_proposition}</p>
              <p className="mt-4 text-muted">{analysis.positioning.target_market_summary}</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted">Prix conseillé</dt>
                  <dd className="mt-1 font-semibold">{analysis.positioning.recommended_pricing}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Maturité du marché</dt>
                  <dd className="mt-1 font-semibold">{analysis.positioning.market_sophistication_level}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">Angles psychologiques</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.angles.map((a) => (
                  <article key={a.id} className="card p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{a.name}</h3>
                      <span className="badge">Angle {a.id}</span>
                    </div>
                    <p className="mt-3 text-[0.95rem]">« {a.hook_example} »</p>
                    <p className="mt-3 text-sm text-muted"><span className="font-semibold text-text">Levier : </span>{a.psychological_trigger}</p>
                    <p className="mt-1 text-sm text-muted"><span className="font-semibold text-text">Visuel : </span>{a.visual_concept}</p>
                  </article>
                ))}
              </div>
            </section>

            {analysis.objections_handling.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">Objections traitées</h2>
                <ul className="card divide-y divide-line">
                  {analysis.objections_handling.map((o, i) => (
                    <li key={i} className="p-5">
                      <p className="font-medium">{o.objection}</p>
                      <p className="mt-1 text-sm text-muted">{o.counter_argument}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {tab === "personas" && (
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.personas.map((p, i) => (
              <article key={i} className="card space-y-4 p-6">
                <div>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted">{p.demographics} · {p.location}</p>
                </div>
                <BulletBlock title="Douleurs" tone="text-bad" items={p.core_pains} />
                <BulletBlock title="Désirs" tone="text-ok" items={p.secret_desires} />
                <BulletBlock title="Objections" tone="text-sun" items={p.frequent_objections} />
                <p className="border-t border-line pt-3 text-sm text-muted">Canaux : {p.preferred_platforms.join(", ")}</p>
              </article>
            ))}
          </div>
        )}

        {tab === "copies" && (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {analysis.copies.map((c, i) => (
                <article key={i} className="card flex flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge badge-sun">{c.framework.replace(/_/g, " ")}</span>
                    <CopyButton text={`${c.hook}\n\n${c.body}\n\n${c.cta}`} />
                  </div>
                  {angleName(c.angle_id) && <p className="mt-3 text-xs text-muted">Angle : {angleName(c.angle_id)}</p>}
                  <p className="mt-3 font-semibold">{c.hook}</p>
                  <p className="mt-2 flex-1 whitespace-pre-line text-[0.93rem] text-muted">{c.body}</p>
                  <p className="mt-4 text-sm font-semibold text-sun">{c.cta}</p>
                </article>
              ))}
            </div>
            {analysis.reels_hooks.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">Hooks Reels (0-3 s)</h2>
                <ul className="card divide-y divide-line">
                  {analysis.reels_hooks.map((h, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-5 py-3">
                      <span className="text-[0.95rem]">{h}</span>
                      <CopyButton text={h} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {tab === "studio" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <PromptList title="Bannières et lifestyle" items={analysis.visual_prompts.banners_and_lifestyle} />
            <PromptList title="Mockups et packshots" items={analysis.visual_prompts.mockups_or_packshots} />
            <p className="text-sm text-muted lg:col-span-2">
              Collez ces prompts dans votre générateur d&apos;images. Le rendu intégré arrivera avec la connexion Replicate.
            </p>
          </div>
        )}

        {tab === "video" && (
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.video_scripts.map((s, i) => (
              <article key={i} className="card space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Script vertical 9:16</h3>
                  <span className="badge">{s.duration}</span>
                </div>
                <div className="rounded-lg border border-bad/30 bg-bad/5 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-bad">Hook 0-3 s</p>
                  <p className="mt-1">{s.hook_0_3s}</p>
                </div>
                <Labeled label="Message" text={s.core_message} />
                <Labeled label="Voix-off" text={s.voiceover_script} copy />
                <Labeled label="Texte à l'écran" text={s.on_screen_text} />
                <Labeled label="Appel à l'action" text={s.cta} />
              </article>
            ))}
          </div>
        )}

        {tab === "meta" && (
          <MetaTab offerId={offerId} currency={currency} analysis={analysis} campaigns={campaigns} metaLive={metaLive} />
        )}
      </div>
    </div>
  );
}

function BulletBlock({ title, tone, items }: { title: string; tone: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className={`mb-1.5 text-xs font-bold uppercase tracking-wide ${tone}`}>{title}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted marker:text-faint">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function PromptList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="card p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <ul className="space-y-3">
        {items.map((p, i) => (
          <li key={i} className="rounded-lg border border-line bg-bg p-4">
            <p className="num text-[0.8rem] leading-relaxed text-muted">{p}</p>
            <div className="mt-3"><CopyButton text={p} label="Copier le prompt" /></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Labeled({ label, text, copy }: { label: string; text: string; copy?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
        {copy && <CopyButton text={text} />}
      </div>
      <p className="mt-1 text-[0.93rem]">{text}</p>
    </div>
  );
}

function MetaTab({
  offerId,
  currency,
  analysis,
  campaigns,
  metaLive,
}: {
  offerId: string;
  currency: string;
  analysis: BrainAnalysis;
  campaigns: CampaignRow[];
  metaLive: boolean;
}) {
  const router = useRouter();
  const [budget, setBudget] = useState(String(defaultDailyBudget(currency)));
  const [objective, setObjective] = useState("OUTCOME_SALES");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const k = analysis.meta_ads_strategy.kpi_targets;

  async function deploy(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/meta/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, objective, dailyBudget: Number(budget) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de la création.");
      setResult({ ok: true, text: data.message });
      router.refresh();
    } catch (err) {
      setResult({ ok: false, text: err instanceof Error ? err.message : "Erreur inattendue." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <section className="card space-y-5 p-6">
        <h2 className="text-lg font-semibold">Plan de campagne</h2>
        <Labeled label="Structure" text={analysis.meta_ads_strategy.campaign_structure} />
        <Labeled label="Ciblage" text={analysis.meta_ads_strategy.audience_targeting} />
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Budget conseillé", analysis.meta_ads_strategy.recommended_budget_daily],
            ["CTR cible", k.expected_ctr],
            ["ROAS cible", k.target_roas],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-bg p-3">
              <p className="text-[0.7rem] text-muted">{label}</p>
              <p className="num mt-1 text-sm font-semibold">{value || "—"}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <form onSubmit={deploy} className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Créer la campagne</h2>
          <div>
            <label htmlFor="objective" className="label">Objectif</label>
            <select id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} className="field">
              <option value="OUTCOME_SALES">Ventes</option>
              <option value="OUTCOME_LEADS">Prospects (leads)</option>
              <option value="OUTCOME_TRAFFIC">Trafic</option>
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="label">Budget quotidien (devise du compte publicitaire)</label>
            <input id="budget" type="number" min="1" step="any" required value={budget} onChange={(e) => setBudget(e.target.value)} className="field num" />
            <p className="mt-1.5 text-xs text-faint">
              {Number(budget) > 0 ? `≈ ${formatMoney(Number(budget), currency)} par jour` : "Saisissez un montant."}
            </p>
          </div>
          <p className="text-xs text-muted">
            {metaLive
              ? "La campagne sera créée sur Meta en PAUSE. Aucune dépense avant activation de votre part."
              : "Meta n'est pas connecté : un brouillon sera enregistré ici, sans appel à Meta."}
          </p>
          {result && (
            <p role={result.ok ? "status" : "alert"} className={`rounded-lg border p-3 text-sm ${result.ok ? "border-ok/40 bg-ok/10 text-ok" : "border-bad/40 bg-bad/10 text-bad"}`}>
              {result.text}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Rocket size={16} aria-hidden="true" />}
            {metaLive ? "Créer sur Meta (en pause)" : "Enregistrer le brouillon"}
          </button>
        </form>

        {campaigns.length > 0 && (
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Campagnes de cette offre</h3>
              <Link href="/campaigns" className="text-sm text-sun hover:underline">Tout voir</Link>
            </div>
            <ul className="space-y-2.5">
              {campaigns.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">{c.campaign_name}</span>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
