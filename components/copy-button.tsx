"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé) : on ne signale rien de faux.
    }
  }

  return (
    <button type="button" onClick={copy} className="btn btn-ghost btn-sm" aria-live="polite">
      {done ? <Check size={14} className="text-ok" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {done ? "Copié" : label}
    </button>
  );
}
