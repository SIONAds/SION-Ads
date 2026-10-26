import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { brainConfigured } from "@/lib/brain";
import { PageHeader } from "@/components/page-kit";
import { MissionForm } from "./mission-form";

export const metadata: Metadata = { title: "Nouvelle mission" };

export default async function NewOfferPage() {
  await requireUser();
  return (
    <>
      <PageHeader
        title="Nouvelle mission"
        description="Décrivez votre offre. SION en tire la stratégie, les copies, les prompts créatifs et le plan de campagne."
      />
      <MissionForm demoMode={!brainConfigured()} />
    </>
  );
}
