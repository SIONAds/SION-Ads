"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Target,
  Image as ImageIcon,
  Video,
  FileText,
  BarChart3,
  CheckCircle2,
  Copy,
  Globe,
  Share2,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign,
  AlertCircle,
  Play,
  ArrowRight,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { BrainAnalysisResult } from "@/lib/brain";

export default function SionAdsDashboard() {
  // Onglet principal actif
  const [activeTab, setActiveTab] = useState<"generator" | "studio" | "copies" | "meta" | "settings">("generator");

  // Formulaire d'entrée
  const [title, setTitle] = useState("");
  const [offerType, setOfferType] = useState<"digital" | "physical" | "service" | "lead_gen">("digital");
  const [targetLocations, setTargetLocations] = useState<string>("France, Belgique");
  const [currency, setCurrency] = useState("EUR");
  const [strategyMode, setStrategyMode] = useState<"ai_recommended" | "custom">("ai_recommended");
  const [customStrategy, setCustomStrategy] = useState("");
  const [rawInput, setRawInput] = useState("");

  // États de chargement et résultats
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BrainAnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // État Meta Ads
  const [isDeployingMeta, setIsDeployingMeta] = useState(false);
  const [metaDeployResult, setMetaDeployResult] = useState<string | null>(null);

  // Soumission pour analyse IA
  const handleLaunchAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawInput.trim()) {
      showNotice("Veuillez renseigner le nom de l'offre et une description.");
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
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'analyse");
      }

      setAnalysisResult(data.analysis);
      showNotice("Stratégie et assets générés avec succès !");
    } catch (err: any) {
      console.error(err);
      showNotice("Erreur : " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Déploiement Meta Ads
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
      setMetaDeployResult(data.message || "Campagne déployée avec succès !");
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

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Barre de notification temporaire */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-indigo-400/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Navigation Principale Supérieure */}
      <header className="border-b border-slate-800/80 bg-[#0c1222]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  SION ADS
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  OS v3.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Hub Marketing & Pilotage Meta Ads Autonome</p>
            </div>
          </div>

          {/* Onglets de navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("generator")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "generator"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Générateur Stratégique</span>
            </button>
            <button
              onClick={() => setActiveTab("copies")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "copies"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Copies & Personas</span>
            </button>
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "studio"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Creative Studio</span>
            </button>
            <button
              onClick={() => setActiveTab("meta")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "meta"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Meta Ads Cockpit</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ONGLET 1 : GÉNÉRATEUR STRATÉGIQUE */}
        {activeTab === "generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Formulaire de configuration */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-indigo-400" />
                      <span>Paramètres de la Mission</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configurez l'offre et les cibles pour lancer l'IA
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLaunchAnalysis} className="space-y-5">
                  {/* Titre */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nom ou Titre de l'Offre / Produit *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: SaaS Automatisation Publicitaire, Formation Copywriting, Sérum Anti-Taches..."
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      required
                    />
                  </div>

                  {/* Type d'offre */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Type d'offre
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "digital", label: "🌟 Digital (SaaS, Ebook, Formation)" },
                        { id: "physical", label: "📦 Produit Physique / E-com" },
                        { id: "service", label: "🤝 Service & Prestation" },
                        { id: "lead_gen", label: "🎯 Génération de Leads" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setOfferType(t.id as any)}
                          className={`text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                            offerType === t.id
                              ? "bg-indigo-600/15 border-indigo-500 text-indigo-300"
                              : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Zones géographiques cibles & Devise */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        <Globe className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                        Zone(s) ciblée(s)
                      </label>
                      <input
                        type="text"
                        value={targetLocations}
                        onChange={(e) => setTargetLocations(e.target.value)}
                        placeholder="Ex: France, Belgique ou Cameroun"
                        className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        <DollarSign className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                        Devise de vente
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="XAF">FCFA (XAF)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  {/* Choix Stratégique */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Architecture & Stratégie Marketing
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setStrategyMode("ai_recommended")}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          strategyMode === "ai_recommended"
                            ? "bg-indigo-600/15 border-indigo-500 text-indigo-300"
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        🤖 IA Recommande
                      </button>
                      <button
                        type="button"
                        onClick={() => setStrategyMode("custom")}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          strategyMode === "custom"
                            ? "bg-indigo-600/15 border-indigo-500 text-indigo-300"
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        🛠️ Je Pilote la Structure
                      </button>
                    </div>

                    {strategyMode === "custom" && (
                      <textarea
                        rows={2}
                        value={customStrategy}
                        onChange={(e) => setCustomStrategy(e.target.value)}
                        placeholder="Précisez votre funnel : ex. VSL 15min -> Appel de vente, ou Funnel direct avec offre à 47€ + 1 OTO..."
                        className="w-full mt-2 px-3 py-2 bg-slate-900 border border-indigo-500/30 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Description / Input Brut */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Description, Pitch ou Notes Brutes *
                    </label>
                    <textarea
                      rows={5}
                      value={rawInput}
                      onChange={(e) => setRawInput(e.target.value)}
                      placeholder="Collez ici les détails de l'offre, les bénéfices clés, le prix, les ingrédients ou fonctionnalités, le lien de votre page de vente..."
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      required
                    />
                  </div>

                  {/* Bouton de génération */}
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyse sémantique & Génération en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Générer l'Écosystème Marketing Complet</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Panneau de Résultats & Visualisation */}
            <div className="lg:col-span-7 space-y-6">
              {!analysisResult ? (
                <div className="h-full min-h-[420px] bg-[#0f172a]/40 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-200">
                    Le Cockpit attend vos directives
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                    Renseignez le nom de votre offre et votre description à gauche, puis cliquez sur{" "}
                    <strong className="text-slate-200">Générer l'Écosystème</strong>. L'IA concevra instantanément vos personas, angles psychologiques, copies et stratégie Meta Ads.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {/* Synthèse du Positionnement */}
                  <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20 mb-4">
                      <span className="text-[11px] font-semibold text-indigo-400 tracking-wider uppercase flex items-center space-x-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Positionnement & Promesse Unique</span>
                      </span>
                      <span className="px-2.5 py-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                        Tarif Recommandé : {analysisResult.positioning.recommended_pricing}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
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
                  <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span>Angles Marketing Générés ({analysisResult.angles.length})</span>
                      </h4>
                      <button
                        onClick={() => setActiveTab("copies")}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                      >
                        <span>Voir les copies rédigées</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {analysisResult.angles.map((ang) => (
                        <div
                          key={ang.id}
                          className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-xs text-indigo-300">
                              {ang.name}
                            </span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                              Angle #{ang.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mb-2 font-medium">
                            « {ang.hook_example} »
                          </p>
                          <div className="text-[11px] text-slate-400">
                            <strong className="text-slate-300">Déclencheur :</strong> {ang.psychological_trigger}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommandation Meta Ads Express */}
                  <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                        <span>Plan de Déploiement Meta Ads CBO</span>
                      </h4>
                      <button
                        onClick={handleDeployMetaCampaign}
                        disabled={isDeployingMeta}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isDeployingMeta ? "Déploiement..." : "Déployer la Campagne"}</span>
                      </button>
                    </div>

                    {metaDeployResult && (
                      <div className="p-3 mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                        {metaDeployResult}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                        <div className="text-[10px] text-slate-400 uppercase">Budget Conseillé</div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {analysisResult.meta_ads_strategy.recommended_budget_daily}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                        <div className="text-[10px] text-slate-400 uppercase">CTR Minimum Cible</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">
                          {analysisResult.meta_ads_strategy.kpi_targets.expected_ctr}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                        <div className="text-[10px] text-slate-400 uppercase">ROAS Visé</div>
                        <div className="text-sm font-bold text-purple-400 mt-0.5">
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
              <div className="text-center py-16 bg-[#0f172a]/40 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-400">
                  Veuillez d'abord lancer une analyse dans l'onglet{" "}
                  <strong className="text-indigo-400">Générateur Stratégique</strong> pour afficher vos copies.
                </p>
              </div>
            ) : (
              <>
                {/* Personas Détaillés */}
                <div>
                  <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <span>Profils Psychologiques des Personas Cibles</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysisResult.personas.map((per, i) => (
                      <div
                        key={i}
                        className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <div>
                            <h4 className="font-bold text-white text-sm">{per.name}</h4>
                            <p className="text-xs text-slate-400">{per.demographics} • {per.location}</p>
                          </div>
                          <span className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
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

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Canaux Meta :</span>
                          <span className="text-slate-200 font-medium">
                            {per.preferred_platforms.join(", ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copies Rédigées (AIDA, PAS, Hook-Story-Offer) */}
                <div>
                  <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span>Textes de Vente Rédigés Prêts à Copier</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {analysisResult.copies.map((copy, i) => (
                      <div
                        key={i}
                        className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                              Framework {copy.framework}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `${copy.hook}\n\n${copy.body}\n\n${copy.cta}`,
                                  `copy_${i}`
                                )
                              }
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs flex items-center space-x-1 cursor-pointer transition-all"
                            >
                              {copiedIndex === `copy_${i}` ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copié !</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <strong className="text-slate-400 block text-[10px] uppercase">Hook / Accroche :</strong>
                              <p className="text-slate-200 font-medium mt-0.5">{copy.hook}</p>
                            </div>
                            <div>
                              <strong className="text-slate-400 block text-[10px] uppercase">Corps de texte :</strong>
                              <p className="text-slate-300 mt-0.5 leading-relaxed">{copy.body}</p>
                            </div>
                            <div>
                              <strong className="text-slate-400 block text-[10px] uppercase">Appel à l'action (CTA) :</strong>
                              <p className="text-indigo-300 font-semibold mt-0.5">{copy.cta}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Traitement des 20 Objections */}
                <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-4">
                    Arguments de Traitement des Objections Clients
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.objections_handling.map((obj, i) => (
                      <div key={i} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                        <div className="text-xs font-semibold text-rose-300 mb-1">
                          ❓ « {obj.objection} »
                        </div>
                        <div className="text-xs text-slate-300 leading-relaxed">
                          💡 <strong className="text-emerald-400">Réponse :</strong> {obj.counter_argument}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ONGLET 3 : CREATIVE STUDIO (VISUELS & VIDÉOS) */}
        {activeTab === "studio" && (
          <div className="space-y-8">
            {!analysisResult ? (
              <div className="text-center py-16 bg-[#0f172a]/40 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-400">
                  Générez d'abord une offre pour visualiser les prompts et formats créatifs.
                </p>
              </div>
            ) : (
              <>
                {/* Formats Bannières & Mockups */}
                <div>
                  <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                    <span>Concepts Visuels Générés (Mockups 3D / Lifestyle Photoréaliste)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bannières / Lifestyle */}
                    <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h4 className="text-sm font-semibold text-white">Bannières & Visuels d'Ambiance</h4>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                          Formats 1:1 & 9:16
                        </span>
                      </div>

                      <div className="space-y-3">
                        {analysisResult.visual_prompts.banners_and_lifestyle.map((pr, i) => (
                          <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-semibold text-indigo-300">Prompt Emu / Midjourney #{i + 1}</span>
                              <button
                                onClick={() => copyToClipboard(pr, `prompt_ban_${i}`)}
                                className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                              >
                                {copiedIndex === `prompt_ban_${i}` ? "Copié !" : "Copier le prompt"}
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded-lg leading-relaxed">
                              {pr}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Packshots & Bundles */}
                    <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h4 className="text-sm font-semibold text-white">Mockups 3D & Packshots E-commerce</h4>
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                          Formats 1:1 & 16:9
                        </span>
                      </div>

                      <div className="space-y-3">
                        {analysisResult.visual_prompts.mockups_or_packshots.map((pr, i) => (
                          <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-semibold text-purple-300">Prompt Packshot #{i + 1}</span>
                              <button
                                onClick={() => copyToClipboard(pr, `prompt_mock_${i}`)}
                                className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                              >
                                {copiedIndex === `prompt_mock_${i}` ? "Copié !" : "Copier le prompt"}
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded-lg leading-relaxed">
                              {pr}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scripts Vidéo (Reels / TikTok / Shorts) */}
                <div>
                  <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                    <Video className="w-5 h-5 text-pink-400" />
                    <span>Scripts Vidéo Reels & TikTok (Style Hormozi / Direct Response)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysisResult.video_scripts.map((sc, i) => (
                      <div
                        key={i}
                        className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <span className="font-bold text-sm text-white">Format Vidéo Vertical (9:16)</span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded-full border border-pink-500/20">
                            Durée : {sc.duration}
                          </span>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            <strong className="text-rose-300 block text-[10px] uppercase font-bold">
                              Hook Visuel & Sonore (0 - 3 secondes) :
                            </strong>
                            <p className="text-slate-200 mt-1 font-medium">{sc.hook_0_3s}</p>
                          </div>

                          <div>
                            <strong className="text-slate-400 block text-[10px] uppercase">Message Principal :</strong>
                            <p className="text-slate-300 mt-0.5 leading-relaxed">{sc.core_message}</p>
                          </div>

                          <div>
                            <strong className="text-slate-400 block text-[10px] uppercase">Texte Voix-Off (ElevenLabs) :</strong>
                            <p className="text-slate-300 italic mt-0.5 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                              « {sc.voiceover_script} »
                            </p>
                          </div>

                          <div>
                            <strong className="text-slate-400 block text-[10px] uppercase">Sous-titres Incrustés :</strong>
                            <p className="text-yellow-300 font-semibold mt-0.5">{sc.on_screen_text}</p>
                          </div>

                          <div>
                            <strong className="text-slate-400 block text-[10px] uppercase">Appel à l'action final :</strong>
                            <p className="text-indigo-400 font-bold mt-0.5">{sc.cta}</p>
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

        {/* ONGLET 4 : META ADS COCKPIT */}
        {activeTab === "meta" && (
          <div className="space-y-8">
            {/* Tableau de bord de pilotage */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="text-xs text-slate-400 font-medium">Budget Dépensé (Spend)</div>
                <div className="text-2xl font-bold text-white mt-1">0.00 €</div>
                <div className="text-[11px] text-slate-500 mt-1">Prêt pour diffusion</div>
              </div>
              <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="text-xs text-slate-400 font-medium">Taux de Clic Moyen (CTR)</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">-- %</div>
                <div className="text-[11px] text-slate-500 mt-1">Cible : &gt; 2.0%</div>
              </div>
              <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="text-xs text-slate-400 font-medium">Coût Par Clic (CPC)</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">-- €</div>
                <div className="text-[11px] text-slate-500 mt-1">Optimisation automatique</div>
              </div>
              <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="text-xs text-slate-400 font-medium">ROAS Moyen Réalisé</div>
                <div className="text-2xl font-bold text-purple-400 mt-1">-- x</div>
                <div className="text-[11px] text-slate-500 mt-1">Scale automatique à &gt; 2.5x</div>
              </div>
            </div>

            {/* Déploiement et Campagnes */}
            <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span>Pilotage des Campagnes CBO Interconnectées</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gérez et déployez vos campagnes directement sur votre Business Manager Meta
                  </p>
                </div>
                <button
                  onClick={handleDeployMetaCampaign}
                  disabled={isDeployingMeta || !title}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>{isDeployingMeta ? "Lancement en cours..." : "Créer une Campagne CBO"}</span>
                </button>
              </div>

              {metaDeployResult && (
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                  {metaDeployResult}
                </div>
              )}

              {/* Règles d'Autopilot Intégrées */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Règles d'Optimisation Autonome (Media Buyer IA)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-semibold text-rose-400 block mb-1">Règle de Coupure (Kill) :</span>
                    <span className="text-slate-300">Si CTR &lt; 1% après 500 impressions ➔ Coupure de l'adset et alerte.</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-semibold text-yellow-400 block mb-1">Règle de Réduction :</span>
                    <span className="text-slate-300">Si CPC dépasse le seuil critique ➔ Baisse du budget de 20%.</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="font-semibold text-emerald-400 block mb-1">Règle de Scaling :</span>
                    <span className="text-slate-300">Si ROAS &gt; 2.5x sur 24h ➔ Augmentation progressive du budget de 20%.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0c1222] py-4 text-center text-xs text-slate-500">
        SION Ads © 2026 — Votre système marketing et publicitaire autonome propulsé par IA.
      </footer>
    </div>
  );
}
