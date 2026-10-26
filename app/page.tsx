import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Clapperboard,
  Gauge,
  ImageIcon,
  Megaphone,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/logo";

const MODULES = [
  {
    icon: BrainCircuit,
    title: "Brain",
    status: "Disponible",
    text: "Positionnement, personas, 4 angles psychologiques et réponses aux objections, adaptés à vos zones et à votre devise.",
  },
  {
    icon: PenLine,
    title: "Copy Factory",
    status: "Disponible",
    text: "Copies AIDA, PAS et Hook-Story-Offer par angle, plus 5 hooks Reels de 0 à 3 secondes. Ton direct, pas corporate.",
  },
  {
    icon: ImageIcon,
    title: "Studio créatif",
    status: "Prompts prêts",
    text: "Prompts bannières, lifestyle, packshots et mockups, au bon ratio (1:1, 9:16, 16:9). Rendu d'images intégré bientôt.",
  },
  {
    icon: Clapperboard,
    title: "Scripts vidéo",
    status: "Disponible",
    text: "Scripts 15 et 25 secondes : hook, message, voix-off, texte à l'écran, appel à l'action.",
  },
  {
    icon: Megaphone,
    title: "Meta CBO",
    status: "Disponible",
    text: "Création de la campagne sur votre compte publicitaire, toujours en pause. Rien ne dépense sans votre feu vert.",
  },
  {
    icon: Gauge,
    title: "Autopilot",
    status: "Recommandations",
    text: "Chaque campagne est évaluée sur des règles claires : couper, réduire, scaler. Vous validez, SION n'agit jamais seul.",
  },
] as const;

const STEPS = [
  { n: "01", title: "Décrivez l'offre", text: "Nom, zones, devise, quelques lignes en vrac. Même un message vocal retranscrit suffit." },
  { n: "02", title: "Recevez le dossier complet", text: "Stratégie, personas, copies, prompts visuels et scripts, sauvegardés dans votre espace." },
  { n: "03", title: "Lancez en pause, puis scalez", text: "La campagne CBO est créée sur Meta. Vous l'activez, SION suit les chiffres et recommande." },
] as const;

