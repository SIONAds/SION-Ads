import type { Metadata } from "next";
import { CircleAlert, CircleCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getDiagnostics } from "@/lib/diagnostics";
import { PageHeader } from "@/components/page-kit";

export const metadata: Metadata = { title: "Réglages" };

export default async function SettingsPage() {
  const { user } = await requireUser();
  const d = await getDiagnostics();

  const groups = [
    {
      title: "Base de données",
      items: [
        { ok: d.supabase, label: "Connexion Supabase", fix: "Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY." },
        { ok: d.migrated, label: "Schéma à jour (propriétaire des lignes)", fix: "Exécutez supabase/migrations/0002_secure_rls.sql dans le SQL Editor." },
        { ok: d.rlsProtected, label: "Accès public fermé (RLS)", fix: "Sans la migration, la clé anon publique peut lire et écrire vos données." },
        { ok: d.ownerRestriction, label: "Inscription restreinte (OWNER_EMAILS)", fix: "Optionnel : listez vos emails pour interdire d'autres comptes.", optional: true },
      ],
    },
    {
      title: "Moteur IA",
      items: [
        {
          ok: d.ai,
          label: d.aiProvider === "llama" ? "Llama API connectée" : d.aiProvider === "openai" ? "OpenAI connecté" : "Clé IA",
          fix: "Sans clé, les analyses passent en mode démo (modèle de base). Ajoutez LLAMA_API_KEY ou OPENAI_API_KEY.",
        },
      ],
    },
    {
      title: "Meta",
      items: [
        { ok: d.metaAds, label: "Compte publicitaire", fix: "Ajoutez META_ACCESS_TOKEN_LONG_LIVED et META_AD_ACCOUNT_ID." },
        { ok: d.metaPage, label: "Page Facebook (publication)", fix: "Ajoutez META_PAGE_ID.", optional: true },
      ],
    },
  ];

  return (
    <>
      <PageHeader title="Réglages" description="État de l'installation. Les clés se configurent dans les variables d'environnement, jamais dans l'interface." />

      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Compte</h2>
          <p className="mt-2 text-muted">Connecté en tant que <span className="text-text">{user.email}</span></p>
        </section>

        {groups.map((g) => (
          <section key={g.title} className="card p-6">
            <h2 className="text-lg font-semibold">{g.title}</h2>
            <ul className="mt-4 space-y-4">
              {g.items.map((it) => (
                <li key={it.label} className="flex items-start gap-3">
                  {it.ok ? (
                    <CircleCheck size={19} className="mt-0.5 shrink-0 text-ok" aria-label="OK" />
                  ) : (
                    <CircleAlert size={19} className={`mt-0.5 shrink-0 ${"optional" in it && it.optional ? "text-faint" : "text-sun"}`} aria-label="À configurer" />
                  )}
                  <div>
                    <p className="font-medium">{it.label}</p>
                    {!it.ok && <p className="mt-0.5 text-sm text-muted">{it.fix}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
