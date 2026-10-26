import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { metaAdsConfigured } from "@/lib/meta";
import { evaluateCampaign, type Metrics } from "@/lib/autopilot";
import { formatDate, formatMoney, formatPct } from "@/lib/format";
import { EmptyState, PageHeader, StatusBadge } from "@/components/page-kit";
import { SyncButton } from "./sync-button";

export const metadata: Metadata = { title: "Campagnes Meta" };

const ZERO: Metrics = { spend: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, roas: 0, conversions: 0 };

export default async function CampaignsPage() {
  const { supabase } = await requireUser();
  const { data: campaigns, error } = await supabase
    .from("meta_campaigns")
    .select("id,offer_id,campaign_name,objective,status,daily_budget,currency,metrics,is_simulated,last_synced_at,created_at")
    .order("created_at", { ascending: false });

  const live = metaAdsConfigured();
  const hasReal = (campaigns ?? []).some((c) => !c.is_simulated);

  return (
    <>
      <PageHeader
        title="Campagnes Meta"
        description="Suivi des campagnes créées depuis SION, avec les recommandations de l'Autopilot sur les 7 derniers jours."
        action={live && hasReal ? <SyncButton /> : undefined}
      />
      {error && <p role="alert" className="mb-4 rounded-lg border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">{error.message}</p>}

      {!live && (
        <p className="mb-6 rounded-lg border border-sun/40 bg-sun/10 px-4 py-3 text-sm text-sun">
          Meta Ads n&apos;est pas connecté : les campagnes sont enregistrées en brouillon. Voir{" "}
          <Link href="/settings" className="font-semibold underline">Réglages</Link>.
        </p>
      )}

      {!campaigns || campaigns.length === 0 ? (
        <EmptyState
          title="Aucune campagne"
          text="Ouvrez une offre, onglet « Campagne Meta », pour créer votre première campagne CBO."
          href="/offers"
          cta="Voir mes offres"
        />
      ) : (
        <ul className="space-y-4">
          {campaigns.map((c) => {
            const m = { ...ZERO, ...(c.metrics as Partial<Metrics>) };
            const reco = c.is_simulated ? null : evaluateCampaign(m, c.currency);
            return (
              <li key={c.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">{c.campaign_name}</h2>
                    <p className="mt-1 text-sm text-muted">
                      Budget {formatMoney(Number(c.daily_budget), c.currency)} / jour · créée le {formatDate(c.created_at)}
                      {c.offer_id && (
                        <>
                          {" · "}
                          <Link href={`/offers/${c.offer_id}`} className="text-sun hover:underline">voir l&apos;offre</Link>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.is_simulated && <span className="badge">Hors Meta</span>}
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                {!c.is_simulated && (
                  <>
                    <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                      {[
                        ["Dépense", formatMoney(m.spend, c.currency)],
                        ["Impressions", m.impressions.toLocaleString("fr-FR")],
                        ["CTR", formatPct(m.ctr)],
                        ["CPC", formatMoney(m.cpc, c.currency)],
                        ["ROAS", `${m.roas.toFixed(2)}x`],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-lg border border-line bg-bg p-3">
                          <dt className="text-[0.7rem] text-muted">{k}</dt>
                          <dd className="num mt-1 text-sm font-semibold">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    {reco && (
                      <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className={`badge ${reco.verdict === "kill" ? "badge-bad" : reco.verdict === "scale" ? "badge-ok" : reco.verdict === "reduce" ? "badge-sun" : ""}`}>
                          {reco.title}
                        </span>
                        <span className="text-muted">{reco.reason}</span>
                      </p>
                    )}
                    {c.last_synced_at && <p className="mt-2 text-xs text-faint">Synchronisé le {formatDate(c.last_synced_at)}</p>}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
