# CoachImmoIA · Flow Vendeur Ecran Par Ecran

## Objectif du flow

Le flow `Vendeur` doit aider un proprietaire a structurer sa vente sans se sentir perdu entre documents, prix, calendrier et arbitrages.

Le fil conducteur UX :

1. comprendre ou il en est
2. cadrer la valeur de son bien
3. reunir les bons documents
4. preparer une mise en vente propre
5. escalader vers un coach humain sur les decisions sensibles

## Ton UX attendu

- rassurant
- ordonne
- credible
- concret
- non anxiogene

## Ecran 1 · Accueil Vendeur

### Role

Donner une vision claire de la situation vendeur et ouvrir sur la prochaine action la plus utile.

### Contenu

- salutation personnalisee
- promesse produit
- switch `Acheteur / Vendeur / Estimer`
- cartes d'entree
- resume projet vendeur
- CTA principal

### Message principal

`Organisez votre vente avec une feuille de route simple, des documents clairs et un cadrage de prix plus serein.`

### CTA principal

`Demarrer mon projet vendeur`

### CTA secondaires

- `Estimer mon bien`
- `Voir mon projet`

### Elements de reassurance

- documents critiques identifies
- strategie de vente a arbitrer
- relais coach humain sur prix, mandat et offre

### Transition principale

Si aucun projet n'existe :
- va vers onboarding vendeur

Si un projet existe deja :
- va vers `Projet vendeur`

## Ecran 2 · Onboarding Projet Vendeur

### Role

Recueillir juste les informations utiles pour initialiser un projet vendeur exploitable.

### Structure en 4 blocs

1. `Bien`
2. `Localisation`
3. `Etat du dossier`
4. `Horizon de vente`

### Champs / choix

- type de bien
- surface
- nombre de pieces
- ville / quartier
- copropriete ou non
- diagnostics disponibles ou non
- urgence : immediat / 3 mois / 6 mois+

### CTA principal

`Construire ma feuille de route vendeur`

### CTA secondaire

`Passer cette etape`

### Sortie attendue

Creation d'un projet vendeur avec :
- etapes prioritaires
- liste documentaire initiale
- scenario d'estimation

## Ecran 3 · Projet Vendeur Overview

### Role

Montrer l'etat de preparation de la vente et les points de friction.

### Contenu

- statut du projet
- niveau de preparation du dossier
- indicateurs clefs
  - prix vise
  - documents manquants
  - strategie a arbitrer
- checklist actuelle
- timeline simplifiee

### Sections

#### Bloc 1

`Votre vente aujourd'hui`

Exemple :
- `Preparation en cours`
- `3 documents critiques manquants`
- `Prix a cadrer`

#### Bloc 2

`Feuille de route`

Etapes :
- reunir les documents
- cadrer le prix
- preparer la commercialisation
- recevoir et analyser les offres
- securiser le compromis

#### Bloc 3

`Pieces a reunir`

- titre de propriete
- taxe fonciere
- diagnostics
- PV d'AG et carnet d'entretien

### CTA principal

`Voir mes documents prioritaires`

### CTA secondaires

- `Estimer mon bien`
- `Demander quoi faire maintenant`

## Ecran 4 · Estimation Vendeur

### Role

Donner une premiere fourchette credible et expliquer ce qui l'influence.

### Contenu

- fourchette estimee
- comparables
- facteurs qui soutiennent ou freinent la valeur
- recommandations immediates

### Sections

#### Bloc 1

`Fourchette de valeur`

- borne basse
- borne haute
- niveau de confiance

#### Bloc 2

`Pourquoi cette estimation`

- secteur
- surface
- etage / exterieur / etat
- DPE
- qualite du dossier

#### Bloc 3

`Ce qui peut faire bouger le prix`

- presentation du bien
- documents prets
- qualite des photos
- strategie de diffusion

### CTA principal

`Cadrer mon prix de mise en vente`

### CTA secondaires

- `Voir les comparables`
- `Demander une analyse a l'IA`

## Ecran 5 · Comparables Marche

### Role

Aider le vendeur a ne pas confondre prix souhaite et prix defendable.

### Contenu

- references de biens similaires
- prix au m2
- delai de vente
- niveau de comparabilite

### Structure d'une carte comparable

- localisation
- type / surface
- prix ou prix au m2
- badge :
  - `Comparable fort`
  - `Reference utile`
  - `Signal marche`
