import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { brainAnalysisSchema } from "@/lib/schemas";
import { metaAdsConfigured } from "@/lib/meta";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/page-kit";
import { OfferView } from "./offer-view";

export const metadata: Metadata = { title: "Offre" };

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { supabase } = await requireUser();
  const { data: offer } = await supabase.from("offers").select("*").eq("id", id).single();
  if (!offer) notFound();

  const parsed = brainAnalysisSchema.safeParse(offer.brain_analysis);
  const { data: campaigns } = await supabase
    .from("meta_campaigns")
    .select("id,campaign_name,status,daily_budget,currency,is_simulated,meta_campaign_id")
    .eq("offer_id", id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Link href="/offers" className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} aria-hidden="true" /> Mes offres
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{offer.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {(offer.target_locations as string[]).join(", ")} · {formatDate(offer.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {offer.analysis_source === "demo" && <span className="badge badge-sun">Analyse démo</span>}
          <StatusBadge status={offer.status} />
        </div>
      </div>

      {offer.analysis_source === "demo" && (
        <p className="mb-6 rounded-lg border border-sun/40 bg-sun/10 px-4 py-3 text-sm text-sun">
          Cette analyse vient du mode démo : un modèle de base, pas une réflexion de l&apos;IA. Ajoutez LLAMA_API_KEY ou
          OPENAI_API_KEY dans les variables d&apos;environnement puis relancez une mission pour une analyse personnalisée.
        </p>
      )}

      {!parsed.success ? (
        <p role="alert" className="rounded-lg border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">
          L&apos;analyse enregistrée est illisible. Relancez une mission pour cette offre.
        </p>
      ) : (
        <OfferView
          offerId={offer.id}
          currency={offer.currency}
          analysis={parsed.data}
          campaigns={campaigns ?? []}
          metaLive={metaAdsConfigured()}
        />
      )}
    </>
  );
}
