-- ==============================================================================
-- SION Ads — 0002 : propriété des données + Row Level Security
-- À exécuter UNE fois dans Supabase > SQL Editor. Idempotent.
-- Avant ce script, la clé anon (publique) pouvait lire ET écrire toutes les tables.
-- ==============================================================================

-- 1. Propriétaire de chaque ligne
ALTER TABLE public.offers         ADD COLUMN IF NOT EXISTS owner_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.meta_campaigns ADD COLUMN IF NOT EXISTS owner_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.meta_accounts  ADD COLUMN IF NOT EXISTS owner_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.creative_assets ADD COLUMN IF NOT EXISTS owner_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.copy_assets     ADD COLUMN IF NOT EXISTS owner_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Colonnes manquantes pour un vrai suivi de campagne
ALTER TABLE public.meta_campaigns ADD COLUMN IF NOT EXISTS is_simulated BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.meta_campaigns ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;
ALTER TABLE public.offers         ADD COLUMN IF NOT EXISTS analysis_source TEXT; -- 'ai' | 'demo'

-- 3. Contraintes de valeurs
DO $$ BEGIN
  ALTER TABLE public.offers ADD CONSTRAINT offers_type_chk CHECK (offer_type IN ('digital','physical','service','lead_gen'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.offers ADD CONSTRAINT offers_status_chk CHECK (status IN ('draft','analyzed','creatives_ready','live'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.meta_campaigns ADD CONSTRAINT meta_campaigns_status_chk CHECK (status IN ('DRAFT','ACTIVE','PAUSED','ARCHIVED'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. updated_at automatique
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_offers_updated ON public.offers;
CREATE TRIGGER trg_offers_updated BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS trg_meta_campaigns_updated ON public.meta_campaigns;
CREATE TRIGGER trg_meta_campaigns_updated BEFORE UPDATE ON public.meta_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_offers_owner_created ON public.offers(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meta_campaigns_owner ON public.meta_campaigns(owner_id, created_at DESC);

-- 5. RLS : chaque utilisateur ne voit et ne modifie que ses lignes
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['offers','meta_campaigns','meta_accounts','creative_assets','copy_assets']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "owner_all" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "owner_all" ON public.%I FOR ALL TO authenticated
         USING (owner_id = (SELECT auth.uid())) WITH CHECK (owner_id = (SELECT auth.uid()))', t);
    -- Le rôle anon (clé publique) n'a plus aucun accès.
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
  END LOOP;
END $$;

-- 6. Le token Meta stocké ne doit jamais être lisible depuis le navigateur :
--    on retire les droits de table, puis on n'accorde que les colonnes non sensibles.
REVOKE ALL ON public.meta_accounts FROM authenticated;
GRANT SELECT (id, owner_id, account_name, ad_account_id, page_id, instagram_actor_id, pixel_id, is_active, created_at)
  ON public.meta_accounts TO authenticated;
GRANT INSERT (owner_id, account_name, ad_account_id, page_id, instagram_actor_id, pixel_id, is_active)
  ON public.meta_accounts TO authenticated;
GRANT UPDATE (account_name, ad_account_id, page_id, instagram_actor_id, pixel_id, is_active)
  ON public.meta_accounts TO authenticated;
GRANT DELETE ON public.meta_accounts TO authenticated;
