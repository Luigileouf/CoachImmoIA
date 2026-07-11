# CoachImoIA

Prototype frontend pour un assistant immobilier hybride IA + coach humain.

## Contenu initial

- Choix du parcours acheteur ou vendeur
- Navigation produit mobile avec vues `Accueil`, `Biens`, `Assistant IA`, `Projets`, `Profil`
- Version plateforme web avec `Dashboard`, `Biens`, `Assistant IA`, `Projet`, `Documents`, `Communaute`, `Profil`
- Flux `Assistant IA` configurable avec Mistral API ou Gemma via Google API
- Feuille de route par scenario
- Checklist documentaire
- Espace social modere pour acheteurs et vendeurs
- Bloc de transmission vers un coach humain
- Mention de cadrage reglementaire

## Lancer le projet

```bash
cd /Users/lmetivier/Dev/CoachImoIA
npm install
npm run dev
```

## Activer le fournisseur IA

1. Copier le fichier d'exemple :

```bash
cp .env.example .env.local
```

2. Choisir `mistral` ou `google`, puis ajouter la clé API correspondante dans `.env.local`.

Variables disponibles :

- `VITE_LLM_PROVIDER` : fournisseur actif, `mistral` ou `google`
- `MISTRAL_API_KEY` : clé secrète Mistral, lue côté serveur
- `MISTRAL_MODEL` : modèle utilisé par le proxy Mistral
- `VITE_MISTRAL_MODEL` : libellé Mistral affiché dans l'interface
- `GOOGLE_API_KEY` : clé secrète Google AI Studio, lue côté serveur
- `GEMMA_MODEL` : modèle Gemma appelé par le proxy Google
- `VITE_GEMMA_MODEL` : libellé Gemma affiché dans l'interface
- `SUPABASE_URL` : URL du projet Supabase cote serveur
- `SUPABASE_ANON_KEY` : cle publique pour les usages non privilegies
- `SUPABASE_SERVICE_ROLE_KEY` : cle serveur pour les endpoints metier
- `VITE_SUPABASE_URL` : URL du projet Supabase cote navigateur
- `VITE_SUPABASE_ANON_KEY` : cle publique exposee au front

Exemple :

```bash
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL=mistral-small-latest
VITE_MISTRAL_MODEL=mistral-small-latest
GOOGLE_API_KEY=your_google_ai_studio_api_key
GEMMA_MODEL=gemma-4-26b-a4b-it
VITE_GEMMA_MODEL=gemma-4-26b-a4b-it
VITE_LLM_PROVIDER=google
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Important :

- les clés secrètes ne sont jamais envoyées au navigateur ;
- le front appelle `/api/mistral` ou `/api/gemma` selon `VITE_LLM_PROVIDER` ;
- pour revenir à Mistral, définir `VITE_LLM_PROVIDER=mistral` puis reconstruire l'application.

## Structure actuelle

Le projet est maintenant organise en couches plus lisibles :

- `src/features/...` : composants et donnees par domaine
- `src/services/assistant` : sélection du fournisseur et logique conversationnelle
- `src/services/api` : contrats clients pour les endpoints metier
- `src/services/supabase` : acces navigateur a la future base
- `api/documents`, `api/projects`, `api/social` : premiers endpoints metier
- `supabase/migrations` : base SQL versionnee

## Endpoints metier disponibles

- `GET /api/documents?mode=buyer|seller`
- `GET /api/projects?mode=buyer|seller`
- `GET /api/social?mode=buyer|seller`

Ces endpoints renvoient pour l'instant des donnees derivees du domaine produit local, afin de stabiliser les contrats avant le branchement complet de Supabase.

## Mettre en ligne gratuitement

La voie la plus simple pour partager ce prototype est Vercel Hobby.

Pourquoi :

- le frontend Vite est déployé facilement ;
- les fonctions `/api/mistral` et `/api/gemma` conservent les clés secrètes côté serveur ;
- vous obtenez une URL publique `*.vercel.app` à partager avec votre coach immobilier.

Étapes :

1. Pousser le projet sur GitHub.
2. Importer le repository dans Vercel.
3. Ajouter dans les variables d'environnement du projet pour Gemma :

```bash
GOOGLE_API_KEY=your_google_ai_studio_api_key
GEMMA_MODEL=gemma-4-26b-a4b-it
VITE_GEMMA_MODEL=gemma-4-26b-a4b-it
VITE_LLM_PROVIDER=google
```

4. Lancer le déploiement.
5. Partager l'URL Vercel générée.

Notes :

- en production, c'est la fonction [api/mistral.ts](/Users/lmetivier/Dev/CoachImoIA/api/mistral.ts) qui parle a Mistral ;
- Mistral reste disponible comme fournisseur de secours.

## Design et UX

Le point d'entree design versionne est dans :

- [design/README.md](/Users/lmetivier/Dev/CoachImoIA/design/README.md)

Les specs UX principales sont dans :

- [docs/ux-parcours-produit.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-parcours-produit.md)
- [docs/ux-flow-acheteur-ecran-par-ecran.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-flow-acheteur-ecran-par-ecran.md)
- [docs/ux-flow-vendeur-ecran-par-ecran.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-flow-vendeur-ecran-par-ecran.md)
- [docs/ux-sitemap-final.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-sitemap-final.md)
- [docs/brief-figma-hifi.md](/Users/lmetivier/Dev/CoachImoIA/docs/brief-figma-hifi.md)
- [docs/front-backlog-ecran-par-ecran.md](/Users/lmetivier/Dev/CoachImoIA/docs/front-backlog-ecran-par-ecran.md)
- [docs/architecture-front-backend.md](/Users/lmetivier/Dev/CoachImoIA/docs/architecture-front-backend.md)
- [docs/supabase-postgres-setup.md](/Users/lmetivier/Dev/CoachImoIA/docs/supabase-postgres-setup.md)
- [docs/ux-plateforme-web-architecture.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-plateforme-web-architecture.md)
- [docs/ux-plateforme-web-ecrans-prioritaires.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-plateforme-web-ecrans-prioritaires.md)
- [docs/ux-espace-social.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-espace-social.md)

## Source produit

Le prototype a ete initialise a partir du cahier des charges local disponible dans :

- `/Users/lmetivier/Dev/CoachIA Immo/CoachImmo_Cahier_des_charges.html`
