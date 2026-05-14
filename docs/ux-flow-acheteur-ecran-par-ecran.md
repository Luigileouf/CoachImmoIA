# CoachImmoIA · Flow Acheteur Ecran Par Ecran

## Objectif du flow

Le flow `Acheteur` doit accompagner un particulier depuis l'intention jusqu'a la preparation de l'offre, sans le noyer dans de l'information.

Le fil conducteur UX :

1. comprendre sa situation
2. prioriser les bons biens
3. preparer les bonnes questions
4. securiser l'offre
5. demander de l'aide humaine au bon moment

## Ton UX attendu

- rassurant
- concret
- sobre mais premium
- jamais trop technique
- toujours oriente vers la prochaine action

## Ecran 1 · Accueil Acheteur

### Role

Donner une vue immediate de la situation et orienter vers l'action la plus utile.

### Contenu

- salutation personnalisee
- promesse produit
- switch `Acheteur / Vendeur / Estimer`
- 3 cartes d'entree :
  - `Acheter`
  - `Vendre`
  - `Estimer`
- resume projet acheteur
- CTA principal

### Message principal

`Vous avez un projet acheteur. On vous aide a avancer avec clarte, rythme et methode.`

### CTA principal

`Demarrer mon projet acheteur`

### CTA secondaires

- `Voir mes biens`
- `Parler a l'assistant`

### Elements de reassurance

- mention budget cadre
- mention feuille de route claire
- mention coach humain disponible avant offre

### Transition principale

Si l'utilisateur n'a pas encore de projet :
- va vers onboarding projet acheteur

Si l'utilisateur a deja un projet :
- va vers `Projet acheteur`

## Ecran 2 · Onboarding Projet Acheteur

### Role

Recueillir juste assez d'information pour personnaliser le parcours, sans faire un formulaire lourd.

### Structure en 4 blocs

1. `Budget`
2. `Zone recherchee`
3. `Type de bien`
4. `Calendrier`

### Champs / choix

- budget cible
- budget max
- ville / quartier
- type : appartement / maison / investissement
- surface cible
- nombre de pieces
- horizon : immediat / 3 mois / 6 mois+

### CTA principal

`Construire ma feuille de route`

### CTA secondaire

`Passer cette etape`

### Sortie attendue

Creation d'un projet acheteur avec :
- resume de contexte
- premieres etapes
- priorites par defaut

## Ecran 3 · Projet Acheteur Overview

### Role

Montrer ou en est le projet et quelle est la prochaine marche.

### Contenu

- statut projet
- timeline d'avancement
- 3 indicateurs clefs
  - budget valide
  - nombre de visites prioritaires
  - niveau de preparation de l'offre
- checklist actuelle
- documents manquants

### Sections

#### Bloc 1

`Votre projet aujourd'hui`

Exemple :
- `Recherche active`
- `Budget valide`
- `4 visites retenues`

#### Bloc 2

`Feuille de route`

Etapes :
- budget et financement
- selection des biens
- visites
- analyse
- offre
- compromis

#### Bloc 3

`Documents a preparer`

- piece d'identite
- simulation bancaire
- plan de financement
- notes de visite

### CTA principal

`Voir les biens prioritaires`

### CTA secondaires

- `Demander quoi faire maintenant`
- `Preparer ma prochaine visite`

## Ecran 4 · Liste Des Biens

### Role

Aider a arbitrer entre plusieurs biens sans se perdre.

### Contenu

- filtres
- liste de biens
- badges :
  - `Visite prioritaire`
  - `A challenger`
  - `Bon ratio`
- resume rapide par carte

### Structure d'une carte bien

- image / visuel scene
- titre bien
- localisation
- prix
- surface / pieces
- badge priorite
- note de vigilance

### CTA par carte

- `Voir le detail`
- `Preparer la visite`
- `Poser une question a l'IA`

### Filtres prioritaires

- secteur
- budget
- surface
- type de bien
- niveau d'urgence

### Transition principale

Clic sur une carte :
- va vers `Detail Bien`

## Ecran 5 · Detail Bien

### Role

Transformer une annonce en decision preparee.

### Contenu

- hero bien
- resume cle
- points forts
- points a verifier
- questions a poser en visite
- positionnement du bien par rapport au projet

### Sections

#### Bloc 1

`Ce bien vaut-il une vraie attention ?`

Resume direct :
- bon alignement budget
- surface correcte
- alerte DPE ou copro

#### Bloc 2

`Questions a poser`

Exemples :
- travaux votes ?
- montant des charges ?
- humidite / bruit / vis-a-vis ?
- historique de vente ?

