import { NextRequest, NextResponse } from "next/server";
import { createMetaCampaign } from "@/lib/meta";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, campaignName, objective, dailyBudget, adAccountId, accessToken } = body;

    const token = accessToken || process.env.META_ACCESS_TOKEN_LONG_LIVED;
    const accountId = adAccountId || process.env.META_AD_ACCOUNT_ID;

    let metaResponseId = `meta_sim_${Date.now()}`;

    // Si les clés Meta réelles sont fournies, on effectue le véritable appel API Meta
    if (token && accountId) {
      const result = await createMetaCampaign({
        adAccountId: accountId,
        name: campaignName,
        objective: objective || "OUTCOME_SALES",
        dailyBudget: Number(dailyBudget) || 20,
        accessToken: token,
      });
      metaResponseId = result.id;
    }

    // Sauvegarde de la campagne dans Supabase
    const supabase = getServiceSupabase();
    const { data: dbCampaign, error: dbError } = await supabase
      .from("meta_campaigns")
      .insert([
        {
          offer_id: offerId || null,
          campaign_name: campaignName,
          meta_campaign_id: metaResponseId,
          objective: objective || "OUTCOME_SALES",
          daily_budget: Number(dailyBudget) || 20,
          status: "PAUSED",
        },
      ])
      .select()
      .single();

    return NextResponse.json({
      success: true,
      metaCampaignId: metaResponseId,
      campaign: dbCampaign,
      isSimulated: !token || !accountId,
      message: token && accountId
        ? "Campagne Meta créée avec succès sur votre compte publicitaire !"
        : "Campagne enregistrée en mode cockpit (ajoutez vos identifiants Meta dans .env.local pour le live).",
    });
  } catch (error: any) {
    console.error("Erreur création campagne Meta :", error);
    return NextResponse.json(
      { error: error?.message || "Impossible de créer la campagne publicitaire." },
      { status: 500 }
    );
  }
}
