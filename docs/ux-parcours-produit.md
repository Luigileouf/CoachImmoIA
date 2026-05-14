# CoachImmoIA · Parcours UX Produit

## Objectif

CoachImmoIA est un copilote immobilier mobile-first qui aide un particulier a avancer dans son projet avec deux niveaux d'accompagnement :

- un guidage IA immediat, pedagogique et rassurant
- un relais humain sur les moments sensibles ou a forte consequence

Le produit doit toujours repondre a 3 questions :

- ou en est mon projet ?
- quelle est ma prochaine action utile ?
- quand faut-il demander l'aide d'un coach humain ?

## Positionnement UX

Le produit ne doit pas ressembler a un simple chatbot.
L'experience doit combiner :

- un tableau de bord personnel
- un copilote IA contextuel
- une feuille de route projet
- un espace de pieces et de documents
- un filet de securite humain

La promesse UX centrale :

> "Je ne suis pas seul face a mon projet immobilier. J'ai une trajectoire claire, des reponses utiles et un appui humain quand la decision devient engageante."

## Personas prioritaires

### 1. Acheteur anxieux mais avance

- a deja un budget ou une simulation
- visite plusieurs biens
- a peur d'oublier un point critique
- veut etre plus clair et plus rapide au moment de l'offre

### 2. Vendeur en phase de preparation

- ne sait pas par quoi commencer
- doit rassembler des documents
- veut cadrer son prix sans se tromper
- hesite entre vente directe et accompagnement professionnel

## Architecture produit cible

### 1. Accueil

Role :
- ecran d'ancrage
- resume de situation
- point d'entree vers l'action principale

Objectifs UX :
- rassurer en moins de 5 secondes
- faire comprendre le role du produit
- proposer 1 action prioritaire nette

Contenus :
- salutation personnalisee
- statut de projet
- switch Acheteur / Vendeur / Estimer
- cartes d'entree dans les parcours
- CTA principal

Actions principales :
- commencer un projet
- changer de parcours
- aller vers l'assistant ou le projet

### 2. Biens

Role :
- ecran de priorisation
- aide a la decision sur les biens ou comparables

Objectifs UX :
- transformer une liste passive en liste actionnable
- faire remonter les biens qui meritent du temps
- rendre visible les signaux de risque ou d'opportunite

Contenus :
- filtres contextuels
- cartes biens
- badge de priorite
- informations rapides : localisation, surface, prix, angle de vigilance

Actions principales :
- ouvrir un bien
- preparer une visite
- comparer plusieurs biens
- lancer une question a l'assistant sur un bien

### 3. Assistant IA

Role :
- copilote conversationnel
- outil d'aide contextuelle et de clarification

Objectifs UX :
- repondre vite
- proposer des reponses courtes et actionnables
- transformer une question en decision ou en prochaine etape

Contenus :
- resume de contexte
- fil de conversation
- prompts predefinis
- reponses structurees
- bloc "3 prochaines actions"

Actions principales :
- poser une question libre
- reutiliser un prompt
- basculer vers un coach humain
- generer un message ou une checklist

### 4. Projet

Role :
- colonne vertebrale du produit
- vue macro de l'avancement

Objectifs UX :
- rendre le projet lisible
- eviter la dispersion
- montrer la suite logique

Contenus :
- statut actuel
- etapes du projet
- documents a reunir
- alertes ou blocages
- moments ou un coach humain est recommande

Actions principales :
- marquer une etape comme faite
- ouvrir les documents requis
- envoyer une demande au coach
- ouvrir l'assistant depuis une etape precise

### 5. Profil

Role :
- reglage, confiance, relation

Objectifs UX :
- rassurer sur les donnees
- montrer les preferences de projet
- exposer clairement la limite entre IA et conseil reglemente

Contenus :
- identite utilisateur
- preferences projet
- notifications
- partage coach humain
- securite et confidentialite

Actions principales :
- modifier les preferences
- regler les notifications
- activer ou desactiver le partage
- reserver un appel

### 6. Estimation

Role :
- entree vendeur specialisee
- aide a cadrer la valeur avant mise en vente

Objectifs UX :
- donner une premiere fourchette credible
- contextualiser cette fourchette
- ouvrir sur les prochaines decisions vendeur

Contenus :
- fourchette estimee
- comparables
- facteurs de valorisation
- actions recommandees

Actions principales :
- demander une estimation plus fine
- preparer les documents vendeur
- demander un arbitrage humain

## Parcours clefs

### Parcours A · Acheteur

1. Arrivee sur Accueil
2. Selection du mode Acheteur
3. CTA "Demarrer mon projet acheteur"
4. Vue Projet avec feuille de route initiale
5. Aller sur Biens pour prioriser les visites
6. Aller sur Assistant IA pour preparer une visite ou une offre
7. Escalade coach humain avant offre ou compromis

Moment de valeur :
- quand l'utilisateur passe d'un stress diffus a une action concrete

Moment de relais humain :
- offre
- negociation
- compromis
- doute important sur un bien

### Parcours B · Vendeur

1. Arrivee sur Accueil
2. Selection du mode Vendeur
3. CTA "Demarrer mon projet vendeur"
4. Vue Projet avec documents a reunir
5. Vue Estimation pour cadrer le prix
6. Assistant IA pour generer email syndic ou checklist vendeur
7. Escalade coach humain sur strategie de vente ou arbitrage prix

Moment de valeur :
- quand l'utilisateur comprend l'ordre des priorites

Moment de relais humain :
- fixation du prix
- choix du canal de vente
- lecture d'offre

## Logique de navigation

### Bottom navigation

- `Accueil` : point d'ancrage et resume
- `Biens` : matiere du marche et priorisation
- `IA` : aide immediate
- `Projet` : feuille de route
- `Profil` : confiance, preferences, relation

### Raccourcis internes attendus

- depuis un bien : "demander a l'IA"
- depuis une etape projet : "que faire maintenant ?"
- depuis l'IA : "ajouter au projet"
- depuis le projet : "contacter un coach"

## Etats critiques a concevoir

Pour la prochaine passe hi-fi, il faudra prevoir ces etats, pas seulement les ecrans "happy path".

### Etat vide

- aucun projet cree
- aucun bien enregistre
- aucune conversation

### Etat en cours

- projet actif
- documents partiellement reunis
- assistant avec historique

### Etat bloque

- document manquant
- offre a risque
- manque de visibilite sur financement

### Etat rassurance

- message de securite
- recommandation de relais humain
- reformulation simple d'une decision complexe

## Regles d'experience

- Toujours afficher une prochaine action visible.
- Eviter les ecrans purement informatifs.
- Limiter chaque ecran a 1 objectif principal.
- Faire de l'assistant un accelerateur, pas une destination abstraite.
- Garder l'humain comme recours premium et strategique.

## Priorites pour la prochaine passe Figma

### Niveau 1

- finaliser les 6 ecrans principaux
- harmoniser la hierarchie visuelle
- poser un systeme de composants de base

### Niveau 2

- decliner les etats vides
- ajouter les ecrans de detail d'un bien
- ajouter un ecran de chat long
- ajouter un ecran detail projet

### Niveau 3

- prototyper les transitions
- preparer un mini flow testable a montrer au coach immobilier

## Proposition de lot de maquettes a produire ensuite

1. Accueil Acheteur
2. Accueil Vendeur
3. Biens liste
4. Bien detail
5. Assistant IA court
6. Assistant IA conversation longue
7. Projet overview
8. Projet detail etape
9. Profil
10. Estimation vendeur
11. Etat vide
12. Escalade coach humain
