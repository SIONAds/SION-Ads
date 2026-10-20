import OpenAI from "openai";

export interface OfferInput {
  title: string;
  offerType: "digital" | "physical" | "service" | "lead_gen";
  targetLocations: string[];
  currency: string;
  strategyMode: "ai_recommended" | "custom";
  customStrategy?: string;
  rawInput: string;
}

export interface BrainAnalysisResult {
  positioning: {
    title: string;
    unique_value_proposition: string;
    target_market_summary: string;
    recommended_pricing: string;
    market_sophistication_level: string; // E.g., "Niveau 3 - Marché concurrentiel avec promesses fortes"
  };
  personas: Array<{
    name: string;
    demographics: string;
    location: string;
    core_pains: string[];
    secret_desires: string[];
    frequent_objections: string[];
    preferred_platforms: string[];
  }>;
  angles: Array<{
    id: number;
    name: string;
    psychological_trigger: string;
    hook_example: string;
    visual_concept: string;
  }>;
  objections_handling: Array<{
    objection: string;
    counter_argument: string;
  }>;
  copies: Array<{
    angle_id: number;
    framework: "AIDA" | "PAS" | "Hook_Story_Offer";
    hook: string;
    body: string;
    cta: string;
  }>;
  visual_prompts: {
    banners_and_lifestyle: string[];
    mockups_or_packshots: string[];
  };
  video_scripts: Array<{
    duration: string;
    hook_0_3s: string;
    core_message: string;
    cta: string;
    voiceover_script: string;
    on_screen_text: string;
  }>;
  meta_ads_strategy: {
    recommended_budget_daily: string;
    campaign_structure: string;
    audience_targeting: string;
    kpi_targets: {
      expected_ctr: string;
      max_cpc: string;
      target_roas: string;
    };
  };
}

export async function generateBrainAnalysis(input: OfferInput): Promise<BrainAnalysisResult> {
  const apiKey = process.env.LLAMA_API_KEY || process.env.OPENAI_API_KEY;

  // Si aucune clé n'est encore configurée, fournir une simulation réaliste complète et adaptée
  if (!apiKey) {
    return generateSmartMockAnalysis(input);
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: process.env.LLAMA_API_KEY ? "https://api.llama.com/compat/v1" : undefined,
  });

  const systemPrompt = `Tu es SION ADS BRAIN, le directeur marketing, media buyer et stratège Meta Ads de classe mondiale.
Tu conçois des campagnes marketing hautement rentables pour n'importe quel type de produit (digital, physique, service) et n'importe quel marché géographique ciblé.

DIRECTIVES CRUCIALES :
1. Adapte le ton, la monnaie (${input.currency}), les références culturelles et les insights psychologiques aux zones cibles suivantes : ${input.targetLocations.join(", ")}.
2. Si le type est "digital" (formation, ebook, SaaS, template), concentre les visuels sur des mockups 3D futuristes (tablettes, ordinateurs, dashboards, boîtes premium).
3. Si le type est "physical", concentre les visuels sur des photos lifestyle ultra-photoréalistes reflétant fidèlement la population locale et des packshots épurés.
4. Si le mode de stratégie est personnalisé (${input.strategyMode} === "custom"), respecte scrupuleusement la structure demandée : "${input.customStrategy}". Sinon, propose l'architecture optimale.
5. Ta réponse DOIT ÊTRE UN UNIQUE JSON STRICT respectant l'interface BrainAnalysisResult, sans texte d'introduction ni de conclusion.`;

  const userPrompt = `Offre à analyser :
- Titre : ${input.title}
- Type : ${input.offerType}
- Territoires cibles : ${input.targetLocations.join(", ")}
- Devise : ${input.currency}
- Description & Informations brutes :
${input.rawInput}`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.LLAMA_API_KEY ? "Llama-4-Maverick" : "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Réponse vide du modèle d'IA");

    return JSON.parse(content) as BrainAnalysisResult;
  } catch (error) {
    console.error("Erreur appel API IA Brain, fallback sur mock intelligent :", error);
    return generateSmartMockAnalysis(input);
  }
}

