# CoachImmoIA · Backlog Front Ecran Par Ecran

## Objectif

Traduire le travail UX + Figma en backlog front concret, priorise et executable.

Chaque ecran est decrit avec :

- objectif produit
- niveau de priorite
- composants front a construire
- donnees attendues
- interactions
- definition de done

## Convention de priorisation

- `P0` : indispensable pour une demo produit credible
- `P1` : renforce fortement la valeur et la fluidite
- `P2` : confort, variantes, cas complementaires

## Lot P0 · Experience coeur

### 1. Accueil Acheteur

Priorite :
- `P0`

Objectif :
- donner le cap
- presenter la promesse
- ouvrir le parcours acheteur

Composants a construire :
- `TopBar`
- `HeroGreeting`
- `ModeSwitch`
- `ActionCard`
- `BottomNav`

Donnees :
- prenom utilisateur
- mode actif
- contenu hero
- cartes d'action

Interactions :
- changer de mode
- ouvrir `Projet`
- ouvrir `Biens`
- ouvrir `Assistant`

Definition de done :
- rendu fidele a la maquette
- responsive mobile propre
- changement de mode visible instantanement

### 2. Accueil Vendeur

Priorite :
- `P0`

Objectif :
- faire comprendre le parcours vendeur
- pousser vers estimation ou projet

Composants a construire :
- reutiliser `TopBar`
- reutiliser `HeroGreeting`
- reutiliser `ModeSwitch`
- variantes de `ActionCard`

Donnees :
- scenario vendeur
- CTA vendeur
- cartes `Vendre`, `Estimer`, `Coach humain`

Interactions :
- switch vendeur
- acces estimation
- acces projet vendeur

Definition de done :
- variante vendeur coherente visuellement
- pas de duplication de logique inutile avec l'accueil acheteur

### 3. Liste Des Biens

Priorite :
- `P0`

Objectif :
- prioriser des biens rapidement

Composants a construire :
- `FilterChips`
- `ListingCard`
- `BottomNav`

Donnees :
- liste de biens
- badges
- meta bien

Interactions :
- filtrer
- ouvrir detail bien
- lancer preparation visite

Definition de done :
- scroll fluide
- cartes lisibles
- hiérarchie visuelle claire entre badge, titre, prix et meta

### 4. Assistant IA

Priorite :
- `P0`

Objectif :
- offrir une vraie experience IA utile

Composants a construire :
- `AssistantContextCard`
- `MessageBubble`
- `PromptChip`
- `AssistantComposer`
- `ActionSummaryCard`

Donnees :
- contexte projet
- thread de conversation
- prompts predefinis
- etat loading / erreur

Interactions :
- envoyer message
- cliquer un prompt
- afficher loading
- afficher erreur

Definition de done :
- reponse claire dans l'UI
- etat loading visible
- etat erreur propre
- adaptation au parcours acheteur / vendeur

### 5. Projet Acheteur Overview

Priorite :
- `P0`

Objectif :
- rendre la feuille de route lisible

Composants a construire :
- `ProjectStatusHero`
- `TimelineStep`
- `ChecklistCard`
- `DocumentsCard`

Donnees :
- statut projet
- etapes
- checklist
- documents

Interactions :
- consulter progression
- ouvrir assistant depuis le projet
- ouvrir documents

Definition de done :
- timeline compréhensible d'un coup d'oeil
- cohérence statut `done / active / next`

### 6. Projet Vendeur Overview

Priorite :
- `P0`

Objectif :
- donner un dashboard vendeur simple

Composants a construire :
- `QuickStatsCard`
- `DocumentStatusList`
- `NextActionCard`

Donnees :
- prix vise
- docs manquants
- strategie

Interactions :
- aller vers documents
- aller vers estimation
- aller vers assistant

Definition de done :
- lisible sans effet tableau administratif
- stats vendeur bien différenciées

### 7. Estimation Vendeur

Priorite :
- `P0`

Objectif :
- rendre la valeur percue du produit tres forte

Composants a construire :
- `ValuationHero`
- `ComparableMiniCard`
- `ActionPanel`

Donnees :
- borne basse / haute
- comparables
- prochaines actions

Interactions :
- consulter estimation
- ouvrir comparables
- lancer une question IA

Definition de done :
- hero estimation premium
- lecture claire de la fourchette

## Lot P1 · Profondeur produit

### 8. Detail Bien

Priorite :
- `P1`

Objectif :
- transformer une annonce en decision preparee

Composants :
- `PropertyHero`
- `InsightCard`
- `QuestionBlock`

