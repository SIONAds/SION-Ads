import { NextRequest, NextResponse } from "next/server";
import { generateBrainAnalysis, OfferInput } from "@/lib/brain";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      offerType,
      targetLocations,
      currency,
      strategyMode,
      customStrategy,
      rawInput,
    } = body;

    if (!title || !rawInput) {
      return NextResponse.json(
        { error: "Le titre et la description de l'offre sont requis." },
        { status: 400 }
      );
    }

    const offerPayload: OfferInput = {
      title,
      offerType: offerType || "digital",
      targetLocations: Array.isArray(targetLocations) && targetLocations.length > 0 ? targetLocations : ["France"],
      currency: currency || "EUR",
      strategyMode: strategyMode || "ai_recommended",
      customStrategy: customStrategy || "",
      rawInput,
    };

    // 1. Génération de l'analyse IA Brain
    const analysisResult = await generateBrainAnalysis(offerPayload);

    // 2. Sauvegarde dans Supabase
    const supabase = getServiceSupabase();
    const { data: insertedOffer, error: dbError } = await supabase
      .from("offers")
      .insert([
        {
          title: offerPayload.title,
          offer_type: offerPayload.offerType,
          target_locations: offerPayload.targetLocations,
          currency: offerPayload.currency,
          strategy_mode: offerPayload.strategyMode,
          custom_strategy: offerPayload.customStrategy,
          raw_input: offerPayload.rawInput,
          brain_analysis: analysisResult,
          status: "analyzed",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.warn("Avertissement sauvegarde Supabase (vérifiez les tables) :", dbError.message);
      // On retourne quand même l'analyse générée pour ne pas bloquer l'expérience utilisateur
      return NextResponse.json({
        success: true,
        analysis: analysisResult,
        dbSaved: false,
        warning: dbError.message,
      });
    }

    return NextResponse.json({
      success: true,
      offer: insertedOffer,
      analysis: analysisResult,
      dbSaved: true,
    });
  } catch (error: any) {
    console.error("Erreur API Brain :", error);
    return NextResponse.json(
      { error: error?.message || "Erreur interne lors de l'analyse." },
      { status: 500 }
    );
  }
}
