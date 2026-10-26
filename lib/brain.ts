import "server-only";
import OpenAI from "openai";
import { brainAnalysisSchema, type BrainAnalysis, type OfferInput } from "@/lib/schemas";
import { buildDemoAnalysis } from "@/lib/brain-demo";

export type AnalysisSource = "ai" | "demo";

export interface BrainResult {
  analysis: BrainAnalysis;
  source: AnalysisSource;
  /** Renseigné si l'IA était configurée mais a échoué (le démo prend le relais, visiblement). */
  fallbackReason?: string;
}

export const brainConfigured = () => Boolean(process.env.LLAMA_API_KEY || process.env.OPENAI_API_KEY);

const AFRICA = /cameroun|côte d|cote d|sénégal|senegal|congo|gabon|mali|bénin|benin|togo|burkina|guinée|guinee|rdc|afrique/i;

function buildSystemPrompt(input: OfferInput) {
  const africa = input.targetLocations.some((l) => AFRICA.test(l));
  const local = africa
    ? `Marché Afrique francophone : écris en français direct et vendeur (pas corporate), cite les contextes locaux réels (Mobile Money, WhatsApp, paiement à la livraison, villes comme Douala, Yaoundé, Bafoussam, Abidjan, Dakar quand pertinent), prix en ${input.currency}.`
    : `Adapte le ton, les références culturelles et les prix (${input.currency}) aux zones ciblées.`;

  return `Tu es SION ADS BRAIN : directeur marketing, copywriter réponse directe et media buyer Meta Ads.
${local}

RÈGLES
- N'invente JAMAIS de témoignage, de chiffre de ventes, de statistique ou de nom de client réel. Les preuves sociales sont des emplacements à compléter, formulés comme "[à remplacer par un vrai témoignage]".
- Type d'offre "${input.offerType}" : ${
    input.offerType === "physical"
      ? "visuels lifestyle photoréalistes reflétant la population locale + packshots fond blanc."
      : "mockups 3D / dashboards / appareils pour le digital, scènes d'usage pour les services."
  }
- ${input.strategyMode === "custom" && input.customStrategy ? `Structure imposée par l'utilisateur, à respecter : "${input.customStrategy}".` : "Propose l'architecture de campagne optimale."}
- 3 personas, 4 angles, 6 objections traitées, 3 copies par angle principal (AIDA, PAS, Hook_Story_Offer), 5 hooks Reels de 0 à 3 s, 2 scripts vidéo (15 s et 25 s), 2 prompts bannières et 2 prompts mockups/packshots en anglais avec ratio (--ar).
- Réponds par UN SEUL objet JSON, sans texte autour, avec exactement ces clés :
{"positioning":{"title","unique_value_proposition","target_market_summary","recommended_pricing","market_sophistication_level"},
"personas":[{"name","demographics","location","core_pains":[],"secret_desires":[],"frequent_objections":[],"preferred_platforms":[]}],
"angles":[{"id":1,"name","psychological_trigger","hook_example","visual_concept"}],
"objections_handling":[{"objection","counter_argument"}],
"copies":[{"angle_id":1,"framework":"AIDA|PAS|Hook_Story_Offer","hook","body","cta"}],
"reels_hooks":[],
"visual_prompts":{"banners_and_lifestyle":[],"mockups_or_packshots":[]},
"video_scripts":[{"duration","hook_0_3s","core_message","cta","voiceover_script","on_screen_text"}],
"meta_ads_strategy":{"recommended_budget_daily","campaign_structure","audience_targeting","kpi_targets":{"expected_ctr","max_cpc","target_roas"}}}`;
}

function extractJson(content: string) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Réponse IA sans JSON.");
  return JSON.parse(content.slice(start, end + 1));
}

export async function generateBrainAnalysis(input: OfferInput): Promise<BrainResult> {
  if (!brainConfigured()) {
    return { analysis: buildDemoAnalysis(input), source: "demo" };
  }

  const useLlama = Boolean(process.env.LLAMA_API_KEY);
  const client = new OpenAI({
    apiKey: (process.env.LLAMA_API_KEY || process.env.OPENAI_API_KEY)!,
    baseURL: useLlama ? "https://api.llama.com/compat/v1" : undefined,
    timeout: 90_000,
  });
  const model = useLlama
    ? process.env.LLAMA_MODEL || "Llama-4-Maverick-17B-128E-Instruct-FP8"
    : process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: buildSystemPrompt(input) },
        {
          role: "user",
          content: `Offre : ${input.title}\nType : ${input.offerType}\nZones : ${input.targetLocations.join(", ")}\nDevise : ${input.currency}\n\nDescription brute :\n${input.rawInput}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Réponse vide du modèle.");

    const analysis = brainAnalysisSchema.parse(extractJson(content));
    if (analysis.angles.length === 0 || analysis.copies.length === 0) {
      throw new Error("Analyse incomplète (aucun angle ou aucune copie).");
    }
    return { analysis, source: "ai" };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("[brain] échec IA, bascule démo :", reason);
    return { analysis: buildDemoAnalysis(input), source: "demo", fallbackReason: reason };
  }
}