// Générateur intelligent pour tester le flux complet instantanément
export function generateSmartMockAnalysis(input: OfferInput): BrainAnalysisResult {
  const isDigital = input.offerType === "digital" || input.offerType === "service";
  const locationsStr = input.targetLocations.join(", ");

  return {
    positioning: {
      title: input.title,
      unique_value_proposition: isDigital
        ? `Le système tout-en-un pour accélérer vos résultats en ${locationsStr} sans perdre des mois d'essais-erreurs.`
        : `La solution incontournable pour un résultat visible dès la première semaine, livrée chez vous en ${locationsStr}.`,
      target_market_summary: `Audience ciblée activement sur Meta (Facebook & Instagram) dans la zone [${locationsStr}]. Recherche d'efficacité, de simplicité et de preuves concrètes.`,
      recommended_pricing: `${isDigital ? "47" : "15 000"} ${input.currency}`,
      market_sophistication_level: "Niveau 3 - Marché averti nécessitant un mécanisme unique fort et de la réassurance immédiate.",
    },
    personas: [
      {
        name: isDigital ? "Alexandre - L'Entrepreneur Ambitieux" : "Sophie - La Consommatrice Exigeante",
        demographics: "30-45 ans, connecté, pouvoir d'achat moyen à élevé",
        location: locationsStr,
        core_pains: [
          "Perte de temps avec des méthodes obsolètes qui ne donnent rien",
          "Difficulté à trouver une solution claire, sans jargon complexe",
          "Manque de confiance face aux promesses non tenues du marché",
        ],
        secret_desires: [
          "Obtenir des résultats rapides et mesurables pour passer un cap",
          "Gagner en sérénité et automatiser ses tâches récurrentes",
          "Être reconnu pour ses bons choix et son efficacité",
        ],
        frequent_objections: [
          "Est-ce que ça va vraiment fonctionner pour mon cas particulier ?",
          "Combien de temps faut-il pour voir les premiers effets ?",
          "Le support ou le service après-vente est-il fiable ?",
        ],
        preferred_platforms: ["Instagram Feed & Stories", "Facebook Feed", "Reels"],
      },
      {
        name: "Marc - Le Gestionnaire Pragmatique",
        demographics: "25-40 ans, axé sur le retour sur investissement",
        location: locationsStr,
        core_pains: [
          "Budget gaspillé dans des outils ou produits inefficaces",
          "Surcharge d'informations contradictoires",
        ],
        secret_desires: [
          "Un protocole clé en main avec garantie de résultat",
          "Un accompagnement transparent",
        ],
        frequent_objections: ["Est-ce rentable ?", "Y a-t-il une garantie ?"],
        preferred_platforms: ["Facebook Mobile Feed", "Reels"],
      },
    ],
    angles: [
      {
        id: 1,
        name: "L'Angle Efficacité & Gain de Temps Immédiat",
        psychological_trigger: "Soulagement de la charge mentale et résultats rapides sans friction.",
        hook_example: `Si vous êtes en ${locationsStr} et que vous cherchez une méthode validée pour ${input.title}, arrêtez de compliquer les choses.`,
        visual_concept: isDigital
          ? "Mockup 3D néon avec écran tactile montrant un tableau de bord épuré et des métriques en hausse"
          : "Photo lifestyle naturelle gros plan haute définition mettant en valeur le produit en usage réel",
      },
      {
        id: 2,
        name: "L'Angle Preuve Sociale & Recommandation",
        psychological_trigger: "Sécurité psychologique apportée par la communauté et le témoignage réel.",
        hook_example: `Pourquoi des centaines de personnes en ${locationsStr} adoptent ce système ce mois-ci ?`,
        visual_concept: "Visuel avant/après avec badge de certification et témoignage incrusté style capture mobile",
      },
      {
        id: 3,
        name: "L'Angle Comparatif 'Avant vs Après'",
        psychological_trigger: "Contraste puissant entre l'ancienne méthode pénible et le nouveau raccourci.",
        hook_example: `La différence entre galérer pendant 6 mois et débloquer ses résultats en 7 jours réside dans ce détail...`,
        visual_concept: "Format split 50/50 comparant le chaos d'un côté et la clarté ordonnée de l'autre",
      },
    ],
    objections_handling: [
      {
        objection: "Est-ce adapté à mon niveau de compétence ou à ma situation ?",
        counter_argument: "Le système a été conçu pour être pris en main en quelques minutes, guidé pas à pas avec des exemples réels.",
      },
      {
        objection: "Que se passe-t-il si je ne suis pas satisfait ?",
        counter_argument: "Garantie intégrale 'Satisfait ou remboursé' sans justification sous 30 jours pour éliminer tout risque.",
      },
      {
        objection: "Est-ce sécurisé ?",
        counter_argument: "Paiement 100% crypté et sécurisé avec confirmation instantanée par email et SMS.",
      },
    ],
    copies: [
      {
        angle_id: 1,
        framework: "AIDA",
        hook: `Vous en avez assez de perdre du temps avec des solutions qui ne tiennent pas leurs promesses ?`,
        body: `Voici exactement pourquoi ${input.title} change la donne : une structure pensée pour vous offrir un résultat direct, sans compromis sur la qualité. Conçu sur-mesure pour répondre aux besoins concrets des utilisateurs en ${locationsStr}.`,
        cta: `👉 Cliquez ici pour découvrir l'offre complète et sécuriser votre accès maintenant.`,
      },
      {
        angle_id: 1,
        framework: "PAS",
        hook: `Le problème n'est pas votre motivation, c'est l'outil que vous utilisez.`,
        body: `Passer des heures à tester des méthodes sans savoir ce qui fonctionne est le moyen le plus rapide d'abandonner. Avec ${input.title}, vous suivez un protocole clair, éprouvé et orienté résultats.`,
        cta: `Passez à la vitesse supérieure dès aujourd'hui avant la hausse du tarif !`,
      },
      {
        angle_id: 2,
        framework: "Hook_Story_Offer",
        hook: `Il y a encore 3 semaines, Marc hésitait encore...`,
        body: `Comme beaucoup, il avait déjà essayé d'autres alternatives sans succès. Mais après avoir testé notre approche, il a obtenu ses premiers retours en moins d'une semaine. Aujourd'hui, il ne ferait marche arrière pour rien au monde.`,
        cta: `Rejoignez ceux qui ont franchi le pas : Cliquez ici pour voir la démonstration.`,
      },
    ],
    visual_prompts: {
      banners_and_lifestyle: isDigital
        ? [
            "Hyper-realistic 3D rendering of sleek modern digital workspace, glowing glass screens displaying high conversion analytics, dark aesthetic with electric cyan and purple accents, cinema 4D, 8k resolution --ar 1:1",
            "Story format 9:16 vertical banner with clean typography, dynamic floating badges, futuristic UI dashboard mockup, studio lighting, photorealistic --ar 9:16",
          ]
        : [
            `High-end lifestyle photography, authentic consumer in modern environment in ${locationsStr}, holding the product, soft window light, shot on 85mm f/1.4 lens, natural skin texture, realistic color grading --ar 1:1`,
            `Clean aesthetic vertical video thumbnail 9:16 showing product in action, vibrant modern background, sharp focus, 8k --ar 9:16`,
          ],
      mockups_or_packshots: [
        "Minimalist luxury packshot on solid neutral background, soft subtle drop shadow, professional commercial product photography, 8k --ar 1:1",
        "Multi-device bundle mockup featuring modern laptop, tablet and smartphone showing sleek dashboard interface, isometric angle, clean studio lighting --ar 16:9",
      ],
    },
    video_scripts: [
      {
        duration: "25s",
        hook_0_3s: "Stop ! Si vous cherchez encore comment réussir avec votre offre en 2026, regardez ceci.",
        core_message: "La majorité des gens font cette erreur critique au départ. Voici la méthode exacte qui permet de tout simplifier et d'avoir des résultats dès la première semaine.",
        cta: "Le lien est juste en dessous de la vidéo, cliquez pour voir la suite !",
        voiceover_script: "Arrêtez de perdre votre temps avec des méthodes qui ne marchent pas. Avec cette approche éprouvée, vous obtenez un résultat clair et mesurable. Cliquez sur le lien pour découvrir la démonstration.",
        on_screen_text: "Police Anton, mots clés en surbrillance jaune/vert style Hormozi, dynamique et captivant",
      },
    ],
    meta_ads_strategy: {
      recommended_budget_daily: `25.00 ${input.currency}`,
      campaign_structure: "1 Campagne CBO (Advantage Budget) - 3 Ensembles de publicités (Broad / Intérêts spécifiques / Reciblage) - 2 à 3 créatifs par ensemble",
      audience_targeting: `Ciblage géographique : [${locationsStr}] | Âge : 25-54 ans | Placement automatique Meta Advantage+ (Feed, Reels, Stories)`,
      kpi_targets: {
        expected_ctr: "> 2.2%",
        max_cpc: `< 0.45 ${input.currency}`,
        target_roas: "> 3.0x",
      },
    },
  };
}