- note rapide

### CTA principal

`Conserver cette reference`

### CTA secondaires

- `Comparer a mon bien`
- `Poser une question a l'IA`

## Ecran 6 · Documents Vendeur

### Role

Rendre visible la liste documentaire sans effet tunnel.

### Contenu

- documents disponibles
- documents manquants
- statut par document
- niveau d'urgence

### Categories

#### Propriete

- titre de propriete
- taxe fonciere

#### Technique

- DPE
- amiante
- electricite
- gaz

#### Copropriete

- PV d'AG
- carnet d'entretien
- montant des charges

### Etats a afficher

- `Disponible`
- `A demander`
- `A verifier`
- `Critique`

### CTA principal

`Generer la liste pour mon syndic`

### CTA secondaires

- `Marquer comme recu`
- `Demander l'aide de l'IA`

## Ecran 7 · Assistant IA Vendeur

### Role

Aider le vendeur a gagner du temps sur les formulations, la priorisation et les doutes.

### Cas d'usage prioritaires

- demander les pieces au syndic
- structurer une checklist vendeur
- comprendre un document
- cadrer une strategie de prix
- preparer la reponse a une offre

### Prompts de depart

- `Quelle liste envoyer au syndic ?`
- `Comment fixer un prix de mise en vente credible ?`
- `Que verifier avant d'accepter une offre ?`

### Comportement attendu

L'assistant doit :

- recontextualiser le projet vendeur
- repondre de facon structuree
- finir par des actions concretes

### CTA principal

`Envoyer ma question`

### CTA secondaires

- `Transformer en email`
- `Transmettre au coach`

## Ecran 8 · Preparation De La Mise En Vente

### Role

Transformer un dossier vendeur partiel en lancement propre.

### Contenu

- readiness score
- prix de mise en vente propose
- pieces encore manquantes
- points a finaliser avant diffusion

### Sections

#### Bloc 1

`Votre bien est-il pret a sortir ?`

- oui / presque / non

#### Bloc 2

`Ce qu'il manque encore`

- diagnostic
- piece copro
- arbitrage strategie

#### Bloc 3

`Strategie de commercialisation`

- vente directe
- agence
- mixte

### CTA principal

`Preparer ma mise en vente`

### CTA secondaires

- `Comparer les strategies`
- `Demander un arbitrage humain`

## Ecran 9 · Analyse D'Offre Recue

### Role

Aider le vendeur a ne pas regarder seulement le prix affiche.

### Contenu

- montant de l'offre
- solidite du dossier acheteur
- conditions suspensives
- delai
- points de risque

### Axes d'analyse

- prix
- financement
- calendrier
- robustesse du dossier
- probabilite d'aboutir

### Sortie attendue

Un message du type :

`L'offre est correcte en valeur, mais le dossier doit etre renforce avant acceptation.`

### CTA principal

`Analyser cette offre`

### CTA critique

`Demander un retour coach humain`

## Ecran 10 · Escalade Coach Humain Vendeur

### Role

Faire sentir qu'un arbitrage humain est un service de valeur, pas une rustine.

### Declencheurs

- fixation du prix
- doute sur la strategie de vente
- lecture d'une offre
- negociation sensible

### Contenu

- pourquoi un coach humain est recommande
- ce qu'il peut aider a decider
- format d'intervention
- delai estime

### CTA principal

`Demander un retour coach`

### CTA secondaire

`Continuer avec l'IA`

## Micro-interactions a prevoir dans Figma

- badges documentaires lisibles d'un coup d'oeil
- estimation avec contraste fort mais elegant
- points critiques mis en avant sans alarmer
- transitions douces entre `Projet`, `Estimation` et `Assistant`

## Hierarchie de priorite pour la maquette hi-fi

### Lot 1

1. Accueil Vendeur
2. Projet Vendeur Overview
3. Estimation Vendeur
4. Documents Vendeur
5. Assistant IA Vendeur

### Lot 2

6. Comparables Marche
7. Preparation De La Mise En Vente
8. Analyse D'Offre Recue
9. Escalade Coach Humain Vendeur

## Notes de design

- reserver les tons sombres aux decisions structurantes
- faire de l'estimation un moment premium
- ne pas surcharger la partie documents
- visualiser l'urgence documentaire sans transformer l'ecran en tableau administratif
- garder le coach humain comme niveau d'accompagnement haut de gamme