Donnees :
- detail bien
- points forts
- points a verifier
- questions de visite

Interactions :
- lancer preparation visite
- interroger l'assistant

Definition de done :
- bloc insights immédiatement compréhensible

### 9. Preparation De Visite

Priorite :
- `P1`

Objectif :
- accompagner l'utilisateur avant, pendant et apres visite

Composants :
- `ChecklistSection`
- `VisitNoteCard`
- `PromptActionCard`

Donnees :
- checklist
- questions
- notes eventuelles

Interactions :
- marquer vu / fait
- copier questions
- demander a l'IA

Definition de done :
- utilisable sur mobile en situation réelle

### 10. Documents Vendeur

Priorite :
- `P1`

Objectif :
- rendre la progression documentaire visible et actionnable

Composants :
- `DocumentStatusRow`
- `AlertCard`
- `QuickActionCard`

Donnees :
- documents disponibles
- documents manquants
- urgence

Interactions :
- changer de statut
- générer message syndic

Definition de done :
- statuts clairs
- pas d'ambiguite sur les actions possibles

### 11. Preparation D'Offre

Priorite :
- `P1`

Objectif :
- sécuriser un moment critique

Composants :
- `OfferPositionCard`
- `RiskChecklist`
- `DecisionRecommendationCard`

Donnees :
- prix bien
- marge probable
- points de risque

Interactions :
- voir alerte
- escalader au coach

Definition de done :
- l'utilisateur comprend si l'offre est prematuree ou non

### 12. Coach Humain

Priorite :
- `P1`

Objectif :
- rendre l'escalade premium, simple et naturelle

Composants :
- `CoachHero`
- `CoachBenefitList`
- `CoachRequestCard`

Donnees :
- raison d'escalade
- delai
- format d'accompagnement

Interactions :
- envoyer une demande
- continuer avec IA

Definition de done :
- valeur du coach perçue immédiatement

## Lot P2 · Etats et variantes

### 13. Empty Home

Priorite :
- `P2`

Objectif :
- onboarding doux sans friction

Composants :
- `EmptyStateHero`
- `StarterCTA`

### 14. Empty Listings

Priorite :
- `P2`

Objectif :
- expliquer pourquoi la liste est vide

Composants :
- `EmptyStateIllustration`
- `FilterActionRow`

### 15. Empty Assistant

Priorite :
- `P2`

Objectif :
- déclencher la première conversation

Composants :
- `PromptStarterCard`

### 16. Empty Project

Priorite :
- `P2`

Objectif :
- pousser a initialiser le projet

### 17. Offer Risk State

Priorite :
- `P2`

Objectif :
- exprimer une alerte produit forte mais sobre

### 18. Coach Request Sent

Priorite :
- `P2`

Objectif :
- confirmer la transmission et rassurer

### 19. Assistant Loading

Priorite :
- `P2`

Objectif :
- rendre l'attente acceptable

## Composants transverses a isoler

Ces composants doivent etre pensés comme briques réutilisables, pas comme blocs collés dans un seul écran.

- `TopBar`
- `BottomNav`
- `ModeSwitch`
- `ActionCard`
- `ListingCard`
- `MessageBubble`
- `TimelineStep`
- `DocumentStatusRow`
- `PromptChip`
- `PrimaryHeroCard`
- `CoachCTA`
- `EmptyStateCard`

## Donnees et contrat front

### Etat local suffisant pour le prototype

- `mode`
- `screen`
- `selectedProperty`
- `assistantThread`
- `projectStatus`
- `documentsStatus`

### Donnees futures a brancher

- profil utilisateur
- biens reels
- documents reels
- estimation dynamique
- demandes coach humain

## Roadmap de build recommandee

### Sprint 1

- `Accueil Acheteur`
- `Accueil Vendeur`
- `Liste Des Biens`
- `Assistant IA`

### Sprint 2

- `Projet Acheteur Overview`
- `Projet Vendeur Overview`
- `Estimation Vendeur`

### Sprint 3

- `Detail Bien`
- `Preparation De Visite`
- `Documents Vendeur`
- `Preparation D'Offre`
- `Coach Humain`

### Sprint 4

- `Etats vides`
- `Etats critiques`
- polish animation
- accessibilite

## Definition de done globale

Le lot front est considere comme propre si :

- l'UX Figma est reconnaissable dans le rendu
- les composants sont réutilisables
- les états loading / erreur / vide existent
- le mode acheteur / vendeur ne crée pas de logique confuse
- l'IA est integrée sans casser la clarté produit
