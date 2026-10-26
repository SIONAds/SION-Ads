"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ initialMode, next }: { initialMode: "signin" | "signup"; next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) return setError(translate(error.message));
      if (!data.session) {
        return setInfo("Compte créé. Confirmez votre adresse via l'email reçu, puis connectez-vous.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return setError(translate(error.message));
      }
    }

    router.replace(next);
    router.refresh();
  }

  const signup = mode === "signup";

  return (
    <div>
      <h1 className="text-3xl font-bold">{signup ? "Créer votre compte" : "Bon retour"}</h1>
      <p className="mt-2 text-muted">
        {signup ? "Lancez votre première mission en quelques minutes." : "Connectez-vous pour retrouver vos missions."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="label">Adresse email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="vous@exemple.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">Mot de passe</label>
          <input
            id="password"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="8 caractères minimum"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-bad/40 bg-bad/10 px-3 py-2 text-sm text-bad">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="rounded-lg border border-ok/40 bg-ok/10 px-3 py-2 text-sm text-ok">
            {info}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary h-11 w-full">
          {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {signup ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {signup ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(signup ? "signin" : "signup");
            setError(null);
            setInfo(null);
          }}
          className="font-semibold text-sun hover:underline"
        >
          {signup ? "Se connecter" : "Créer un compte"}
        </button>
      </p>
    </div>
  );
}

function translate(message: string) {
  if (/invalid login credentials/i.test(message)) return "Email ou mot de passe incorrect.";
  if (/already registered|already been registered/i.test(message)) return "Un compte existe déjà avec cet email.";
  if (/email not confirmed/i.test(message)) return "Email non confirmé : vérifiez votre boîte de réception.";
  if (/rate limit/i.test(message)) return "Trop de tentatives. Réessayez dans quelques minutes.";
  if (/password/i.test(message)) return "Mot de passe trop faible (8 caractères minimum).";
  return message;
}