#### Bloc 3

`Signaux de risque`

- DPE faible
- travaux a chiffrer
- copropriete tendue
- prix trop haut pour le secteur

### CTA principal

`Preparer ma visite`

### CTA secondaires

- `Comparer avec un autre bien`
- `Demander une analyse a l'IA`

## Ecran 6 · Preparation De Visite

### Role

Faire partir l'utilisateur en visite avec une grille claire.

### Contenu

- checklist avant visite
- questions indispensables
- zone de notes
- bloc `points a observer`

### Sections

#### Avant la visite

- verifier le dossier annonce
- confirmer l'adresse exacte
- preparer les questions

#### Pendant la visite

- environnement
- luminosite
- circulation
- bruit
- etat general
- parties communes

#### Apres la visite

- noter a chaud
- identifier les red flags
- decider : on continue / on ecarte / on challenge

### CTA principal

`Generer mes questions de visite`

### CTA secondaires

- `Ajouter mes notes`
- `Demander quoi verifier`

## Ecran 7 · Assistant IA Acheteur

### Role

Apporter une aide immediate sans casser le contexte projet.

### Comportement attendu

L'assistant ne doit pas repondre comme un LLM generique.
Il doit toujours :

- rappeler le contexte du projet
- structurer sa reponse
- finir par actions concretes

### Modules visibles

- resume de contexte
- prompts rapides
- conversation
- bloc `3 prochaines actions`

### Prompts de depart

- `Quelles questions poser pendant la visite ?`
- `Comment negocier sans fragiliser mon dossier ?`
- `Quels documents donner a ma banque ?`

### Cas d'usage prioritaires

- visite
- analyse d'un bien
- offre
- financement
- arbitrage entre 2 options

### CTA principal

`Envoyer ma question`

### CTA secondaires

- `Ajouter au projet`
- `Transmettre au coach`

## Ecran 8 · Comparaison De Deux Biens

### Role

Faire sortir une decision lisible entre 2 options reelles.

### Contenu

- bien A
- bien B
- grille de comparaison
- verdict aide par l'IA

### Axes de comparaison

- prix
- localisation
- surface
- travaux
- DPE
- qualite copropriete
- revente potentielle
- adequation au projet

### Sortie attendue

Un message simple du type :

`Le bien A est plus solide si vous cherchez un achat plus securise. Le bien B peut etre interessant seulement si la nego absorbe le risque travaux.`

### CTA principal

`Choisir mon bien prioritaire`

## Ecran 9 · Preparation D'Offre

### Role

Aider l'utilisateur a ne pas improviser au moment le plus engageant.

### Contenu

- recap du bien
- prix affiche
- fourchette de nego
- niveau de preparation du dossier
- pieces manquantes
- recommandations IA

### Sections

#### Bloc 1

`Votre position`

- prix du bien
- niveau de tension du marche
- marge de nego probable

#### Bloc 2

`Votre dossier`

- financement pret
- justificatifs reunis
- rapidite d'execution

#### Bloc 3

`Alerte avant offre`

- si dossier trop faible
- si bien mal analyse
- si travaux non chiffres

### CTA principal

`Preparer mon offre`

### CTA critique

`Demander l'avis d'un coach humain`

## Ecran 10 · Escalade Coach Humain

### Role

Faire sentir que demander de l'aide n'est pas un echec, mais un levier premium.

### Declencheurs

- avant offre
- doute sur un bien
- negociation sensible
- financement fragile

### Contenu

- pourquoi l'accompagnement humain est recommande
- ce que le coach peut arbitrer
- temps estime de prise en charge
- format : appel / message / relecture

### CTA principal

`Demander un retour coach`

### CTA secondaire

`Continuer avec l'IA`

## Micro-interactions a prevoir dans Figma

- activation douce du switch Acheteur / Vendeur
- badge prioritaire visible sans agresser
- progression d'etape simple et tres lisible
- CTA principal toujours dominant
- messages IA avec difference visuelle claire entre user / assistant

## Hierarchie de priorite pour la maquette hi-fi

### Lot 1

1. Accueil Acheteur
2. Projet Acheteur Overview
3. Liste Des Biens
4. Detail Bien
5. Assistant IA

### Lot 2

6. Preparation De Visite
7. Comparaison De Deux Biens
8. Preparation D'Offre
9. Escalade Coach Humain

## Notes de design

- ne pas surcharger les cartes de biens
- garder les textes IA courts
- laisser respirer les blocs premium
- utiliser la couleur menthe pour l'assistance, pas pour tout
- reserver les contrastes forts aux decisions importantes
