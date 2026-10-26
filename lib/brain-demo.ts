import type { BrainAnalysis, OfferInput } from "@/lib/schemas";
import { formatMoney } from "@/lib/format";

/**
 * Analyse de démonstration : sert à parcourir tout le flux sans clé IA.
 * Elle est toujours étiquetée "démo" dans l'interface et n'invente aucun témoignage.
 */
export function buildDemoAnalysis(input: OfferInput): BrainAnalysis {
  const zones = input.targetLocations.join(", ");
  const t = input.title;
  const physical = input.offerType === "physical";
  const lead = input.offerType === "lead_gen";
  const priceBase = ["XAF", "XOF"].includes(input.currency) ? (physical ? 15000 : 25000) : physical ? 29 : 47;
  const gist = input.rawInput.replace(/\s+/g, " ").slice(0, 140);
  const payment = physical ? "Paiement à la livraison" : "Accès immédiat après paiement";

  return {
    positioning: {
      title: t,
      unique_value_proposition: `${t} : ${gist}${gist.length >= 140 ? "…" : ""}`,
      target_market_summary: `Audience Meta (Facebook, Instagram, Reels) en ${zones}, sensible à la preuve concrète, au prix clair et à un achat sans risque.`,
      recommended_pricing: `À tester autour de ${formatMoney(priceBase, input.currency)} (3 paliers A/B recommandés)`,
      market_sophistication_level: "Niveau 3 : marché averti, il faut un mécanisme unique et une réassurance immédiate.",
    },
    personas: [
      {
        name: "Le décideur pressé",
        demographics: "28-40 ans, actif, achète depuis son téléphone",
        location: zones,
        core_pains: ["Perd du temps avec des solutions qui ne tiennent pas leurs promesses", "Ne sait pas à qui faire confiance en ligne"],
        secret_desires: ["Un résultat visible vite", "Être sûr de ne pas se faire avoir"],
        frequent_objections: ["Est-ce que ça marche pour mon cas ?", "Et si je ne suis pas satisfait ?"],
        preferred_platforms: ["Facebook Feed", "Reels", "WhatsApp"],
      },
      {
        name: "Le comparateur prudent",
        demographics: "25-45 ans, compare les prix et lit les avis",
        location: zones,
        core_pains: ["Budget limité, peur du gaspillage", "Trop d'offres similaires"],
        secret_desires: ["Le meilleur rapport qualité/prix", "Une garantie claire"],
        frequent_objections: ["C'est trop cher ?", "Y a-t-il une garantie ?"],
        preferred_platforms: ["Facebook Mobile", "Instagram Stories"],
      },
    ],
    angles: [
      { id: 1, name: "Résultat rapide", psychological_trigger: "Soulagement et gain de temps", hook_example: `Arrêtez de perdre du temps : voici comment ${t} change la donne en ${zones}.`, visual_concept: physical ? "Produit en usage réel, lumière naturelle" : "Mockup d'écran avec résultat concret" },
      { id: 2, name: "Réassurance", psychological_trigger: "Sécurité et confiance", hook_example: `${payment}. Vous ne payez que si vous êtes convaincu.`, visual_concept: "Badges garantie / livraison / support, fond sobre" },
      { id: 3, name: "Avant / Après", psychological_trigger: "Contraste et désir", hook_example: "La différence entre continuer comme avant et passer à autre chose tient à une décision.", visual_concept: "Split 50/50 avant-après" },
    ],
    objections_handling: [
      { objection: "Est-ce adapté à ma situation ?", counter_argument: "Montrer 2 cas d'usage précis et inviter à poser la question en message privé." },
      { objection: "Et si je ne suis pas satisfait ?", counter_argument: "[À compléter avec votre vraie politique de garantie / retour]" },
      { objection: "Est-ce sécurisé ?", counter_argument: physical ? "Paiement à la livraison : vous payez en main propre." : "Paiement sécurisé et confirmation immédiate." },
    ],
    copies: [
      { angle_id: 1, framework: "AIDA", hook: `${t} : le résultat sans les mois d'essais.`, body: `Vous en avez assez de tester sans résultat ? ${gist}. Découvrez ${t}, pensé pour ${zones}.`, cta: lead ? "Écrivez-nous sur WhatsApp pour un échange gratuit." : "Cliquez pour commander maintenant." },
      { angle_id: 1, framework: "PAS", hook: "Le problème, ce n'est pas vous. C'est la méthode.", body: `Tester sans repère épuise et coûte cher. ${t} remplace l'à-peu-près par un cadre clair.`, cta: "Voir l'offre complète." },
      { angle_id: 2, framework: "Hook_Story_Offer", hook: `${payment}, sans mauvaise surprise.`, body: `[Ajoutez ici un vrai témoignage client.] Puis présentez l'offre ${t} et la garantie.`, cta: "Réserver le mien." },
    ],
    reels_hooks: ["Stop. Avant d'acheter autre chose, regardez ça.", `Ce que personne ne vous dit sur ${t}.`, "3 erreurs qui vous coûtent de l'argent.", "Je vous montre en 10 secondes.", "Si vous êtes en " + (input.targetLocations[0] ?? "ville") + ", ceci vous concerne."],
    visual_prompts: {
      banners_and_lifestyle: [
        physical
          ? `Authentic lifestyle photo, person using the product at home in ${zones}, natural window light, 85mm, realistic skin texture --ar 1:1`
          : `Clean dark 3D scene, laptop and phone showing a minimal dashboard, soft rim light, cinema 4D look --ar 1:1`,
        `Vertical 9:16 hero banner with space for a bold headline, warm studio lighting, sharp focus --ar 9:16`,
      ],
      mockups_or_packshots: [
        "Minimalist packshot on pure white background, soft shadow, commercial photography --ar 1:1",
        "Multi-device mockup (laptop, tablet, phone) showing the product interface, isometric, studio light --ar 16:9",
      ],
    },
    video_scripts: [
      {
        duration: "15 s",
        hook_0_3s: "Plan serré, texte plein écran : le problème en une phrase.",
        core_message: `Montrer ${t} en action, un bénéfice, une preuve à compléter.`,
        cta: "Lien juste en dessous.",
        voiceover_script: `Vous cherchez une solution qui marche vraiment ? Voici ${t}. ${payment}. Le lien est juste en dessous.`,
        on_screen_text: "Mots clés en gras jaune sur fond noir, sous-titres brûlés",
      },
    ],
    meta_ads_strategy: {
      recommended_budget_daily: formatMoney(["XAF", "XOF"].includes(input.currency) ? 5000 : 10, input.currency),
      campaign_structure: "1 campagne CBO, 3 ensembles (Large / Intérêts / Reciblage), 2 à 3 créatifs par ensemble. Lancer en pause, valider, activer.",
      audience_targeting: `Zones : ${zones}. Âge 22-50. Placements Advantage+ (Feed, Reels, Stories).`,
      kpi_targets: { expected_ctr: "> 1,5 %", max_cpc: ["XAF", "XOF"].includes(input.currency) ? "< 250 FCFA" : "< 0,40", target_roas: "> 2,5x" },
    },
  };
}
