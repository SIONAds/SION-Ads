import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Client public Supabase (utilisable côté client et serveur pour requêtes standard)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client administrateur avec clé de service (actions serveur sécurisées, bypass RLS si nécessaire)
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY manquante, utilisation de anonKey.");
    return supabase;
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
