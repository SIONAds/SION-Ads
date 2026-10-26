import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export const unauthorized = () => NextResponse.json({ error: "Non authentifié." }, { status: 401 });

export function badRequest(error: ZodError) {
  const message = error.issues.map((i) => i.message).join(" · ");
  return NextResponse.json({ error: message || "Requête invalide." }, { status: 400 });
}

/** Traduit les erreurs Postgres/PostgREST les plus probables en message actionnable. */
export function dbMessage(error: { code?: string; message: string }) {
  if (error.code === "42703" || error.code === "PGRST204" || /owner_id/.test(error.message)) {
    return "Base non migrée : exécutez supabase/migrations/0002_secure_rls.sql dans le SQL Editor de Supabase.";
  }
  if (error.code === "42P01" || error.code === "PGRST205") {
    return "Tables absentes : exécutez supabase/migrations/0001_init.sql puis 0002_secure_rls.sql.";
  }
  return error.message;
}

export function serverError(error: unknown, fallback: string) {
  console.error(fallback, error);
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}
