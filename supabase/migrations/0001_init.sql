-- ==============================================================================
-- SION ADS - Schéma de base de données PostgreSQL / Supabase
-- Architecture universelle : Produits Digitaux, Physiques, Services & Meta Ads OS
-- ==============================================================================

-- 1. Table des Offres / Produits / Systèmes Marketing
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  offer_type TEXT NOT NULL DEFAULT 'digital', -- 'digital', 'physical', 'service', 'lead_gen'
  target_locations TEXT[] DEFAULT ARRAY['France'], -- Ex: ['France', 'Belgique', 'Cameroun', 'Côte d''Ivoire']
  currency TEXT NOT NULL DEFAULT 'EUR', -- 'EUR', 'USD', 'XAF', etc.
  strategy_mode TEXT NOT NULL DEFAULT 'ai_recommended', -- 'ai_recommended' ou 'custom'
  custom_strategy TEXT, -- Si stratégie ou structure imposée par vous
  raw_input TEXT, -- Description, pitch, transcript vocal, bullet points
  input_assets JSONB DEFAULT '[]'::jsonb, -- Fichiers/photos/logos sources uploadés
  brain_analysis JSONB, -- Analyse IA complète : personas, matrice douleurs/désirs, angles, 20 objections
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'analyzed', 'creatives_ready', 'live'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table des Assets Créatifs Visuels & Vidéos (Studio)
CREATE TABLE IF NOT EXISTS public.creative_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'mockup_digital', 'lifestyle', 'packshot', 'banner', 'video_script', 'video_rendered'
  format TEXT NOT NULL DEFAULT '1:1', -- '1:1', '9:16', '16:9', '4:5'
  prompt_used TEXT,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  headline TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Table des Copies Publicitaires (Copy Factory)
CREATE TABLE IF NOT EXISTS public.copy_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  angle_name TEXT NOT NULL,
  framework TEXT NOT NULL DEFAULT 'AIDA', -- 'AIDA', 'PAS', 'Hook_Story_Offer', 'Direct_Response'
  hook TEXT NOT NULL,
  body TEXT NOT NULL,
  cta TEXT NOT NULL,
  target_audience TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Table des Campagnes Meta Ads (Marketing API Hub)
CREATE TABLE IF NOT EXISTS public.meta_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  meta_campaign_id TEXT,
  campaign_name TEXT NOT NULL,
  objective TEXT NOT NULL DEFAULT 'OUTCOME_SALES', -- 'OUTCOME_SALES', 'OUTCOME_LEADS', 'OUTCOME_TRAFFIC'
  budget_type TEXT NOT NULL DEFAULT 'CBO', -- 'CBO' (Advantage Campaign Budget) ou 'ABO'
  daily_budget NUMERIC NOT NULL DEFAULT 20.00,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'
  targeting_spec JSONB DEFAULT '{"locations": ["FR"], "age_min": 25, "age_max": 55, "type": "broad"}'::jsonb,
  metrics JSONB DEFAULT '{
    "spend": 0,
    "impressions": 0,
    "clicks": 0,
    "ctr": 0,
    "cpc": 0,
    "roas": 0,
    "conversions": 0
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Table des Comptes & Connexions Meta (Pages FB, Business Manager, Pixels)
CREATE TABLE IF NOT EXISTS public.meta_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name TEXT NOT NULL,
  ad_account_id TEXT, -- Ex: 'act_123456789'
  page_id TEXT, -- Page Facebook de publication
  instagram_actor_id TEXT, -- Compte Instagram relié
  pixel_id TEXT, -- ID Pixel / Dataset Meta
  access_token TEXT, -- Token d'accès sécurisé
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_creative_assets_offer ON public.creative_assets(offer_id);
CREATE INDEX IF NOT EXISTS idx_copy_assets_offer ON public.copy_assets(offer_id);
CREATE INDEX IF NOT EXISTS idx_meta_campaigns_offer ON public.meta_campaigns(offer_id);
