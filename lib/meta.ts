import "server-only";
import { toMetaMinorUnits } from "@/lib/format";

const VERSION = process.env.META_GRAPH_VERSION || "v23.0";
const BASE = `https://graph.facebook.com/${VERSION}`;

export function getMetaConfig() {
  return {
    token: process.env.META_ACCESS_TOKEN_LONG_LIVED || "",
    adAccountId: process.env.META_AD_ACCOUNT_ID || "",
    pageId: process.env.META_PAGE_ID || "",
  };
}

export const metaAdsConfigured = () => {
  const c = getMetaConfig();
  return Boolean(c.token && c.adAccountId);
};

export const metaPageConfigured = () => {
  const c = getMetaConfig();
  return Boolean(c.token && c.pageId);
};

async function graph<T>(path: string, token: string, init?: { method?: "GET" | "POST"; body?: URLSearchParams }) {
  const res = await fetch(`${BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: { Authorization: `Bearer ${token}` },
    body: init?.body,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { message?: string; error_user_msg?: string } };
  if (!res.ok || data.error) {
    throw new Error(data.error?.error_user_msg || data.error?.message || `Erreur Meta (${res.status})`);
  }
  return data;
}

const actId = (id: string) => (id.startsWith("act_") ? id : `act_${id}`);

export async function getAdAccountCurrency(): Promise<string> {
  const { token, adAccountId } = getMetaConfig();
  const data = await graph<{ currency?: string }>(`/${actId(adAccountId)}?fields=currency`, token);
  return (data.currency || "USD").toUpperCase();
}

/** Campagne CBO créée en PAUSE : rien ne dépense avant activation manuelle dans Meta. */
export async function createCboCampaign(input: {
  name: string;
  objective: "OUTCOME_SALES" | "OUTCOME_LEADS" | "OUTCOME_TRAFFIC";
  dailyBudget: number;
}) {
  const { token, adAccountId } = getMetaConfig();
  const currency = await getAdAccountCurrency();
  const body = new URLSearchParams({
    name: input.name,
    objective: input.objective,
    status: "PAUSED",
    special_ad_categories: "[]",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    daily_budget: String(toMetaMinorUnits(input.dailyBudget, currency)),
  });
  const data = await graph<{ id: string }>(`/${actId(adAccountId)}/campaigns`, token, { method: "POST", body });
  return { id: data.id, currency };
}

export interface CampaignInsights {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  roas: number;
  conversions: number;
}

export async function getCampaignInsights(campaignId: string): Promise<CampaignInsights> {
  const { token } = getMetaConfig();
  const fields = "spend,impressions,clicks,ctr,cpc,actions,purchase_roas";
  const data = await graph<{ data?: Array<Record<string, unknown>> }>(
    `/${campaignId}/insights?fields=${fields}&date_preset=last_7d`,
    token,
  );
  const row = data.data?.[0] ?? {};
  const num = (v: unknown) => Number(v ?? 0) || 0;
  const roasList = row.purchase_roas as Array<{ value: string }> | undefined;
  const actions = row.actions as Array<{ action_type: string; value: string }> | undefined;
  const conv = actions?.find((a) => a.action_type === "omni_purchase" || a.action_type === "lead");
  return {
    spend: num(row.spend),
    impressions: num(row.impressions),
    clicks: num(row.clicks),
    ctr: num(row.ctr),
    cpc: num(row.cpc),
    roas: num(roasList?.[0]?.value),
    conversions: num(conv?.value),
  };
}

export async function publishToPage(input: { message: string; mediaUrl?: string }) {
  const { token, pageId } = getMetaConfig();
  const body = new URLSearchParams({ message: input.message });
  if (input.mediaUrl) body.set("url", input.mediaUrl);
  return graph<{ id?: string; post_id?: string }>(`/${pageId}/${input.mediaUrl ? "photos" : "feed"}`, token, {
    method: "POST",
    body,
  });
}
