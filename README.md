# CoachImoIA

Prototype frontend pour un assistant immobilier hybride IA + coach humain.

## Contenu initial

- Choix du parcours acheteur ou vendeur
- Navigation produit mobile avec vues `Accueil`, `Biens`, `Assistant IA`, `Projets`, `Profil`
- Flux `Assistant IA` connecte a Mistral API via une cle serveur
- Feuille de route par scenario
- Checklist documentaire
- Bloc de transmission vers un coach humain
- Mention de cadrage reglementaire

## Lancer le projet

```bash
cd /Users/lmetivier/Dev/CoachImoIA
npm install
npm run dev
```

## Activer Mistral API

1. Copier le fichier d'exemple :

```bash
cp .env.example .env.local
```

2. Ajouter votre cle API Mistral dans `.env.local`.

Variables disponibles :

- `MISTRAL_API_KEY` : cle secrete Mistral, lue cote serveur
- `MISTRAL_MODEL` : modele utilise par le proxy local
- `VITE_MISTRAL_MODEL` : libelle public affiche dans l'interface

Exemple :

```bash
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL=mistral-small-latest
VITE_MISTRAL_MODEL=mistral-small-latest
```

Important :

- la cle n'est jamais envoyee au navigateur ;
- le front appelle `/api/mistral`, un proxy local Vite qui relaie vers `https://api.mistral.ai/v1/chat/completions`.

## Mettre en ligne gratuitement

La voie la plus simple pour partager ce prototype est Vercel Hobby.

Pourquoi :

- le frontend Vite est deploye facilement ;
- la fonction [`/api/mistral`](/Users/lmetivier/Dev/CoachImoIA/api/mistral.ts) permet de garder `MISTRAL_API_KEY` cote serveur ;
- vous obtenez une URL publique `*.vercel.app` a partager avec votre coach immobilier.

Etapes :

1. Pousser le projet sur GitHub.
2. Importer le repository dans Vercel.
3. Ajouter dans les variables d'environnement du projet :

```bash
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL=mistral-small-latest
```

4. Lancer le deploy.
5. Partager l'URL Vercel generee.

Notes :

- en production, c'est la fonction [api/mistral.ts](/Users/lmetivier/Dev/CoachImoIA/api/mistral.ts) qui parle a Mistral ;
- en local, `vite.config.ts` garde un proxy pratique pour le developpement.

## Design et UX

Le point d'entree design versionne est dans :

- [design/README.md](/Users/lmetivier/Dev/CoachImoIA/design/README.md)

Les specs UX principales sont dans :

- [docs/ux-parcours-produit.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-parcours-produit.md)
- [docs/ux-flow-acheteur-ecran-par-ecran.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-flow-acheteur-ecran-par-ecran.md)
- [docs/ux-flow-vendeur-ecran-par-ecran.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-flow-vendeur-ecran-par-ecran.md)
- [docs/ux-sitemap-final.md](/Users/lmetivier/Dev/CoachImoIA/docs/ux-sitemap-final.md)
- [docs/brief-figma-hifi.md](/Users/lmetivier/Dev/CoachImoIA/docs/brief-figma-hifi.md)

## Source produit

Le prototype a ete initialise a partir du cahier des charges local disponible dans :

- `/Users/lmetivier/Dev/CoachIA Immo/CoachImmo_Cahier_des_charges.html`
