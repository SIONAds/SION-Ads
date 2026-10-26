/** Devises sans sous-unité : Meta attend le montant tel quel (pas de ×100). */
const ZERO_DECIMAL = new Set(["XAF", "XOF", "JPY", "KRW", "VND", "CLP", "RWF", "UGX", "GNF", "PYG"]);

export function toMetaMinorUnits(amount: number, currency: string) {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? Math.round(amount) : Math.round(amount * 100);
}

export function formatMoney(amount: number, currency: string) {
  const code = currency.toUpperCase();
  const label = code === "XAF" ? "FCFA" : code;
  const digits = ZERO_DECIMAL.has(code) ? 0 : 2;
  const n = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
  return `${n} ${label}`;
}

export function formatPct(value: number, digits = 2) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(value)} %`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

export function defaultDailyBudget(currency: string) {
  return ["XAF", "XOF"].includes(currency.toUpperCase()) ? 5000 : 10;
}

export const CURRENCIES = [
  { code: "XAF", label: "FCFA (XAF)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "USD", label: "Dollar US (USD)" },
  { code: "CAD", label: "Dollar canadien (CAD)" },
] as const;

export const OFFER_TYPES = [
  { id: "digital", label: "Produit digital", hint: "Formation, ebook, SaaS, template" },
  { id: "physical", label: "Produit physique", hint: "E-commerce, dropshipping, paiement à la livraison" },
  { id: "service", label: "Service", hint: "Prestation, accompagnement, agence" },
  { id: "lead_gen", label: "Génération de leads", hint: "Formulaire, rendez-vous, WhatsApp" },
] as const;
