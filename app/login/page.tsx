import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const { mode, next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-between px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto w-full max-w-sm py-12">
          <LoginForm initialMode={mode === "signup" ? "signup" : "signin"} next={safeNext} />
        </div>
        <p className="text-xs text-faint">Vos données restent privées : chaque compte ne voit que ses propres missions.</p>
      </section>
      <aside className="hero-grid relative hidden border-l border-line bg-surface lg:flex lg:items-center lg:justify-center" aria-hidden="true">
        <div className="max-w-md px-10">
          <p className="eyebrow mb-4">Pourquoi SION</p>
          <p className="font-display text-3xl font-bold leading-tight">
            Un media buyer qui prépare tout, et vous laisse décider de chaque dépense.
          </p>
          <p className="mt-5 text-muted">
            Stratégie, copies, créatifs et campagne CBO en pause. Vous validez, SION suit les chiffres.
          </p>
        </div>
      </aside>
    </main>
  );
}
