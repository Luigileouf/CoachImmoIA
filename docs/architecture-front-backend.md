# Architecture front / backend

## Objectif

Faire evoluer `CoachImoIA` d'un prototype centralise vers une architecture lisible, extensible et developpable en slices produit.

## Structure frontend cible

```text
src/
  app/
  components/
  data/
  features/
    core/
    home/
    listings/
    assistant/
    projects/
    documents/
    social/
    profile/
  lib/
  services/
    assistant/
  types/
```

## Regles frontend

### 1. `types/`

Contient les types de domaine partages :
- `ProjectMode`
- `AppScreen`
- `Scenario`
- `ListingItem`
- `SocialCircle`
- `SocialThread`

Le but est d'eviter que les types restent enfouis dans une page ou un composant unique.

### 2. `features/`

Chaque feature porte ses propres donnees, composants et, plus tard, sa logique de presentation.

Exemples :
- `features/home/`
- `features/assistant/`
- `features/social/`

Dans cette etape, les donnees ont deja commence a etre deplacees par domaine.

### 3. `data/`

`data/content.ts` devient un point d'agregation.

Role :
- exposer une API simple au reste de l'app
- eviter de casser tout le front pendant la transition
- servir de facade entre l'ancien prototype et la nouvelle structure

### 4. `services/`

Contient les appels metier ou techniques.

Exemple :
- `services/assistant/runtime.ts`
- `services/assistant/client.ts`
- `services/assistant/types.ts`

Le but est de sortir la logique Mistral du rendu UI.

### 5. `lib/`

`lib/` reste une couche de compatibilite ou d'outils transverses.

Exemple actuel :
- `lib/assistant.ts` re-exporte la nouvelle couche `services/assistant`

Cela permet de refactorer sans casser brutalement les imports existants.

## Structure backend cible

```text
api/
  _lib/
  assistant/
  documents/
  projects/
  social/
  coach/
```

## Regles backend

### 1. `api/_lib/`

Contient la logique partagee entre endpoints.

Exemples :
- config runtime Mistral
- forwarding vers Mistral
- types des payloads

Cette couche evite de dupliquer la logique dans chaque endpoint.

### 2. Endpoints par domaine

Decoupage recommande :
- `assistant`
  - chat
  - prompts
  - syntheses
- `documents`
  - upload
  - extraction
  - indexation
  - recherche RAG
- `projects`
  - etapes
  - checklist
  - statuts
- `social`
  - circles
  - threads
  - posts
  - moderation
- `coach`
  - escalation
  - handoff

## Methode de developpement

Developper en `vertical slices`.

Ordre recommande :
1. `Assistant IA`
2. `Documents`
3. `Projet`
4. `Social`
5. `Profil`

Pour chaque slice :
1. maquette Figma
2. types
3. donnees mock
4. composants front
5. endpoint backend
6. branchement aux donnees reelles
7. etats `loading / empty / error`

## Transition recommandee

### Court terme

- continuer a faire tourner l'app depuis `App.tsx`
- extraire progressivement les donnees et services
- commencer ensuite a sortir les ecrans et composants par feature

### Moyen terme

- creer un dossier `app/` pour porter la navigation
- sortir des composants d'ecran de `App.tsx`
- introduire une couche d'API client dediee par domaine

### Long terme

- brancher une base type `Supabase/Postgres`
- poser les contrats backend reels
- faire converger `Documents + Assistant + Social` vers un socle RAG partage
