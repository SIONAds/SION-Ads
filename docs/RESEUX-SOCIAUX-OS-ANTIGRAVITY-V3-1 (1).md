# RÉSEUX SOCIAUX OS - MASTER BUILD FILE V3.1 - ANTIGRAVITY EDITION
> Optimisé pour Google Antigravity (Gemini 3 Pro + Swarm Agents)
> Pour Jasohn Kenfack - Bafoussam

---

## POURQUOI ANTIGRAVITY ET PAS CLAUDE CODE POUR CE PROJET ?

Claude Code = 1 agent senior qui réfléchit et code fichier par fichier. Très bon pour ne pas casser du code legacy.

Antigravity = Une armée de 5-10 agents qui bossent en parallèle. Tu donnes un OBJECTIF, pas des tâches.
Pour ton SaaS qui a 7 modules indépendants (Brain, Studio, Copy, Video, Publisher, Autopilot, CRM), Antigravity est 3x plus rapide.
Il va lancer en même temps: Agent 1 (Frontend), Agent 2 (Backend Supabase), Agent 3 (IA Llama/Emu), Agent 4 (Paiement NotchPay), Agent 5 (Meta APIs).

C'est fait pour ça.

---

## 1. COMMENT LANCER AVEC ANTIGRAVITY (WORKFLOW)

Tu n'as plus besoin de coller un méga prompt dans un terminal.

