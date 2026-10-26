import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getDiagnostics } from "@/lib/diagnostics";
import { formatDate, formatMoney, formatPct } from "@/lib/format";
import { evaluateCampaign, type Metrics } from "@/lib/autopilot";
import { EmptyState, PageHeader, Stat, StatusBadge } from "@/components/page-kit";

export const metadata: Metadata = { title: "Tableau de bord" };

const ZERO: Metrics = { spend: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, roas: 0, conversions: 0 };

export default async function DashboardPage() {
  const { supabase } = await requireUser();

  const [offersRes, campaignsRes, diag] = await Promise.all([
    supabase.from("offers").select("id,title,currency,status,created_at,analysis_source", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
    supabase.from("meta_campaigns").select("id,campaign_name,status,currency,daily_budget,metrics,is_simulated,offer_id"),
    getDiagnostics(),
  ]);

  const offers = offersRes.data ?? [];
  const campaigns = campaignsRes.data ?? [];
  const real = campaigns.filter((c) => !c.is_simulated);

  const totals = real.reduce(
    (acc, c) => {
      const m = { ...ZERO, ...(c.metrics as Partial<Metrics>) };
      acc.impressions += m.impressions;
      acc.clicks += m.clicks;
      acc.spendByCurrency[c.currency] = (acc.spendByCurrency[c.currency] ?? 0) + m.spend;
      return acc;
    },
    { impressions: 0, clicks: 0, spendByCurrency: {} as Record<string, number> },
  );
  const spendLabel =
    Object.entries(totals.spendByCurrency)
      .filter(([, v]) => v > 0)
      .map(([cur, v]) => formatMoney(v, cur))
      .join(" · ") || "—";
  const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : null;

  const recos = real
    .map((c) => ({ c, r: evaluateCampaign({ ...ZERO, ...(c.metrics as Partial<Metrics>) }, c.currency) }))
    .filter(({ r }) => r.verdict !== "hold" && r.verdict !== "learning");

  const setup = [
    { ok: diag.migrated && diag.rlsProtected, label: "Base de données sécurisée (RLS)", fix: "Exécutez supabase/migrations/0002_secure_rls.sql" },
    { ok: diag.ai, label: "Moteur IA connecté", fix: "Ajoutez LLAMA_API_KEY ou OPENAI_API_KEY (mode démo en attendant)" },
    { ok: diag.metaAds, label: "Compte publicitaire Meta connecté", fix: "Ajoutez META_ACCESS_TOKEN_LONG_LIVED et META_AD_ACCOUNT_ID" },
  ];
  const pending = setup.filter((s) => !s.ok);

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de vos missions et de vos campagnes Meta."
        action={
          <Link href="/offers/new" className="btn btn-primary">
            Nouvelle mission <ArrowRight size={16} />
          </Link>
        }
      />

      {pending.length > 0 && (
        <section aria-label="Configuration" className="card mb-8 p-5">
          <h2 className="text-lg font-semibold">Finalisez l&apos;installation</h2>
          <ul className="mt-4 space-y-3">
            {setup.map((s) => (
              <li key={s.label} className="flex items-start gap-3 text-sm">
                {s.ok ? (
                  <CircleCheck size={18} className="mt-0.5 shrink-0 text-ok" aria-hidden="true" />
                ) : (
                  <CircleAlert size={18} className="mt-0.5 shrink-0 text-sun" aria-hidden="true" />
                )}
                <div>
                  <p className={s.ok ? "text-muted" : "font-medium"}>{s.label}</p>
                  {!s.ok && <p className="text-muted">{s.fix}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Indicateurs" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Offres analysées" value={offersRes.count ?? 0} />
        <Stat label="Campagnes" value={campaigns.length} hint={`${real.length} sur Meta`} />
        <Stat label="Dépenses 7 jours" value={<span className="text-xl">{spendLabel}</span>} />
        <Stat label="CTR global" value={ctr === null ? "—" : formatPct(ctr)} hint={ctr === null ? "Synchronisez vos campagnes" : undefined} />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section aria-label="Dernières offres">
          <h2 className="mb-3 text-lg font-semibold">Dernières missions</h2>
          {offers.length === 0 ? (
            <EmptyState
              title="Aucune mission pour l'instant"
              text="Décrivez une offre : SION génère la stratégie, les copies et les prompts créatifs."
              href="/offers/new"
              cta="Créer ma première mission"
            />
          ) : (
            <ul className="card divide-y divide-line">
              {offers.map((o) => (
                <li key={o.id}>
                  <Link href={`/offers/${o.id}`} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{o.title}</p>
                      <p className="text-xs text-muted">{formatDate(o.created_at)} · {o.currency}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {o.analysis_source === "demo" && <span className="badge badge-sun">Démo</span>}
                      <StatusBadge status={o.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Recommandations Autopilot">
          <h2 className="mb-3 text-lg font-semibold">Autopilot</h2>
          {recos.length === 0 ? (
            <div className="card p-5 text-sm text-muted">
              {real.length === 0
                ? "Aucune campagne Meta suivie. Créez-en une depuis une offre pour recevoir des recommandations."
                : "Aucune action recommandée. Vos campagnes sont dans les seuils ou en phase d'apprentissage."}
            </div>
          ) : (
            <ul className="space-y-3">
              {recos.map(({ c, r }) => (
                <li key={c.id} className="card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{c.campaign_name}</p>
                    <span className={`badge ${r.verdict === "kill" ? "badge-bad" : r.verdict === "scale" ? "badge-ok" : "badge-sun"}`}>
                      {r.title}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">{r.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
