import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/auth";
import { generateBrainAnalysis } from "@/lib/brain";
import { offerInputSchema } from "@/lib/schemas";
import { badRequest, dbMessage, serverError, unauthorized } from "@/lib/api";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const auth = await getApiUser();
  if (!auth) return unauthorized();

  try {
    const parsed = offerInputSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return badRequest(parsed.error);
    const input = parsed.data;

    const { analysis, source, fallbackReason } = await generateBrainAnalysis(input);

    const { data, error } = await auth.supabase
      .from("offers")
      .insert({
        owner_id: auth.user.id,
        title: input.title,
        offer_type: input.offerType,
        target_locations: input.targetLocations,
        currency: input.currency,
        strategy_mode: input.strategyMode,
        custom_strategy: input.customStrategy || null,
        raw_input: input.rawInput,
        brain_analysis: analysis,
        analysis_source: source,
        status: "analyzed",
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: dbMessage(error) }, { status: 500 });

    return NextResponse.json({ offerId: data.id, source, fallbackReason: fallbackReason ?? null });
  } catch (error) {
    return serverError(error, "Erreur lors de l'analyse.");
  }
}
