import { z } from "zod";

export const offerInputSchema = z.object({
  title: z.string().trim().min(2, "Le nom de l'offre est requis.").max(160),
  offerType: z.enum(["digital", "physical", "service", "lead_gen"]).default("digital"),
  targetLocations: z.array(z.string().trim().min(1).max(60)).min(1, "Indiquez au moins une zone.").max(12),
  currency: z.string().trim().length(3).toUpperCase().default("XAF"),
  strategyMode: z.enum(["ai_recommended", "custom"]).default("ai_recommended"),
  customStrategy: z.string().trim().max(1500).optional().default(""),
  rawInput: z.string().trim().min(15, "Décrivez l'offre en quelques phrases au minimum.").max(8000),
});
export type OfferInput = z.infer<typeof offerInputSchema>;

const str = z.string().catch("");
const strList = z.array(z.string()).catch([]);

/** Schéma tolérant : un LLM omet parfois un champ, on ne plante pas pour autant. */
export const brainAnalysisSchema = z.object({
  positioning: z.object({
    title: str,
    unique_value_proposition: str,
    target_market_summary: str,
    recommended_pricing: str,
    market_sophistication_level: str,
  }),
  personas: z
    .array(
      z.object({
        name: str,
        demographics: str,
        location: str,
        core_pains: strList,
        secret_desires: strList,
        frequent_objections: strList,
        preferred_platforms: strList,
      }),
    )
    .catch([]),
  angles: z
    .array(
      z.object({
        id: z.coerce.number().catch(0),
        name: str,
        psychological_trigger: str,
        hook_example: str,
        visual_concept: str,
      }),
    )
    .catch([]),
  objections_handling: z.array(z.object({ objection: str, counter_argument: str })).catch([]),
  copies: z
    .array(
      z.object({
        angle_id: z.coerce.number().catch(0),
        framework: str,
        hook: str,
        body: str,
        cta: str,
      }),
    )
    .catch([]),
  reels_hooks: strList,
  visual_prompts: z
    .object({ banners_and_lifestyle: strList, mockups_or_packshots: strList })
    .catch({ banners_and_lifestyle: [], mockups_or_packshots: [] }),
  video_scripts: z
    .array(
      z.object({
        duration: str,
        hook_0_3s: str,
        core_message: str,
        cta: str,
        voiceover_script: str,
        on_screen_text: str,
      }),
    )
    .catch([]),
  meta_ads_strategy: z.object({
    recommended_budget_daily: str,
    campaign_structure: str,
    audience_targeting: str,
    kpi_targets: z
      .object({ expected_ctr: str, max_cpc: str, target_roas: str })
      .catch({ expected_ctr: "", max_cpc: "", target_roas: "" }),
  }),
});
export type BrainAnalysis = z.infer<typeof brainAnalysisSchema>;

export const campaignInputSchema = z.object({
  offerId: z.string().uuid(),
  objective: z.enum(["OUTCOME_SALES", "OUTCOME_LEADS", "OUTCOME_TRAFFIC"]).default("OUTCOME_SALES"),
  dailyBudget: z.coerce.number().positive().max(10_000_000),
  campaignName: z.string().trim().min(3).max(200).optional(),
});

export const publishInputSchema = z.object({
  message: z.string().trim().min(1).max(5000),
  mediaUrl: z.string().url().optional(),
});
