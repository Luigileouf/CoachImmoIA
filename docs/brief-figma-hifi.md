# CoachImmoIA · Brief Figma Hi-Fi

## Objectif

Transformer les parcours UX deja definis en maquettes haute fidelite coherentes, premium et directement presentables a un coach immobilier pour discussion produit.

Le rendu attendu n'est pas un simple habillage.
Il doit rendre visibles :

- la clarte du parcours
- la valeur de l'assistant IA
- la logique d'accompagnement humain
- la priorisation des decisions

## Intention generale

CoachImmoIA doit se situer entre :

- un produit grand public premium
- un copilote immobilier rassurant
- un service hybride IA + humain

L'interface doit donner la sensation suivante :

> "Mon projet est enfin lisible, guide et moins stressant."

## Direction artistique

### Ambiance

- chaude
- douce
- premium
- rassurante
- mobile-first

### Palette

- fond sable / creme
- accent menthe pour l'IA et les validations
- encre profonde pour les decisions fortes
- tons peche / sauge pour les surfaces secondaires

### Typographie

- serif editorial pour les grands titres
- sans-serif nette pour l'UI, les cartes et les donnees

### Formes

- coins tres arrondis
- cartes larges et respirantes
- fonds avec halos doux et profondeur legere

## Regles de composition

- 1 intention principale par ecran
- 1 CTA dominant maximum
- peu de texte visible en premier niveau
- donner du rythme par alternance de blocs clairs et blocs sombres
- ne jamais faire ressembler l'app a un back-office

## Composants a poser en premier

### Fondations

- frame mobile device
- top bar
- bottom navigation
- chips de mode
- carte action
- carte document
- carte bien
- carte estimation
- bulle IA
- timeline projet
- bloc CTA coach humain

### Tokens a stabiliser

- couleurs principales
- couleurs de statuts
- rayons de coins
- espacements
- styles de texte

## Ecrans a produire en Priorite 1

### 1. Accueil Acheteur

Objectif :
- vendre la promesse produit en 5 secondes

Doit montrer :
- salutation
- titre hero
- switch de parcours
- 3 cartes principales
- resume projet
- CTA fort

Point de design critique :
- il faut que l'ecran paraisse premium sans paraitre decoratif

### 2. Accueil Vendeur

Objectif :
- faire comprendre qu'on structure une vente, pas qu'on affiche un simple estimateur

Doit montrer :
- entree vendeur
- feuille de route
- documents critiques
- point d'entree estimation

Point de design critique :
- plus ordonne que l'accueil acheteur, un peu plus strategique

### 3. Projet Acheteur Overview

Objectif :
- faire sentir l'avancement du projet

Doit montrer :
- statut
- timeline
- checklist
- documents
- prochaine action

Point de design critique :
- la timeline doit etre ultra lisible, pas decorative

### 4. Projet Vendeur Overview

Objectif :
- rendre visible la preparation de la vente

Doit montrer :
- niveau de readiness
- documents manquants
- prix a cadrer
- strategie a arbitrer

Point de design critique :
- eviter l'effet tableur ou dossier administratif

### 5. Assistant IA

Objectif :
- montrer l'intelligence utile du produit

Doit montrer :
- contexte projet
- conversation
- prompts
- sortie actionnable

Point de design critique :
- ne pas faire une interface de chat generique

### 6. Estimation Vendeur

Objectif :
- faire vivre un moment premium et credible

Doit montrer :
- fourchette de valeur
- logique de calcul
- comparables
- actions suivantes

Point de design critique :
- la valeur percue de cet ecran doit etre haute

## Ecrans a produire en Priorite 2

### Acheteur

- `Liste des biens`
- `Detail bien`
- `Preparation de visite`
- `Comparaison de deux biens`
- `Preparation d'offre`

### Vendeur

- `Documents Vendeur`
- `Comparables marche`
- `Preparation de la mise en vente`
- `Analyse d'offre recue`

## Ecrans a produire en Priorite 3

- `Etat vide sans projet`
- `Etat vide sans bien`
- `Etat vide sans document`
- `Escalade Coach Humain Acheteur`
- `Escalade Coach Humain Vendeur`
- `Confirmation transmission coach`

## Consignes ecran par ecran

### Pour chaque ecran, verifier

- quel est l'objectif principal ?
- quelle action doit etre la plus evidente ?
- quelle information peut etre retiree sans perdre la comprehension ?
- ou apparait la proposition de valeur IA ?
- ou apparait l'option humaine ?

## Comportement visuel attendu par type d'ecran

### Ecrans d'ancrage

Exemples :
- Accueil
- Projet Overview

Traitement :
- hero fort
- contenu rassurant
- CTA tres net

### Ecrans de decision

Exemples :
- Detail bien
- Preparation d'offre
- Analyse d'offre recue

Traitement :
- contraste plus fort
- sections bien segmentees
- alertes sobres mais visibles

### Ecrans de service

Exemples :
- Assistant IA
- Documents
- Preparation de visite

Traitement :
- tres lisibles
- peu d'effets
- utilite immediate

### Ecrans premium

Exemples :
- Estimation
- Coach humain

Traitement :
- plus editoriaux
- plus respire
- plus de profondeur visuelle

## Prototype Figma a prevoir ensuite

### Mini flow Acheteur

1. Accueil Acheteur
2. Projet Acheteur
3. Liste des biens
4. Detail bien
5. Assistant IA
6. Preparation d'offre
7. Escalade coach humain

### Mini flow Vendeur

1. Accueil Vendeur
2. Projet Vendeur
3. Estimation
4. Documents
5. Assistant IA
6. Analyse d'offre
7. Escalade coach humain

## Definition de done pour la passe hi-fi

La passe est reussie si :

- les 6 ecrans priorite 1 existent
- ils partagent la meme grammaire visuelle
- la navigation semble credible
- la valeur IA est lisible
- le relais humain est percu comme premium
- un coach immobilier peut regarder le fichier et comprendre le produit sans explication orale

## Ordre de production recommande dans Figma

1. poser les styles et composants
2. maquetter `Accueil Acheteur`
3. deriver `Accueil Vendeur`
4. maquetter `Projet Acheteur`
5. deriver `Projet Vendeur`
6. maquetter `Assistant IA`
7. maquetter `Estimation Vendeur`
8. maquetter `Liste des biens`
9. maquetter `Detail bien`
10. maquetter `Documents Vendeur`

## Ce qu'il faut absolument eviter

- trop de blocs egaux sans hierarchie
- une interface trop froide ou trop corporate
- un chat visuellement banal
- une estimation qui ressemble a une carte KPI quelconque
- un ecran projet qui ressemble a Trello ou Notion
