import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Clé de service : réservé aux diagnostics serveur. Ne jamais l'utiliser pour des données utilisateur. */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
