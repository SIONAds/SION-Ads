"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";

export function SyncButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function sync() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/meta/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de la synchronisation.");
      setMsg(data.failed ? `${data.synced} synchronisée(s), ${data.failed} en échec.` : `${data.synced} campagne(s) à jour.`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {msg && <span role="status" className="text-sm text-muted">{msg}</span>}
      <button onClick={sync} disabled={loading} className="btn btn-ghost">
        {loading ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <RefreshCw size={15} aria-hidden="true" />}
        Synchroniser
      </button>
    </div>
  );
}
