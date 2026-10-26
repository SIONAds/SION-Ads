/** Liste blanche optionnelle (OWNER_EMAILS). Vide = tout compte Supabase valide. */
export function isAllowedEmail(email: string | undefined | null) {
  const raw = process.env.OWNER_EMAILS?.trim();
  if (!raw) return true;
  if (!email) return false;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}
