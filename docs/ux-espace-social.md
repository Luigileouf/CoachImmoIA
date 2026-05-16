# Espace social CoachImmoIA

## Role produit

L'espace social n'est pas un reseau social grand public. C'est une surface de confiance qui permet aux acheteurs et aux vendeurs d'echanger autour de situations concretes, de debloquer des questions recurrentes et de se rassurer a des moments critiques du parcours.

Le module social complete trois briques existantes :
- `Assistant IA` pour formuler et structurer une question
- `Projet` pour remettre l'echange dans le contexte du dossier
- `Coach humain` pour escalader si l'echange communautaire ne suffit pas

## Promesse

- poser une question a des pairs qui vivent la meme etape
- consulter des retours d'experience utiles sans bruit inutile
- partager des conseils actionnables sur visite, financement, prix, pieces et negociations
- rester dans un cadre securise, modere et aligne avec le projet immobilier

## Positionnement UX

Le module doit ressembler a une communaute experte et rassurante, pas a un feed addictif.

Principes :
- priorite a l'utilite sur la viralite
- contenu classe par etape projet et par type de profil
- anonymat partiel par defaut
- moderation visible
- liens directs vers `Assistant IA`, `Projet` et `Coach`

## Piliers fonctionnels

### 1. Hub communaute

Vue d'ensemble avec :
- resume de la communaute selon le mode `Acheteur` ou `Vendeur`
- sujets chauds de la semaine
- groupes thematiques
- indicateurs de confiance
- acces rapide pour poser une question

### 2. Cercles thematiques

Cercles proposes :
- `Premiere acquisition`
- `Offre et negociation`
- `Financement`
- `Visites et copropriete`
- `Preparation du dossier vendeur`
- `Prix et strategie de vente`
- `Offres recues`

Chaque cercle affiche :
- nombre de membres actifs
- niveau de moderation
- themes dominants
- dernier signal utile

### 3. Fils de discussion

Chaque fil contient :
- auteur anonymise ou semi-identifie
- statut du projet
- tags d'etape
- question principale
- reponses de pairs
- synthese IA
- bouton `Escalader au coach`

### 4. Signaux de confiance

Chaque reponse peut afficher :
- `Pair verifie`
- `Coach valide`
- `Retour vecu`
- `Synthese IA`

Objectif :
- aider l'utilisateur a comprendre la nature de la source
- eviter la confusion entre avis personnel, conseil structure et accompagnement expert

## Regles de confiance

- identite publique reduite par defaut a un prenom ou pseudo
- ville et budget jamais exposes brut sans consentement
- moderation sur les sujets sensibles : prix, offres, diagnostics, financement
- signalement simple
- escalade coach rapide si risque juridique, financier ou strategique

## Parcours clefs

### Acheteur

1. Depuis `Projet`, l'utilisateur bloque sur une visite ou une offre
2. Il ouvre `Communaute`
3. Il filtre sur un cercle adapte
4. Il lit des retours similaires
5. Il poste sa question
6. Il ajoute la synthese a son projet ou escalade au coach

### Vendeur

1. Depuis `Documents` ou `Projet`, l'utilisateur doute sur ses pieces ou son prix
2. Il ouvre `Communaute`
3. Il consulte un fil `Prix et strategie` ou `Dossier vendeur`
4. Il recupere des points d'attention
5. Il transmet les elements utiles au coach ou a l'assistant

## Ecrans a maquetter

- `Social Hub`
- `Circle Detail`
- `Conversation Thread`

## Integrations prevues

- CTA vers `Assistant IA`
- CTA vers `Projet`
- CTA vers `Documents`
- CTA vers `Coach humain`
- future utilisation RAG pour resumer des fils ou suggerer des discussions proches
