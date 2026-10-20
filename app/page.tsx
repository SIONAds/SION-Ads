"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Target,
  Image as ImageIcon,
  Video,
  FileText,
  BarChart3,
  CheckCircle2,
  Copy,
  Globe,
  Sliders,
  DollarSign,
  Play,
  RefreshCw,
  Cpu,
  Layers,
  Zap,
  Shield,
  Activity,
  ChevronDown,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { BrainAnalysisResult } from "@/lib/brain";

export default function SionAdsApp() {
  // Mode d'affichage : 'landing' ou 'cockpit'
  const [viewMode, setViewMode] = useState<"landing" | "cockpit">("landing");

  // Onglet cockpit
  const [activeTab, setActiveTab] = useState<"generator" | "copies" | "studio" | "meta">("generator");

  // Formulaire d'entrée
  const [title, setTitle] = useState("");
  const [offerType, setOfferType] = useState<"digital" | "physical" | "service" | "lead_gen">("digital");
  const [targetLocations, setTargetLocations] = useState<string>("France, Belgique, Cameroun");
  const [currency, setCurrency] = useState("EUR");
  const [strategyMode, setStrategyMode] = useState<"ai_recommended" | "custom">("ai_recommended");
  const [customStrategy, setCustomStrategy] = useState("");
  const [rawInput, setRawInput] = useState("");

  // États d'analyse et résultats
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BrainAnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // État Meta Ads
  const [isDeployingMeta, setIsDeployingMeta] = useState(false);
  const [metaDeployResult, setMetaDeployResult] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLaunchAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawInput.trim()) {
      showNotice("Veuillez renseigner le titre et les détails de votre offre.");
      return;
    }

    setIsAnalyzing(true);
    setMetaDeployResult(null);

    try {
      const locationsArray = targetLocations
        .split(",")
        .map((loc) => loc.trim())
        .filter(Boolean);

      const res = await fetch("/api/brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          offerType,
          targetLocations: locationsArray,
          currency,
          strategyMode,
          customStrategy,
          rawInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'analyse");

      setAnalysisResult(data.analysis);
      setViewMode("cockpit");
      setActiveTab("generator");
      showNotice("Analyse et assets marketing générés avec succès !");
    } catch (err: any) {
      console.error(err);
      showNotice("Erreur : " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeployMetaCampaign = async () => {
    if (!analysisResult) return;
    setIsDeployingMeta(true);
    try {
      const res = await fetch("/api/meta/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: `[SION] ${title} - CBO Scaler`,
          objective: "OUTCOME_SALES",
          dailyBudget: 25,
        }),
      });
      const data = await res.json();
      setMetaDeployResult(data.message || "Campagne déployée sur Meta Ads !");
      showNotice("Campagne enregistrée dans votre cockpit Meta !");
    } catch (err: any) {
      setMetaDeployResult("Erreur déploiement : " + err.message);
    } finally {
      setIsDeployingMeta(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f4f5f8] relative selection:bg-blue-500/30 selection:text-white font-sans antialiased overflow-hidden">
      {/* Halo gravitationnel & Grille d'arrière-plan style Google Antigravity */}
      <div className="fixed inset-0 bg-grid-antigravity pointer-events-none opacity-40 z-0" />
      
      {/* Orbes de gravité lumineuses (The Gravity Well Blobs) */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-cyan-400/10 blur-[130px] pointer-events-none z-0 animate-pulse-subtle" />
      <div className="fixed top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none z-0 animate-float" />
      <div className="fixed bottom-10 -right-20 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none z-0 animate-float-reverse" />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-[#151821]/90 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl flex items-center space-x-3 border border-white/10 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-medium tracking-tight">{notification}</span>
        </div>
      )}

      {/* Barre de navigation flottante Antigravity */}
      <header className="sticky top-4 z-40 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="antigravity-card px-4 sm:px-6 py-3 flex items-center justify-between border-white/[0.08] backdrop-blur-xl">
          {/* Logo avec orbe multicolore Google Gravity */}
          <div
            onClick={() => setViewMode("landing")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#1a73e8] via-[#8b5cf6] to-[#06b6d4] p-[1.5px] transition-transform duration-300 group-hover:scale-110">
              <div className="w-full h-full bg-[#0d0f14] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-tight text-white">SION Ads</span>
              <span className="px-2 py-0.5 text-[9px] font-medium tracking-wider uppercase bg-white/[0.05] text-slate-400 border border-white/[0.06] rounded-full">
                OS 3.2
              </span>
            </div>
          </div>

          {/* Sélecteur de mode & liens rapides */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <button
              onClick={() => setViewMode("landing")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === "landing"
                  ? "bg-white/10 text-white border border-white/15"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Présentation
            </button>
            <button
              onClick={() => setViewMode("cockpit")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === "cockpit"
                  ? "bg-white/10 text-white border border-white/15"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Cockpit & Campagnes
            </button>
            <button
              onClick={() => setViewMode("cockpit")}
              className="pill-btn-primary px-4 py-1.5 text-xs flex items-center space-x-1.5 cursor-pointer ml-2 shadow-sm"
            >
              <span>Lancer le Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* VUE 1 : LANDING PAGE STYLE GOOGLE ANTIGRAVITY */}
      {viewMode === "landing" && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-28 space-y-28">
          {/* Hero Section */}
          <section className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs text-slate-300 font-medium tracking-tight">
                L'écosystème publicitaire autonome pour Meta
              </span>
            </div>

            {/* Titre colossal style Antigravity */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.04em] text-white leading-[1.08]">
              De l'idée à la campagne Meta. <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Sans friction. En apesanteur.
              </span>
            </h1>

            {/* Sous-titre épuré */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed tracking-tight">
              SION Ads unifie l'analyse de marché, la génération créative 4K, le copywriting à haute réponse directe et le pilotage autonome de vos campagnes Facebook et Instagram.
            </p>

            {/* Boutons d'appel à l'action */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setViewMode("cockpit")}
                className="pill-btn-primary px-7 py-3 text-sm flex items-center space-x-2 cursor-pointer shadow-lg"
              >
                <span>Ouvrir mon Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#bento-grid"
                className="pill-btn-secondary px-6 py-3 text-sm flex items-center space-x-2 cursor-pointer"
              >
                <span>Explorer l'architecture</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Badges de compatibilité multi-produits */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                ✦ Produits Digitaux & SaaS
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                ✦ E-commerce & Produits Physiques
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                ✦ Ciblage Mondial Personnalisé
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                ✦ Meta Marketing API Native
              </span>
            </div>
          </section>

          {/* Formulaire Express au cœur de la Landing Page */}
          <section className="max-w-3xl mx-auto">
            <div className="antigravity-card p-6 sm:p-8 relative overflow-hidden border-white/[0.1]">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-slate-500 font-mono ml-2">sion-ads-agent ~ input</span>
              </div>

              <h2 className="text-lg font-medium text-white mb-2">
                Initier une mission publicitaire
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Donnez à l'IA votre proposition de valeur ou description brute pour générer votre écosystème marketing.
              </p>

              <form onSubmit={handleLaunchAnalysis} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Nom de l'offre ou produit *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: SaaS Automatisation, Masterclass Ads..."
                      className="w-full px-3.5 py-2.5 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">
                      Territoires cibles & Devise
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={targetLocations}
                        onChange={(e) => setTargetLocations(e.target.value)}
                        placeholder="Ex: France, Belgique, Cameroun..."
                        className="flex-1 px-3.5 py-2.5 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                      />
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-20 px-2 py-2.5 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="XAF">XAF</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">
                    Description, bénéfices ou notes brutes *
                  </label>
                  <textarea
                    rows={4}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Collez ici les arguments de vente, le problème résolu, la cible ou l'URL de votre page..."
                    className="w-full px-3.5 py-2.5 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/30"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Génération instantanée personas + visuels + copies</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="pill-btn-primary px-6 py-2.5 text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyse en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Générer ma campagne</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Grille Bento Interactive (Bento Grid) style Google Antigravity */}
          <section id="bento-grid" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                Une architecture conçue pour la performance
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Chaque module fonctionne en synergie pour orchestrer vos campagnes de A à Z.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4">
              {/* Carte Bento 1 : Scion Brain */}
              <div className="md:col-span-7 antigravity-card p-7 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Scion Brain — Intelligence Adaptative
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Ne force plus aucun format figé. L'agent analyse sémantiquement l'offre, adapte les personas à votre zone géographique (Afrique, Europe, Amériques) et extrait les angles psychologiques à haute conversion.
                  </p>
                </div>
                <div className="p-4 bg-[#0a0c12] rounded-2xl border border-white/[0.06] text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Agent: Brain-4-Maverick</span>
                    <span className="text-emerald-400">● En ligne</span>
                  </div>
                  <p className="text-slate-300">
                    &gt; Extraction personas, matrice désirs/douleurs et traitement de 20 objections clients.
                  </p>
                </div>
              </div>

              {/* Carte Bento 2 : Autopilot Ads */}
              <div className="md:col-span-5 antigravity-card p-7 flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Autopilot Meta Ads Manager
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Déploiement direct de campagnes CBO Advantage Budget. Règles intelligentes pour couper les publicités faibles et scaler les créatifs rentables.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 bg-[#0a0c12] rounded-xl border border-white/[0.06]">
                    <div className="text-[10px] text-slate-500 uppercase">Règle Kill</div>
                    <div className="font-semibold text-rose-400 mt-0.5">CTR &lt; 1%</div>
                  </div>
                  <div className="p-3 bg-[#0a0c12] rounded-xl border border-white/[0.06]">
                    <div className="text-[10px] text-slate-500 uppercase">Règle Scale</div>
                    <div className="font-semibold text-emerald-400 mt-0.5">ROAS &gt; 2.5x</div>
                  </div>
                </div>
              </div>

              {/* Carte Bento 3 : Studio UGC 4K & Mockups 3D */}
              <div className="md:col-span-6 antigravity-card p-7 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Creative Studio & Mockups 3D
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Génération de prompts photoréalistes pour Emu, Midjourney ou FLUX : mockups 3D high-tech pour le digital et scènes de vie authentiques pour le physique.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="px-2.5 py-1 bg-white/[0.04] rounded-lg border border-white/[0.06]">1:1 Feed</span>
                  <span className="px-2.5 py-1 bg-white/[0.04] rounded-lg border border-white/[0.06]">9:16 Stories/Reels</span>
                  <span className="px-2.5 py-1 bg-white/[0.04] rounded-lg border border-white/[0.06]">16:9 Desktop</span>
                </div>
              </div>

              {/* Carte Bento 4 : Copy Factory */}
              <div className="md:col-span-6 antigravity-card p-7 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Copy Factory & Réponse Directe
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Rédaction structurée selon les meilleurs frameworks de copywriting : AIDA, PAS, et Hook-Story-Offer avec appels à l'action adaptés au marché cible.
                  </p>
                </div>
                <div className="p-3 bg-[#0a0c12] rounded-xl border border-white/[0.06] text-xs text-slate-300 italic">
                  « Hook percutant ➔ Histoire engageante ➔ Offre irrésistible »
                </div>
              </div>
            </div>
          </section>

          {/* Section CTA finale */}
          <section className="text-center pt-8">
            <div className="antigravity-card p-10 sm:p-14 max-w-3xl mx-auto space-y-6 border-white/[0.1] relative overflow-hidden">
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
                Prêt à piloter votre marketing avec SION Ads ?
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Accédez à votre espace de contrôle et lancez vos créations de campagnes en quelques clics.
              </p>
              <button
                onClick={() => setViewMode("cockpit")}
                className="pill-btn-primary px-8 py-3.5 text-sm inline-flex items-center space-x-2 cursor-pointer shadow-xl"
              >
                <span>Accéder au Cockpit SION Ads</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>
      )}

      {/* VUE 2 : COCKPIT OPÉRATIONNEL COMPLET */}
      {viewMode === "cockpit" && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Sous-navigation du Cockpit */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <h1 className="text-xl font-semibold text-white">Cockpit Publicitaire SION Ads</h1>
              <p className="text-xs text-slate-400">
                Générez, prévisualisez et déployez vos campagnes Meta Ads interconnectées
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-[#12141c] p-1.5 rounded-full border border-white/[0.08]">
              <button
                onClick={() => setActiveTab("generator")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === "generator"
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mission & Brain
              </button>
              <button
                onClick={() => setActiveTab("copies")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === "copies"
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Copies & Personas
              </button>
              <button
                onClick={() => setActiveTab("studio")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === "studio"
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Creative Studio
              </button>
              <button
                onClick={() => setActiveTab("meta")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === "meta"
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Meta Ads Hub
              </button>
            </div>
          </div>

          {/* ONGLET 1 : MISSION & BRAIN */}
          {activeTab === "generator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Formulaire de configuration */}
              <div className="lg:col-span-5 space-y-6">
                <div className="antigravity-card p-6">
                  <h2 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Configuration de l'Offre</span>
                  </h2>
                  <p className="text-xs text-slate-400 mb-5">
                    Ajustez les paramètres pour adapter le ciblage et le format
                  </p>

                  <form onSubmit={handleLaunchAnalysis} className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        Titre de l'Offre / Produit *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: SaaS Automatisation, Masterclass Ads..."
                        className="w-full px-3.5 py-2.5 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-white/30"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        Type d'Offre
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "digital", label: "🌟 Digital (SaaS, Formation)" },
                          { id: "physical", label: "📦 Produit Physique" },
                          { id: "service", label: "🤝 Prestation de Service" },
                          { id: "lead_gen", label: "🎯 Génération de Leads" },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setOfferType(t.id as any)}
                            className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                              offerType === t.id
                                ? "bg-white/[0.08] border-white/30 text-white font-medium"
                                : "bg-[#0a0c12] border-white/[0.06] text-slate-400 hover:border-white/15"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Zone(s) ciblée(s)
                        </label>
                        <input
                          type="text"
                          value={targetLocations}
                          onChange={(e) => setTargetLocations(e.target.value)}
                          placeholder="France, Cameroun..."
                          className="w-full px-3 py-2 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Devise
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none"
                        >
                          <option value="EUR">EUR (€)</option>
                          <option value="USD">USD ($)</option>
                          <option value="XAF">FCFA (XAF)</option>
                          <option value="CAD">CAD ($)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        Structure Marketing
                      </label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => setStrategyMode("ai_recommended")}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            strategyMode === "ai_recommended"
                              ? "bg-white/[0.08] border-white/30 text-white font-medium"
                              : "bg-[#0a0c12] border-white/[0.06] text-slate-400"
                          }`}
                        >
                          🤖 Recommandation IA
                        </button>
                        <button
                          type="button"
                          onClick={() => setStrategyMode("custom")}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            strategyMode === "custom"
                              ? "bg-white/[0.08] border-white/30 text-white font-medium"
                              : "bg-[#0a0c12] border-white/[0.06] text-slate-400"
                          }`}
                        >
                          🛠️ Structure Imposée
                        </button>
                      </div>

                      {strategyMode === "custom" && (
                        <textarea
                          rows={2}
                          value={customStrategy}
                          onChange={(e) => setCustomStrategy(e.target.value)}
                          placeholder="Détaillez le funnel ou la structure de campagne voulue..."
                          className="w-full mt-2 px-3 py-2 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none"
                        />
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        Description & Notes Brutes *
                      </label>
                      <textarea
                        rows={4}
                        value={rawInput}
                        onChange={(e) => setRawInput(e.target.value)}
                        placeholder="Bénéfices, promesse, caractéristiques ou pitch..."
                        className="w-full px-3.5 py-2 bg-[#0a0c12] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAnalyzing}
                      className="pill-btn-primary w-full py-3 text-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Génération de la stratégie...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Mettre à jour la Stratégie</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Résultats & Visualisation */}
              <div className="lg:col-span-7 space-y-6">
                {!analysisResult ? (
                  <div className="h-full min-h-[400px] antigravity-card p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 text-cyan-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      En attente de vos paramètres
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                      Remplissez le formulaire à gauche pour concevoir votre positionnement, vos personas et vos angles marketing.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    {/* Positionnement & Promesse Unique */}
                    <div className="antigravity-card p-6 border-white/[0.12]">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-cyan-400 flex items-center space-x-1.5">
                          <Target className="w-3 h-3" />
                          <span>Positionnement de Marché</span>
                        </span>
                        <span className="px-2.5 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                          Prix Conseillé : {analysisResult.positioning.recommended_pricing}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-white mb-2">
                        {analysisResult.positioning.unique_value_proposition}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysisResult.positioning.target_market_summary}
                      </p>
                      <div className="mt-3 text-[11px] text-slate-400 italic">
                        {analysisResult.positioning.market_sophistication_level}
                      </div>
                    </div>

                    {/* Angles Marketing Psychologiques */}
                    <div className="antigravity-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-purple-400" />
                          <span>Angles Psychologiques ({analysisResult.angles.length})</span>
                        </h4>
                        <button
                          onClick={() => setActiveTab("copies")}
                          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                        >
                          <span>Voir les textes rédigés</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {analysisResult.angles.map((ang) => (
                          <div
                            key={ang.id}
                            className="p-3.5 bg-[#0a0c12] border border-white/[0.06] rounded-xl hover:border-white/15 transition-all"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-xs text-white">{ang.name}</span>
                              <span className="text-[10px] bg-white/[0.05] text-slate-400 px-2 py-0.5 rounded-full">
                                Angle #{ang.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mb-2 font-medium">
                              « {ang.hook_example} »
                            </p>
                            <div className="text-[11px] text-slate-400">
                              <strong className="text-slate-300">Levier émotionnel :</strong> {ang.psychological_trigger}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Déploiement Meta Direct */}
                    <div className="antigravity-card p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            Déploiement CBO Meta Ads
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Création d'une campagne Advantage Budget avec vos créatifs
                          </p>
                        </div>
                        <button
                          onClick={handleDeployMetaCampaign}
                          disabled={isDeployingMeta}
                          className="pill-btn-primary px-4 py-2 text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{isDeployingMeta ? "Envoi..." : "Déployer la Campagne"}</span>
                        </button>
                      </div>

                      {metaDeployResult && (
                        <div className="p-3 mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                          {metaDeployResult}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                        <div className="p-2.5 bg-[#0a0c12] rounded-xl border border-white/[0.06]">
                          <div className="text-[10px] text-slate-500 uppercase">Budget Journalier</div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            {analysisResult.meta_ads_strategy.recommended_budget_daily}
                          </div>
                        </div>
                        <div className="p-2.5 bg-[#0a0c12] rounded-xl border border-white/[0.06]">
                          <div className="text-[10px] text-slate-500 uppercase">CTR Minimum</div>
                          <div className="text-xs font-bold text-emerald-400 mt-0.5">
                            {analysisResult.meta_ads_strategy.kpi_targets.expected_ctr}
                          </div>
                        </div>
                        <div className="p-2.5 bg-[#0a0c12] rounded-xl border border-white/[0.06]">
                          <div className="text-[10px] text-slate-500 uppercase">ROAS Cible</div>
                          <div className="text-xs font-bold text-cyan-400 mt-0.5">
                            {analysisResult.meta_ads_strategy.kpi_targets.target_roas}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ONGLET 2 : COPIES & PERSONAS */}
          {activeTab === "copies" && (
            <div className="space-y-8">
              {!analysisResult ? (
                <div className="text-center py-16 antigravity-card">
                  <p className="text-xs text-slate-400">
                    Veuillez d'abord générer une mission dans l'onglet{" "}
                    <strong className="text-white">Mission & Brain</strong>.
                  </p>
                </div>
              ) : (
                <>
                  {/* Personas */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span>Avatars & Personas Cibles</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {analysisResult.personas.map((per, i) => (
                        <div key={i} className="antigravity-card p-6 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div>
                              <h4 className="font-semibold text-white text-sm">{per.name}</h4>
                              <p className="text-xs text-slate-400">{per.demographics} • {per.location}</p>
                            </div>
                            <span className="px-2 py-0.5 text-[10px] bg-white/[0.05] text-slate-300 rounded-full border border-white/[0.08]">
                              Persona #{i + 1}
                            </span>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-rose-400 mb-1">Douleurs Profondes :</div>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                              {per.core_pains.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-emerald-400 mb-1">Désirs Secrets :</div>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                              {per.secret_desires.map((d, idx) => (
                                <li key={idx}>{d}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Canaux :</span>
                            <span className="text-white font-medium">{per.preferred_platforms.join(", ")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Copies de Vente */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>Textes de Vente Rédigés (Frameworks Direct Response)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {analysisResult.copies.map((copy, i) => (
                        <div key={i} className="antigravity-card p-6 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Framework {copy.framework}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    `${copy.hook}\n\n${copy.body}\n\n${copy.cta}`,
                                    `copy_${i}`
                                  )
                                }
                                className="px-2 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 rounded text-xs flex items-center space-x-1 cursor-pointer transition-all"
                              >
                                {copiedIndex === `copy_${i}` ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copié</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copier</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="space-y-3 text-xs">
                              <div>
                                <span className="text-slate-500 uppercase text-[10px] block">Hook / Accroche :</span>
                                <p className="text-white font-medium mt-0.5">{copy.hook}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 uppercase text-[10px] block">Corps :</span>
                                <p className="text-slate-300 mt-0.5 leading-relaxed">{copy.body}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 uppercase text-[10px] block">Appel à l'action :</span>
                                <p className="text-cyan-400 font-semibold mt-0.5">{copy.cta}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ONGLET 3 : CREATIVE STUDIO */}
          {activeTab === "studio" && (
            <div className="space-y-8">
              {!analysisResult ? (
                <div className="text-center py-16 antigravity-card">
                  <p className="text-xs text-slate-400">
                    Générez d'abord une offre pour visualiser les prompts visuels et scripts.
                  </p>
                </div>
              ) : (
                <>
                  {/* Visuels & Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="antigravity-card p-6 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <h4 className="text-sm font-semibold text-white">Prompts Lifestyle & Bannières</h4>
                        <span className="text-[10px] bg-white/[0.05] text-cyan-400 px-2 py-0.5 rounded-full">
                          1:1 & 9:16
                        </span>
                      </div>
                      <div className="space-y-3">
                        {analysisResult.visual_prompts.banners_and_lifestyle.map((pr, i) => (
                          <div key={i} className="p-3 bg-[#0a0c12] border border-white/[0.06] rounded-xl">
                            <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                              <span>Prompt #{i + 1}</span>
                              <button
                                onClick={() => copyToClipboard(pr, `prompt_b_${i}`)}
                                className="text-cyan-400 hover:text-cyan-300"
                              >
                                {copiedIndex === `prompt_b_${i}` ? "Copié !" : "Copier"}
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 font-mono leading-relaxed">{pr}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="antigravity-card p-6 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <h4 className="text-sm font-semibold text-white">Prompts Mockups 3D & Packshots</h4>
                        <span className="text-[10px] bg-white/[0.05] text-purple-400 px-2 py-0.5 rounded-full">
                          1:1 & 16:9
                        </span>
                      </div>
                      <div className="space-y-3">
                        {analysisResult.visual_prompts.mockups_or_packshots.map((pr, i) => (
                          <div key={i} className="p-3 bg-[#0a0c12] border border-white/[0.06] rounded-xl">
                            <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                              <span>Prompt Packshot #{i + 1}</span>
                              <button
                                onClick={() => copyToClipboard(pr, `prompt_m_${i}`)}
                                className="text-purple-400 hover:text-purple-300"
                              >
                                {copiedIndex === `prompt_m_${i}` ? "Copié !" : "Copier"}
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 font-mono leading-relaxed">{pr}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Scripts Vidéo */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center space-x-2">
                      <Video className="w-4 h-4 text-pink-400" />
                      <span>Scripts Vidéo Reels & TikTok (Direct Response)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {analysisResult.video_scripts.map((sc, i) => (
                        <div key={i} className="antigravity-card p-6 space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                            <span className="font-semibold text-white">Script Vertical 9:16</span>
                            <span className="text-[10px] px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded-full">
                              Durée : {sc.duration}
                            </span>
                          </div>

                          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <span className="text-rose-400 font-bold block text-[10px] uppercase">
                              Hook Visuel (0 - 3s) :
                            </span>
                            <p className="text-white mt-0.5 font-medium">{sc.hook_0_3s}</p>
                          </div>

                          <div>
                            <span className="text-slate-500 uppercase text-[10px] block">Voix-Off :</span>
                            <p className="text-slate-300 italic mt-0.5 bg-[#0a0c12] p-2 rounded-lg border border-white/[0.06]">
                              « {sc.voiceover_script} »
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-500 uppercase text-[10px] block">Sous-titres Hormozi :</span>
                            <p className="text-yellow-300 font-semibold mt-0.5">{sc.on_screen_text}</p>
                          </div>

                          <div>
                            <span className="text-slate-500 uppercase text-[10px] block">CTA :</span>
                            <p className="text-cyan-400 font-bold mt-0.5">{sc.cta}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ONGLET 4 : META ADS HUB */}
          {activeTab === "meta" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="antigravity-card p-5">
                  <div className="text-xs text-slate-400">Spend Total</div>
                  <div className="text-2xl font-bold text-white mt-1">0.00 €</div>
                  <div className="text-[11px] text-slate-500 mt-1">Campagnes actives</div>
                </div>
                <div className="antigravity-card p-5">
                  <div className="text-xs text-slate-400">Taux de Clic (CTR)</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">-- %</div>
                  <div className="text-[11px] text-slate-500 mt-1">Seuil minimal : &gt; 2.0%</div>
                </div>
                <div className="antigravity-card p-5">
                  <div className="text-xs text-slate-400">Coût par Clic (CPC)</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">-- €</div>
                  <div className="text-[11px] text-slate-500 mt-1">Pilotage automatique</div>
                </div>
                <div className="antigravity-card p-5">
                  <div className="text-xs text-slate-400">ROAS Réalisé</div>
                  <div className="text-2xl font-bold text-purple-400 mt-1">-- x</div>
                  <div className="text-[11px] text-slate-500 mt-1">Scale automatique à &gt; 2.5x</div>
                </div>
              </div>

              <div className="antigravity-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Media Buyer Autopilot</h3>
                    <p className="text-xs text-slate-400">Règles d'optimisation appliquées à vos campagnes</p>
                  </div>
                  <button
                    onClick={handleDeployMetaCampaign}
                    disabled={isDeployingMeta || !title}
                    className="pill-btn-primary px-4 py-2 text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Créer une Campagne CBO</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#0a0c12] rounded-xl border border-white/[0.06]">
                    <span className="font-semibold text-rose-400 block mb-1">Règle Kill :</span>
                    <span className="text-slate-300">Coupure si CTR &lt; 1% après 500 impressions.</span>
                  </div>
                  <div className="p-3 bg-[#0a0c12] rounded-xl border border-white/[0.06]">
                    <span className="font-semibold text-yellow-400 block mb-1">Règle Réduction :</span>
                    <span className="text-slate-300">Baisse du budget de 20% si CPC trop élevé.</span>
                  </div>
                  <div className="p-3 bg-[#0a0c12] rounded-xl border border-white/[0.06]">
                    <span className="font-semibold text-emerald-400 block mb-1">Règle Scale :</span>
                    <span className="text-slate-300">Augmentation progressive de 20% si ROAS &gt; 2.5x.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer minimaliste style Google */}
      <footer className="border-t border-white/[0.06] bg-[#06070a] py-6 text-center text-xs text-slate-500 relative z-10">
        SION Ads OS 3.2 — Conçu avec l'esthétique et la précision de Google Antigravity.
      </footer>
    </div>
  );
}
