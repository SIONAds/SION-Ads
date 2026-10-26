import "server-only";
import { brainConfigured } from "@/lib/brain";
import { metaAdsConfigured, metaPageConfigured } from "@/lib/meta";
import { createAdminClient } from "@/lib/supabase/admin";

export interface Diagnostics {
  supabase: boolean;
  migrated: boolean;
  rlsProtected: boolean;
  ai: boolean;
  aiProvider: "llama" | "openai" | null;
  metaAds: boolean;
  metaPage: boolean;
  ownerRestriction: boolean;
}

/** État de santé de l'installation, affiché dans Réglages et sur le tableau de bord. */
export async function getDiagnostics(): Promise<Diagnostics> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const admin = createAdminClient();

  let migrated = false;
  let rlsProtected = false;

  if (admin) {
    const { error } = await admin.from("offers").select("owner_id").limit(1);
    migrated = !error;
  }

  if (url && anon && migrated) {
    try {
      const res = await fetch(`${url}/rest/v1/offers?select=id&limit=1`, {
        headers: { apikey: anon },
        cache: "no-store",
      });
      if (res.status === 401 || res.status === 403) rlsProtected = true;
      else if (res.ok) rlsProtected = ((await res.json()) as unknown[]).length === 0;
    } catch {
      rlsProtected = false;
    }
  }

  return {
    supabase: Boolean(url && anon),
    migrated,
    rlsProtected,
    ai: brainConfigured(),
    aiProvider: process.env.LLAMA_API_KEY ? "llama" : process.env.OPENAI_API_KEY ? "openai" : null,
    metaAds: metaAdsConfigured(),
    metaPage: metaPageConfigured(),
    ownerRestriction: Boolean(process.env.OWNER_EMAILS?.trim()),
  };
}
