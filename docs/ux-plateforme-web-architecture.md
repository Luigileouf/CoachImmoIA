# Plateforme Web CoachImmoIA

## Objectif

Transformer le prototype mobile en une plateforme web de travail pour :

- suivre plusieurs dossiers immobiliers
- centraliser biens, documents, echanges et actions
- donner a l'assistant IA un vrai espace de travail
- permettre au coach humain de reprendre la main aux moments critiques

## Positionnement UX

La version mobile reste la vitrine et le parcours guide.

La version web devient :

- plus dense
- plus analytique
- plus multi-colonnes
- plus orientee productivite

Elle doit servir autant a un particulier avance qu'a un coach immobilier qui pilote un dossier.

## Principes de structure

## 1. Navigation principale

La plateforme web repose sur une navigation laterale persistante.

Entrees recommandees :

- `Dashboard`
- `Biens`
- `Assistant IA`
- `Projets`
- `Documents`
- `Profil`

Le header haut porte :

- la recherche globale
- le switch `Acheteur / Vendeur`
- l'acces notifications
- l'escalade `Contacter mon coach`

## 2. Logique de layout desktop

Le web doit exploiter l'espace horizontal.

Patterns cibles :

- `Dashboard` : colonne principale + panneau lateral
- `Biens` : liste + filtres + detail
- `Assistant IA` : chat + contexte + suggestions
- `Projet` : roadmap + checklist + bloc actions
- `Documents` : table / cartes + statut + actions rapides

## 3. Role produit de chaque ecran

### Dashboard

Vue d'ensemble du dossier actif :

- progression
- prochaines actions
- KPI
- raccourcis vers les zones critiques

### Biens

Espace de qualification et comparaison.

Pour un acheteur :

- biens a visiter
- shortlist
- alertes risque

Pour un vendeur :

- comparables
- references du marche
- positionnement prix

### Assistant IA

Workspace conversationnel central.

Le chat ne doit pas etre seul : il faut lui adjoindre un panneau de contexte avec :

- resume du dossier
- documents relies
- prompts utiles
- actions declenchables

### Projets

Suivi macro du dossier.

Contenu attendu :

- timeline
- etapes
- dependances
- points de vigilance
- escalade coach

### Documents

Zone de pilotage documentaire.

Contenu attendu :

- statuts
- documents manquants
- documents valides
- demandes a envoyer
- sources utilisees par le RAG

### Profil

Configuration, securite, preferences et mode d'accompagnement.

## 4. Deux parcours metier

### Parcours acheteur

Priorites :

- cadrer budget
- prioriser les biens
- preparer visites
- structurer l'offre
- rassurer la banque

### Parcours vendeur

Priorites :

- cadrer le prix
- reunir les documents
- organiser la mise en vente
- qualifier les offres
- arbitrer avec le coach

## 5. Etats desktop a prevoir

La plateforme web doit decliner les memes familles d'etats que le mobile :

- `empty`
- `loading`
- `risk`
- `success`
- `coach handoff`

## 6. Composants structurants

La maquette web doit se construire autour de :

- sidebar
- top search bar
- cards KPI
- timeline verticale
- panel de contexte
- tableau documentaire
- cartes de biens
- chat panel
- tags et statuts

## Recommandation d'execution

Le bon ordre pour la suite produit est :

1. maquettage desktop des ecrans coeur
2. integration front desktop responsive
3. branchement progressif des flux IA, projet et documents