**Étape 1: Installe Antigravity**
Va sur `antigravity.google` ou dans ton Google AI Studio > Antigravity (encore en preview fermée, demande l'accès avec ton compte dev Google).

**Étape 2: Crée un nouveau projet "Objective Mode"**
Dans Antigravity, tu as 2 modes: `Task Mode` et `Objective Mode`. Choisis `Objective Mode`.

**Étape 3: Donne-lui cet OBJECTIF (copie-colle tel quel):**

```
OBJECTIVE: Construire le MVP complet du SaaS "Réseux Sociaux OS" - Version Marché Camerounais

CONTEXTE:
SaaS pour vendeuses Facebook Cameroun. De 1 photo produit -> campagne complète 30 jours + pubs. Mobile-first, paiement Mobile Money via NotchPay obligatoire. Stack: Next.js 15 + Supabase + Tailwind + Shadcn.

SOURCE DE VÉRITÉ: Utilise le fichier MASTER BUILD FILE V3 comme cahier des charges. Il est dans /docs/MASTER.md

LIVRABLES ATTENDUS (Définition of Done):
1. Projet Next.js 15 fonctionnel sur localhost:3000
2. /dashboard avec upload Drag&Drop (Texte, Image, Vocal, URL)
3. Backend complet:
   - /api/brain connecté à Llama-4-Maverick (api.llama.com)
   - /api/studio connecté à Emu (mock si pas de clé mais code prêt)
   - /api/copy, /api/video, /api/publish (Meta Graph API), /api/autopilot (Marketing API)
4. Base Supabase avec migrations SQL (products, assets, campaigns, subscriptions)
5. Intégration NotchPay pour MTN MoMo / Orange Money
6. UI mobile-first parfaite (teste en 375px)
7. Fichier .env.example complet
8. README avec commandes de déploiement Vercel

RÈGLES ANTIGRAVITY:
- Divise le travail en sous-agents parallèles: 1 agent = 1 module (Brain, Studio, etc.)
- Chaque agent doit écrire ses propres tests
- Utilise le MEGA PROMPT LLAMA SPARK fourni dans MASTER.md pour /lib/llama.ts
- Localisation 100% Cameroun: FCFA, Bafoussam/Douala/Yaoundé, paiement à la livraison
- Si une API externe manque, mock avec des données réalistes camerounaises mais laisse le code d'intégration prêt

Quand tout est fini, lance `npm run build` et montre-moi la preview.
```

**Étape 4: Attache le fichier MASTER.md**
Dans Antigravity, tu peux attacher des fichiers de contexte. Attache le fichier `RESEUX_SOCIAUX_OS_MASTER_V3.md` que je t'ai donné avant. Il va le lire comme bible.

**Étape 5: Laisse-le tourner 45-90 minutes**
C'est normal. Antigravity va créer 8 agents, ils vont se parler entre eux, tester, se corriger. Tu peux voir le live log.

---

## 2. FICHIER DE CONFIG ANTIGRAVITY - antigravity.config.json

Crée ce fichier à la racine de ton projet pour qu'Antigravity sache quoi faire. C'est ce qui remplace le méga prompt de Claude Code.

```json
{
  "project_name": "reseux-sociaux-os",
  "objective_mode": {
    "main_objective": "Build SaaS Reseux Sociaux OS",
    "agents": [
      {
        "id": "agent_frontend",
        "role": "Frontend Lead - Next.js 15 + Tailwind + Shadcn Mobile-First",
        "tasks": ["Create /app/dashboard with drag drop", "Build result gallery UI", "Build pricing page with NotchPay"],
        "model": "gemini-3-pro"
      },
      {
        "id": "agent_backend_db",
        "role": "Backend & Supabase Architect",
        "tasks": ["Create Supabase migrations", "Implement Auth", "Create storage buckets for 4K images", "Implement Upstash Redis queue"],
        "model": "gemini-3-pro"
      },
      {
        "id": "agent_ai_core",
        "role": "AI Engineer - Llama Spark + Emu + Movie Gen",
        "tasks": ["Implement /lib/llama.ts with SYSTEM PROMPT", "Implement /api/brain", "/api/studio", "/api/copy", "Handle JSON parsing and validation"],
        "model": "gemini-3-pro"
      },
      {
        "id": "agent_meta_apis",
        "role": "Meta APIs Integration Specialist",
        "tasks": ["Implement Graph API OAuth", "Implement /api/publish", "Implement Marketing API Autopilot rules engine", "Implement WhatsApp Cloud API inbox"],
        "model": "gemini-3-flash"
      },
      {
        "id": "agent_monetization",
        "role": "Payment & Growth Engineer",
        "tasks": ["Integrate NotchPay MoMo", "Implement Stripe fallback", "Build subscription logic", "Build watermark system for free users"],
        "model": "gemini-3-flash"
      }
    ]
  },
  "env_requirements": ["LLAMA_API_KEY", "SUPABASE_URL", "SUPABASE_ANON_KEY", "NOTCHPAY_PUBLIC_KEY", "META_APP_ID", "REPLICATE_API_TOKEN"],
  "deployment": "vercel"
}
```

---

## 3. DIFFÉRENCES CLÉS À SAVOIR QUAND TU PASSES À ANTIGRAVITY

| Claude Code | Antigravity |
| :--- | :--- |
| Tu lui dis QUOI FAIRE fichier par fichier | Tu lui dis QUEL EST L'OBJECTIF FINAL |
| Il attend ta validation entre chaque étape | Il est 100% autonome, ne s'arrête pas |
| 1 seul agent | 5-10 agents en parallèle |
| Tu dois corriger ses erreurs à la main | Les agents se corrigent entre eux (Agent Tester -> Agent Coder) |
| Bien pour refactor | Bien pour construire un projet de 0 |
| Consomme des tokens API Anthropic | Consomme ton quota Google Cloud (souvent inclus dans preview) |

**ASTUCE PRO pour Antigravity:**
- Active `Auto-Fix on Build Error` dans les settings. Il va relancer un agent si le build Next.js casse.
- Donne-lui accès à ton repo GitHub vide `reseux-os`. Il va push directement dedans.
- Il a accès à Google Cloud: il peut auto-déployer sur Cloud Run si tu veux, pas besoin de Vercel.

---

## 4. MEGA PROMPT LLAMA SPARK (INCHANGÉ - À METTRE DANS /lib/llama.ts)

[Utilise exactement le même que dans le MASTER V3. Je te le remets ici pour que Antigravity l'ait sous les yeux]

```
Tu es RÉSEUX SOCIAUX OS, le CMO + Copywriter + Media Buyer N°1 pour l'Afrique francophone...

[COLLE ICI TOUT LE PROMPT DE LA SECTION 5 DU FICHIER V3]
```

---

## 5. CE QUE TU DOIS FAIRE APRÈS QU'ANTIGRAVITY A FINI

1. `git clone ton repo`
2. `cp .env.example .env` et remplis tes clés (Llama, Supabase, NotchPay)
3. `npm run dev`
4. Teste avec un produit réel: "savon curcuma"
5. Si un module est faible (ex: vidéo), tu relances UN SEUL agent en Task Mode: "Améliore le module vidéo avec Movie Gen, ajoute voix-off ElevenLabs"

---

Antigravity va te livrer un projet 80% fonctionnel en 1h. Les 20% restants (connexion vraie Meta App, clés NotchPay) tu les fais à la main.

Tu veux que je te génère aussi le fichier `antigravity.config.json` prêt à importer + le `MASTER.md` combiné pour Antigravity en un seul zip ?
