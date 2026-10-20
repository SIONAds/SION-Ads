// Client et utilitaires pour l'écosystème Meta (Graph API & Marketing API)

export interface MetaCampaignPayload {
  adAccountId: string;
  name: string;
  objective: "OUTCOME_SALES" | "OUTCOME_LEADS" | "OUTCOME_TRAFFIC";
  dailyBudget: number; // en centimes ou devise
  accessToken: string;
}

export interface MetaPublishPayload {
  pageId: string;
  accessToken: string;
  message: string;
  mediaUrl?: string;
  isReel?: boolean;
}

const META_GRAPH_VERSION = "v21.0";
const META_BASE_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

/**
 * Publier un post ou média sur une Page Facebook interconnectée
 */
export async function publishToFacebookPage(payload: MetaPublishPayload) {
  const { pageId, accessToken, message, mediaUrl } = payload;

  if (!accessToken || !pageId) {
    throw new Error("Clé d'accès ou ID de page Meta manquant.");
  }

  const endpoint = mediaUrl
    ? `${META_BASE_URL}/${pageId}/photos`
    : `${META_BASE_URL}/${pageId}/feed`;

  const params = new URLSearchParams();
  params.append("access_token", accessToken);
  params.append("message", message);
  if (mediaUrl) {
    params.append("url", mediaUrl);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: params,
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || "Erreur publication Facebook");
  }

  return data;
}

/**
 * Créer une campagne CBO dans Meta Ads Manager
 */
export async function createMetaCampaign(payload: MetaCampaignPayload) {
  const { adAccountId, name, objective, dailyBudget, accessToken } = payload;

  const cleanAdAccountId = adAccountId.startsWith("act_")
    ? adAccountId
    : `act_${adAccountId}`;

  const endpoint = `${META_BASE_URL}/${cleanAdAccountId}/campaigns`;

  const params = new URLSearchParams();
  params.append("access_token", accessToken);
  params.append("name", name);
  params.append("objective", objective);
  params.append("status", "PAUSED"); // En pause par sécurité au départ
  params.append("special_ad_categories", "[]");
  // CBO : Budget au niveau de la campagne
  params.append("daily_budget", (dailyBudget * 100).toString()); // Meta attend la valeur en sous-unités (centimes)

  const res = await fetch(endpoint, {
    method: "POST",
    body: params,
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || "Erreur création campagne Meta");
  }

  return data;
}
