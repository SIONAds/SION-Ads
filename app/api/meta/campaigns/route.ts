import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/auth";
import { createCboCampaign, metaAdsConfigured } from "@/lib/meta";
import { campaignInputSchema } from "@/lib/schemas";
import { badRequest, dbMessage, serverError, unauthorized } from "@/lib/api";

export async function POST(req: NextRequest) {
  const auth = await getApiUser();
  if (!auth) return unauthorized();

  try {
    const parsed = campaignInputSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return badRequest(parsed.error);
    const input = parsed.data;

    // La RLS garantit que l'offre appartient bien à l'utilisateur connecté.
    const { data: offer, error: offerError } = await auth.supabase
      .from("offers")
      .select("id,title,currency,target_locations")
      .eq("id", input.offerId)
      .single();
    if (offerError || !offer) return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });

    const name = input.campaignName ?? `[SION] ${offer.title} · CBO`;
    const live = metaAdsConfigured();

    let metaId: string | null = null;
    let currency = offer.currency as string;
    if (live) {
      const created = await createCboCampaign({ name, objective: input.objective, dailyBudget: input.dailyBudget });
      metaId = created.id;
      currency = created.currency;
    }

    const { data, error } = await auth.supabase
      .from("meta_campaigns")
      .insert({
        owner_id: auth.user.id,
        offer_id: offer.id,
        meta_campaign_id: metaId,
        campaign_name: name,
        objective: input.objective,
        budget_type: "CBO",
        daily_budget: input.dailyBudget,
        currency,
        status: live ? "PAUSED" : "DRAFT",
        is_simulated: !live,
      })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: dbMessage(error) }, { status: 500 });

    return NextResponse.json({
      campaignId: data.id,
      metaCampaignId: metaId,
      simulated: !live,
      message: live
        ? "Campagne créée sur Meta en PAUSE. Ajoutez vos ensembles et créatifs puis activez-la dans le Gestionnaire de publicités."
        : "Brouillon enregistré. Renseignez META_ACCESS_TOKEN_LONG_LIVED et META_AD_ACCOUNT_ID pour la créer sur Meta.",
    });
  } catch (error) {
    return serverError(error, "Impossible de créer la campagne.");
  }
}