const RULES = [
  { tone: "bad", label: "Couper", rule: "CTR < 1 % après 500 impressions" },
  { tone: "sun", label: "Réduire", rule: "CPC au-dessus du plafond : -20 % de budget" },
  { tone: "ok", label: "Scaler", rule: "ROAS > 2,5x : +20 % par palier" },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Sections">
            <a href="#fonctionnement" className="hover:text-text">Fonctionnement</a>
            <a href="#modules" className="hover:text-text">Modules</a>
            <a href="#autopilot" className="hover:text-text">Autopilot</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">Connexion</Link>
            <Link href="/login?mode=signup" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Commencer
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
            <div>
              <p className="eyebrow mb-5">Publicité Meta · Afrique francophone</p>
              <h1 className="text-[2.6rem] font-bold leading-[1.02] sm:text-6xl lg:text-[4.2rem]">
                De l&apos;idée à la campagne Meta en <span className="text-sun">trois minutes.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                SION Ads transforme la description brute de votre offre en stratégie, copies, prompts créatifs et
                campagne CBO prête à lancer. Prix en FCFA, paiement à la livraison, WhatsApp : pensé pour votre marché.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/login?mode=signup" className="btn btn-primary h-12 px-6 text-[0.95rem]">
                  Créer ma première mission <ArrowRight size={18} />
                </Link>
                <a href="#fonctionnement" className="btn btn-ghost h-12 px-6 text-[0.95rem]">
                  Voir comment ça marche
                </a>
              </div>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                {["Campagnes toujours créées en pause", "Données privées, isolées par compte", "Aucun témoignage inventé"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check size={15} className="text-ok" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Aperçu produit */}
            <div className="card relative p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]" aria-label="Aperçu du cockpit">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">Mission</p>
                  <p className="font-display text-lg font-semibold">Crème éclaircissante Karité</p>
                </div>
                <span className="badge badge-sun">Aperçu</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  ["Budget / jour", "5 000 FCFA"],
                  ["CTR cible", "> 1,5 %"],
                  ["ROAS cible", "> 2,5x"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-line bg-bg p-3">
                    <p className="text-[0.7rem] text-muted">{k}</p>
                    <p className="num mt-1 text-[0.95rem] font-semibold">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-line bg-bg p-4">
                <p className="eyebrow mb-2">Angle 1 · Résultat rapide</p>
                <p className="text-[0.95rem] leading-relaxed">
                  « Paiement à la livraison à Douala, Yaoundé et Bafoussam. Vous ne payez que si vous êtes convaincue. »
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-bg p-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-md bg-sun/10 text-sun">
                    <Megaphone size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Campagne CBO</p>
                    <p className="text-xs text-muted">3 ensembles · créée en pause</p>
                  </div>
                </div>
                <span className="badge badge-ok">Prête</span>
              </div>
            </div>
          </div>
        </section>

        {/* MARCHÉ */}
        <section className="border-y border-line bg-surface/50">
          <div className="mx-auto grid max-w-6xl gap-px px-4 py-8 text-sm text-muted sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {["Prix et budgets en FCFA, sans sous-unités", "Français vendeur, références locales", "Mobile Money et paiement à la livraison", "WhatsApp comme canal de conversion"].map((t) => (
              <p key={t} className="flex items-center gap-2.5 py-1.5">
                <span className="size-1.5 rounded-full bg-sun" aria-hidden="true" />
                {t}
              </p>
            ))}
          </div>
        </section>

        {/* FONCTIONNEMENT */}
        <section id="fonctionnement" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
          <p className="eyebrow mb-3">Fonctionnement</p>
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Trois étapes, un seul espace de travail.</h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="card p-6">
                <span className="num text-sm text-sun">{s.n}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* MODULES */}
        <section id="modules" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 sm:px-6">
          <p className="eyebrow mb-3">Modules</p>
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Tout ce qu&apos;un media buyer prépare, sans l&apos;attendre.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(({ icon: Icon, title, status, text }) => (
              <article key={title} className="card p-6 transition-colors hover:border-line-strong">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-lg bg-surface-2 text-sun">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="badge">{status}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-[0.93rem] text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* AUTOPILOT */}
        <section id="autopilot" className="scroll-mt-20 border-y border-line bg-surface/50">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">Autopilot</p>
              <h2 className="text-3xl font-bold sm:text-4xl">Des règles claires, jamais d&apos;action surprise.</h2>
              <p className="mt-5 max-w-lg text-muted">
                SION lit les métriques réelles de vos campagnes Meta et applique des seuils simples. Il vous dit quoi
                faire et pourquoi. Vous gardez la main sur chaque dépense.
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted">
                <ShieldCheck size={16} className="text-ok" aria-hidden="true" />
                Campagnes créées en pause, activation manuelle.
              </p>
            </div>
            <div className="space-y-3">
              {RULES.map((r) => (
                <div key={r.label} className="card flex items-center justify-between gap-4 p-5">
                  <p className="text-[0.95rem]">{r.rule}</p>
                  <span className={`badge ${r.tone === "bad" ? "badge-bad" : r.tone === "ok" ? "badge-ok" : "badge-sun"}`}>
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <h2 className="text-3xl font-bold sm:text-5xl">Votre prochaine campagne commence ici.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            Créez un compte, décrivez une offre, et obtenez votre dossier complet en moins de trois minutes.
          </p>
          <Link href="/login?mode=signup" className="btn btn-primary mt-9 h-12 px-7 text-[0.95rem]">
            Démarrer maintenant <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-faint sm:flex-row sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} SION Ads. Fait à Bafoussam, Cameroun.</p>
        </div>
      </footer>
    </div>
  );
}
