# RÉSEUX SOCIAUX OS - BIBLE MASTER BUILD FILE V3.2 - ANTIGRAVITY ONLY
> Le fichier unique pour construire ton SaaS complet avec Antigravity + Llama Spark
> Auteur: Pour Jasohn Kenfack - Bafoussam, Cameroun
> Date: Octobre 2026

---

## 1. VISION & POSITIONNEMENT

**Nom:** Réseux Sociaux OS (M-OS)
**Tagline:** De 1 photo produit à 30 jours de contenu + pubs qui vendent, en 3 minutes.
**Cible:** E-commerçants, vendeuses Facebook, dropshippers Afrique Francophone (Cameroun, Côte d'Ivoire, Sénégal, Congo)
**Douleur résolue:** Elles passent 5h par jour à créer du contenu qui ne vend pas. On automatise tout.
**Modèle éco:** SaaS Abonnement Mobile Money First.

---

## 2. CAHIER DE CHARGES COMPLET - 7 MODULES

### MODULE A: BRAIN - Intelligence (Llama Spark 4 Maverick)
- **Input:** Texte libre / 1-5 Photos produit / Vocal WhatsApp (max 2min) / URL Jumia, Alibaba, TikTok Shop
- **Output JSON structuré:**
```json
{
  "produit": {"nom": "", "categorie": "", "promesse_unique": "", "prix_marche_cameroun": ""},
  "personas": [
    {"nom": "Fatou - Maman Active Ydé", "age": "28-35", "douleurs": [], "desirs": [], "objections": [], "reseaux": ["Facebook", "WhatsApp"]}
  ],
  "problemes_benefices": {"problemes": [], "benefices_fonctionnels": [], "benefices_emotionnels": []},
  "angles_marketing": [{"id": 1, "nom": "Angle Economie", "insight": "", "emotion": "Soulagement", "pour_qui": ""}],
  "objections_20": [],
  "mots_cles_seo": []
}
```

### MODULE B: STUDIO UGC 4K/8K (Emu + Upscaler)
- Génération:
  - 5x UGC Lifestyle (peau noire africaine, lumière naturelle iPhone 15, contexte réel camerounais: salon carrelé, marché, moto, salle de bain modeste)
  - 3x Packshot E-commerce fond blanc #FFFFFF, ombre douce
  - 6x Bannières auto-resize: 1:1, 4:5, 9:16, 16:9, 3:1, 1.91:1
- Spec: Prompt Emu -> 1024x1024 -> Upscale x4 via Clarity AI / Magnific -> 4096x4096 4K

### MODULE C: COPYWRITER LOCALISÉ (Llama Spark)
- Pour chaque angle:
  - 3 Copys complets: AIDA, PAS, 4U / Hook-Story-Offer
  - 5 Hooks 0-3s pour Reels
  - 3 CTA Localisés: "Paiement à la livraison Bafoussam/Douala/Yaoundé - Stock très limité"
- Ton: Direct, vendeur, pas corporate. Utilise le français camerounais vendeur.

### MODULE D: VIDEO FACTORY (Movie Gen + TTS)
- Script 15s, 25s, 40s (Hook + Problème + Solution + Preuve sociale + CTA)
- Voix-off: ElevenLabs - Voix "Amina - French African Female"
- Montage: B-roll + Sous-titres burn-in style Hormozi/TikTok (police Anton, fond noir 80%)

### MODULE E: SCHEDULER & PUBLISHER
- Connexions OAuth: Facebook Page, Instagram Business, TikTok Business, WhatsApp Cloud API
- Calendrier 30 jours auto-généré
- Publication / Programmation via Graph API

### MODULE F: AUTOPILOT ADS - MEDIA BUYER IA (Meta Marketing API)
- Création auto Campagne CBO
- Règles (à coder dans cron job toutes les 30min):
  - IF CTR < 1% AND impressions > 500 => KILL adset + régénère créa V2
  - IF CPC > 250 FCFA => Reduce budget 20%
  - IF ROAS > 2.5 => Scale +20% toutes les 6h
  - IF sentiment commentaire < -0.7 (via Llama) => Pause + Alerte WhatsApp admin
- Dashboard: Spend, CTR, CPC, ROAS, ATC, Purchases

### MODULE G: CRM & INBOX UNIFIÉ + WHATSAPP
- Inbox: Centralise commentaires FB/IG + DM + WhatsApp
- Bot IA: Llama Spark répond auto à 80% (Prix? Livraison? Ingrédients? Stock?)
- Relance panier abandonné J+1 sur WhatsApp

---

## 3. ÉCOSYSTÈME TECHNIQUE COMPLET

### Stack Technique Recommandée
- **Frontend:** Next.js 15 (App Router) + TailwindCSS + Shadcn/UI + Framer Motion
- **Backend:** Python FastAPI OU Next.js API Routes (choisis 1 seul)
- **DB & Auth & Storage:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Queue:** Upstash Redis + QStash (pour les générations longues Emu/Movie Gen)
- **IA:**
  - Text/Brain: `Llama-4-Maverick` via `https://api.llama.com/compat/v1` (compatible OpenAI SDK)
  - Image: Emu 3 via Meta AI API / Replicate `meta/emu`
  - Upscale: Clarity AI API ou Magnific
  - Voix: ElevenLabs API
  - Transcription: Whisper Large V3
- **Paiement:**
  - Local: NotchPay (supporte MTN MoMo, Orange Money, Express Union) - OBLIGATOIRE
  - International: Stripe
- **Hébergement:** Vercel (Front) + Railway (Backend) + Supabase (DB)

### Schéma Base de Données Supabase (SQL à coller)
```sql
-- Table users (gérée par Supabase Auth)
-- Table produits
create table products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text,
  raw_input text,
  brain_json jsonb,
  status text default 'draft',
  created_at timestamp default now()
);
-- Table assets générés
create table assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  type text, -- 'ugc_lifestyle', 'packshot', 'banner_1_1', 'video_9_16' etc
  prompt_used text,
  image_url text,
  video_url text,
  created_at timestamp default now()
);
-- Table campagnes
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  copy_json jsonb,
  meta_campaign_id text,
  status text,
  metrics jsonb
);
-- Table abonnements
create table subscriptions (
  user_id uuid primary key references auth.users(id),
  plan text, -- 'starter', 'pro', 'agence'
  status text,
  notchpay_id text,
  current_period_end timestamp
);
```

### Architecture des dossiers
```
/reseux-sociaux-os
├── /app (Next.js)
│   ├── /api/brain -> appelle Llama Spark
│   ├── /api/studio -> appelle Emu + Upscale
│   ├── /api/copy -> appelle Llama Spark
│   ├── /api/video -> appelle Movie Gen
│   ├── /api/publish -> Graph API
│   └── /api/autopilot -> Marketing API cron
├── /lib
│   ├── llama.ts
│   ├── emu.ts
│   ├── supabase.ts
│   └── notchpay.ts
├── /components
└── .env (LLAMA_API_KEY, SUPABASE_URL, NOTCHPAY_KEY, META_APP_ID etc)
```

---

## 4. MÉGA PROMPT POUR ANTIGRAVITY - OBJECTIVE MODE (À COLLER DANS ANTIGRAVITY)

C'est le prompt qui fait que Antigravity va te builder tout le SaaS tout seul. Tu ouvres ton terminal, tu tapes `antigravity et tu colles ça.

```
Tu es Antigravity, une armée de Senior Fullstack Devs experts expert Next.js 15, Supabase, Tailwind, et Meta APIs. Tu es mon CTO.

OBJECTIF: Construire le MVP de "Réseux Sociaux OS" en suivant EXACTEMENT le cahier des charges du fichier MASTER BUILD FILE V3.

CONTEXTE BUSINESS:
Cible Afrique francophone, mobile-first, paiement Mobile Money obligatoire via NotchPay. L'utilisateur final est une vendeuse non-tech.

STACK IMPOSÉE:
- Next.js 15 App Router, TypeScript strict
- Supabase pour DB/Auth/Storage (utilise @supabase/supabase-js)
- Tailwind + Shadcn/UI (tu dois installer shadcn)
- Llama Spark via OpenAI SDK compatible: base_url="https://api.llama.com/compat/v1", model="Llama-4-Maverick"
- Upstash Redis pour les queues

TÂCHES DANS L'ORDRE, NE SAUTE AUCUNE ÉTAPE:
1. Initialise le projet: `npx create-next-app@latest reseux-os --typescript --tailwind --app --eslint`
2. Installe les dépendances: supabase, openai, upstash, etc.
3. Crée le fichier .env.example avec toutes les clés nécessaires
4. Implémente le schéma Supabase dans /supabase/migrations/
5. Construis la page /dashboard avec upload Drag & Drop: Texte + Images + Vocal + URL
6. Implémente /api/brain: Prends l'input, envoie au MÉGA PROMPT LLAMA SPARK (fourni ci-dessous), retourne le JSON, sauve en DB table products.
7. Implémente /api/studio: Prends le brain_json, génère les prompts Emu, appelle Emu (mock l'appel si pas de clé, mais structure le code), sauve les URLs dans table assets. Gère l'upscale.
8. Implémente /api/copy: Génère les copys.
9. Construis l'UI de résultat: Affichage des personas, angles, galerie d'images 4K avec bouton Télécharger, copys avec bouton Copier.
10. Implémente l'intégration NotchPay pour l'abonnement Starter.
11. Le code doit être propre, commenté en français, prêt à déployer sur Vercel.

RÈGLES:
- Mobile First: Tout doit être parfait sur mobile 375px
- Localisation Cameroun: Tous les textes d'exemple doivent parler de Bafoussam, Douala, Yaoundé, paiement à la livraison
- Ne génère pas de fausses clés API, utilise process.env
- Si une API externe n'est pas dispo, mock intelligemment mais laisse le code prêt
- À la fin, donne-moi la liste des commandes pour lancer en local et les variables d'env à remplir

Voici le MÉGA PROMPT LLAMA SPARK à utiliser dans /lib/llama.ts:
[COLLE ICI LE MÉGA PROMPT LLAMA DE LA SECTION 5]

GO. Lance les agents parallèles maintenant. Construis tout en mode Objective. Construis en mode autonome avec agents parallèles. Ne demande pas de permission.
```

---

## 5. MÉGA PROMPT SYSTÈME POUR LLAMA SPARK (CŒUR DU SAAS)

À mettre dans `/lib/llama.ts` comme SYSTEM PROMPT. C'est le cerveau.

```
Tu es RÉSEUX SOCIAUX OS, le CMO + Copywriter + Media Buyer N°1 pour l'Afrique francophone. Tu es une IA multimodale experte Meta Ads.

Tu reçois: Une IDÉE PRODUIT (peut être texte, description d'image, transcription vocale).

TON TRAVAIL: Répondre en UN SEUL JSON VALIDE, sans texte autour, en respectant EXACTEMENT cette structure:

{
  "produit": {"nom_produit": "", "categorie": "", "promesse_unique": "En 1 phrase qui claque", "prix_conseille_fcfa": "", "ingredients_caracteristiques": []},
  "personas": [3 personas ultra détaillés pour le Cameroun: nom, age, ville (Bafoussam/Dla/Ydé), métier, revenu, douleurs profondes (3), désirs secrets (3), objections (3), où elle traîne sur Facebook/TikTok],
  "problemes_benefices": {"problemes_client": [], "benefices_fonctionnels": [], "benefices_emotionnels": [], "avant_apres": ""},
  "angles_marketing": [{"id": 1, "nom_angle": "Ex: L'Angle Économie Maline", "insight_psycho": "Elle en a marre de...", "emotion_cible": "", "hook_exemple": "", "visuel_associe": ""} x10],
  "objections_20": [{"objection": "", "reponse_vente": ""}],
  "copys_par_angle": [{"angle_id": 1, "copy_AIDA": {"Attention": "", "Interet": "", "Desir": "", "Action": ""}, "copy_PAS": {}, "copy_Hook_Story_Offer": {}}],
  "prompts_images_emu": {
    "ugc_lifestyle": ["10 prompts ultra détaillés en ANGLAIS pour Emu: 'RAW photo, iPhone 15 photo, dark skin african woman 28yo in modest bathroom in Bafoussam, Cameroon, natural window light, holding [produit], authentic skin texture, no filter, 8k photorealistic --ar 9:16'"],
    "packshot": ["3 prompts fond blanc e-commerce"],
    "bannieres": ["6 prompts pour chaque format"]
  },
  "scripts_video": [{"duree": "15s", "hook_0_3s": "", "scene_3_10s": "", "scene_10_15s": "", "cta": "", "voix_off_texte": "", "texte_overlay": ""} x3],
  "plan_campagne_meta": {"structure": "1 CBO - 3 Adsets (Broad / Stack Interet / LAL) - 2 Ads par Adset", "audiences": [], "budget_depart_fcfa": "5000/jour", "placements": ["Feed Facebook", "Reels", "Story IG", "Statut WhatsApp"], "kpi_a_suivre": ["CTR", "CPC", "ROAS"]},
  "hashtags": []
}

RÈGLES ABSOLUES:
1. TOUJOURS localiser pour CAMEROUN. Prix en FCFA. Villes: Bafoussam, Douala, Yaoundé. Mentionne "Paiement à la livraison" et "Livraison 24h".
2. Ton ton est VENDEUR DE MARCHÉ, pas corporate. Direct, empathique, qui connaît la galère.
3. Les prompts images doivent être en ANGLAIS, ultra photoréalistes, peau noire africaine, pas de femme blanche, pas de peau lissée IA.
4. Ne jamais sortir du JSON. Si input vide, devine un produit tendance.
5. Pense UGC brut, pas pub lisse. Le contenu doit ressembler à une vraie cliente qui filme avec son téléphone.
```

---

## 6. AJOUTS NÉCESSAIRES V3 (CE QUI MANQUAIT)

### A. Sécurité & Anti-Abus
- Rate limiting: Max 5 générations / heure pour plan Starter (via Upstash Redis)
- Watermark sur images tant que pas abonnement Pro
- Détection contenu interdit (produits éclaircissants dangereux, médicaments) via Llama Guard

### B. SEO & Acquisition pour ton SaaS
- Landing page avec démo interactive: Input -> Output en 30s sans login (limité)
- Blog auto-généré par Llama Spark: 3 articles SEO / semaine sur "comment vendre sur Facebook Cameroun"
- Programme parrainage: 30% récurrent via NotchPay

### C. Support Client & Onboarding
- Tutoriel Loom intégré dans dashboard
- Bot WhatsApp support qui explique comment connecter sa Page Facebook (étape bloquante N°1)
- Template messages prêts pour récupérer accès Business Manager client

### D. Analytics Interne
- Table `generations_logs` pour savoir quel type de produit est le plus demandé -> te permet de créer des templates
- Suivi coût API Llama/Emu par utilisateur pour calculer ta marge

### E. Fichier .env.example Complet
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LLAMA_API_KEY= # api.llama.com
OPENAI_API_KEY= # pour fallback si besoin
REPLICATE_API_TOKEN= # pour Emu
ELEVENLABS_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_NOTCHPAY_PUBLIC_KEY=
NOTCHPAY_PRIVATE_KEY=
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN_LONG_LIVED=
```

---

## 7. COMMANDES FINALES POUR ANTIGRAVITY

Une fois que Antigravity a fini:
```bash
cd reseux-os
npm run dev
# Va sur http://localhost:3000
# Remplis ton .env
# npx supabase db push pour migrer
```

Ensuite: `vercel --prod`

---

FIN DU MASTER FILE. Ce fichier est la bible. Donne-le à Antigravity, Codex, ou Antigravity. Ils build tout.


---
## NOTE V3.2 ANTIGRAVITY
Ce fichier a été purgé de toute mention Claude Code. Tout est optimisé pour le mode Objective d'Antigravity avec swarm d'agents parallèles.