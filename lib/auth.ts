import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAllowedEmail } from "@/lib/auth-shared";

/** À appeler dans chaque page/layout protégé : la vérification réelle, le proxy n'étant qu'un filtre. */
export async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user || !isAllowedEmail(data.user.email)) redirect("/login");
  return { supabase, user: data.user };
}

/** Pour les route handlers : renvoie null si non autorisé. */
export async function getApiUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user || !isAllowedEmail(data.user.email)) return null;
  return { supabase, user: data.user };
}
