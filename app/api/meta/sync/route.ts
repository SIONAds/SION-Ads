import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth";
import { getCampaignInsights, metaAdsConfigured } from "@/lib/meta";
import { serverError, unauthorized } from "@/lib/api";

/** Récupère les métriques des 7 derniers jours pour chaque campagne réellement créée sur Meta. */
export async function POST() {
  const auth = await getApiUser();
  if (!auth) return unauthorized();
  if (!metaAdsConfigured()) {
    return NextResponse.json({ error: "Meta Ads n'est pas connecté (voir Réglages)." }, { status: 400 });
  }

  try {
    const { data: campaigns, error } = await auth.supabase
      .from("meta_campaigns")
      .select("id,meta_campaign_id")
      .eq("is_simulated", false)
      .not("meta_campaign_id", "is", null);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let synced = 0;
    const failures: string[] = [];
    for (const c of campaigns ?? []) {
      try {
        const metrics = await getCampaignInsights(c.meta_campaign_id as string);
        await auth.supabase
          .from("meta_campaigns")
          .update({ metrics, last_synced_at: new Date().toISOString() })
          .eq("id", c.id);
        synced += 1;
      } catch (e) {
        failures.push(e instanceof Error ? e.message : "échec");
      }
    }
    return NextResponse.json({ synced, failed: failures.length, failures });
  } catch (error) {
    return serverError(error, "Synchronisation impossible.");
  }
}
