import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { EmptyState, PageHeader, StatusBadge } from "@/components/page-kit";

export const metadata: Metadata = { title: "Mes offres" };

const TYPE_LABEL: Record<string, string> = {
  digital: "Digital",
  physical: "Physique",
  service: "Service",
  lead_gen: "Leads",
};

export default async function OffersPage() {
  const { supabase } = await requireUser();
  const { data: offers, error } = await supabase
    .from("offers")
    .select("id,title,offer_type,currency,target_locations,status,created_at,analysis_source")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Mes offres"
        description="Chaque offre regroupe sa stratégie, ses copies, ses créatifs et ses campagnes."
        action={
          <Link href="/offers/new" className="btn btn-primary">
            <Plus size={16} aria-hidden="true" /> Nouvelle mission
          </Link>
        }
      />
      {error && <p role="alert" className="mb-4 rounded-lg border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">{error.message}</p>}
      {!offers || offers.length === 0 ? (
        <EmptyState title="Aucune offre" text="Lancez votre première mission pour la voir apparaître ici." href="/offers/new" cta="Nouvelle mission" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {offers.map((o) => (
            <li key={o.id}>
              <Link href={`/offers/${o.id}`} className="card block h-full p-5 transition-colors hover:border-line-strong">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-snug">{o.title}</h2>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-2 text-sm text-muted">{(o.target_locations as string[]).join(", ")}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="badge">{TYPE_LABEL[o.offer_type] ?? o.offer_type}</span>
                  <span className="badge">{o.currency === "XAF" ? "FCFA" : o.currency}</span>
                  {o.analysis_source === "demo" && <span className="badge badge-sun">Démo</span>}
                  <span className="ml-auto text-xs text-faint">{formatDate(o.created_at)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
