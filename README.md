# SION Ads

Du brief brut à la campagne Meta CBO : stratégie, copies, prompts créatifs, scripts vidéo, création de campagne
(toujours en pause) et recommandations Autopilot. Pensé pour l'Afrique francophone (FCFA, paiement à la livraison, WhatsApp).

Stack : Next.js 16 (App Router, Turbopack, `proxy.ts`), React 19, Tailwind 4, Supabase (Auth + Postgres + RLS), zod.

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseignez les clés
npm run dev
```

### 1. Base de données (obligatoire)

Dans Supabase > SQL Editor, exécutez dans l'ordre :

1. `supabase/migrations/0001_init.sql` (tables)
2. `supabase/migrations/0002_secure_rls.sql` (propriétaire des lignes + RLS)

Sans la migration 0002, la clé `anon` (publique dans le navigateur) peut lire et écrire toutes les tables.
La page **Réglages** vérifie l'état et vous le dit.

Côté Supabase > Authentication, désactivez « Confirm email » si vous voulez vous connecter immédiatement après
l'inscription, et ajoutez votre URL de production dans les URL autorisées.

### 2. Variables d'environnement

Voir `.env.example`. Seules les trois clés Supabase sont indispensables.

| Variable | Effet si absente |
| --- | --- |
| `OWNER_EMAILS` | tout compte Supabase valide peut se connecter |
| `LLAMA_API_KEY` / `OPENAI_API_KEY` | analyses en **mode démo**, clairement étiqueté |
| `META_ACCESS_TOKEN_LONG_LIVED` + `META_AD_ACCOUNT_ID` | campagnes enregistrées en brouillon, sans appel à Meta |
| `META_PAGE_ID` | publication Facebook désactivée |

## Architecture

```
app/
  page.tsx               landing
  login/                 connexion / inscription
  (app)/                 espace protégé : dashboard, offers, campaigns, settings
  api/brain              analyse IA + sauvegarde
  api/meta/campaigns     création campagne CBO (PAUSED)
  api/meta/sync          métriques 7 jours
  api/meta/publish       post sur la page Facebook
lib/
  brain.ts, brain-demo.ts   moteur IA + mode démo
  meta.ts                   Marketing API (jetons en en-tête, devises sans centimes)
  autopilot.ts              règles couper / réduire / scaler (recommandations)
  supabase/                 clients navigateur, serveur, proxy, admin
proxy.ts                 session + redirection des non-connectés
supabase/migrations/     schéma et RLS
```

## Sécurité

- Toutes les routes API exigent une session valide ; aucune clé Meta n'est acceptée depuis le navigateur.
- RLS : chaque utilisateur ne voit que ses lignes. `anon` n'a plus aucun droit sur les tables.
- Les campagnes sont créées en `PAUSED`. L'Autopilot recommande, il n'exécute jamais seul.
- Le budget est converti selon la devise du compte publicitaire (XAF n'a pas de sous-unité : pas de ×100).

## Pas encore implémenté

Rendu d'images et de vidéos (Replicate, ElevenLabs), planificateur de publications, exécution automatique des règles
Autopilot, création des ensembles de publicités et des annonces côté Meta.
