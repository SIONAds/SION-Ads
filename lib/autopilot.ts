export type Verdict = "kill" | "reduce" | "scale" | "hold" | "learning";

export interface Recommendation {
  verdict: Verdict;
  title: string;
  reason: string;
}

export interface Metrics {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  roas: number;
  conversions: number;
}

/** CPC maximal toléré par devise (règle du cahier des charges : 250 FCFA). */
const MAX_CPC: Record<string, number> = { XAF: 250, XOF: 250, EUR: 0.4, USD: 0.45, CAD: 0.55 };

/**
 * Règles Autopilot. Elles produisent des RECOMMANDATIONS : l'exécution reste manuelle
 * tant que la campagne n'a pas été validée par un humain.
 */
export function evaluateCampaign(m: Metrics, currency: string): Recommendation {
  if (m.impressions < 500) {
    return {
      verdict: "learning",
      title: "Apprentissage",
      reason: `${m.impressions} impressions : attendre 500 minimum avant de juger.`,
    };
  }
  if (m.ctr < 1) {
    return {
      verdict: "kill",
      title: "Couper",
      reason: `CTR ${m.ctr.toFixed(2)} % sous 1 % après ${m.impressions} impressions. Régénérer un créatif V2.`,
    };
  }
  if (m.roas > 2.5) {
    return {
      verdict: "scale",
      title: "Scaler +20 %",
      reason: `ROAS ${m.roas.toFixed(2)}x au-dessus de 2,5x. Monter le budget par paliers de 20 %.`,
    };
  }
  const maxCpc = MAX_CPC[currency.toUpperCase()];
  if (maxCpc && m.cpc > maxCpc) {
    return {
      verdict: "reduce",
      title: "Réduire -20 %",
      reason: `CPC ${m.cpc.toFixed(2)} au-dessus du plafond de ${maxCpc}. Baisser le budget de 20 %.`,
    };
  }
  return { verdict: "hold", title: "Maintenir", reason: "Aucun seuil franchi. Continuer à collecter des données." };
}
