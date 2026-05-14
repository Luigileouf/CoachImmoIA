# CoachImmoIA · Sitemap UX Final

## Vision d'ensemble

CoachImmoIA s'organise autour de 5 piliers persistants :

- `Accueil`
- `Biens`
- `Assistant IA`
- `Projet`
- `Profil`

Autour de cette navigation, le produit ouvre 2 grands parcours principaux et 2 parcours transverses :

- parcours `Acheteur`
- parcours `Vendeur`
- parcours transverse `Estimation`
- parcours transverse `Coach humain`

## Navigation principale

### Accueil

Role :
- point d'entree
- lecture rapide de la situation
- orientation vers l'action prioritaire

Sous-vues :
- `Accueil Acheteur`
- `Accueil Vendeur`
- `Accueil Estimation`

Sorties principales :
- vers `Projet`
- vers `Biens`
- vers `Assistant IA`

### Biens

Role :
- priorisation marche
- analyse des opportunites
- comparaison de biens ou comparables

Sous-vues Acheteur :
- `Liste des biens`
- `Detail bien`
- `Preparation de visite`
- `Comparaison de deux biens`

Sous-vues Vendeur :
- `Comparables marche`
- `Comparaison avec mon bien`

### Assistant IA

Role :
- aide contextuelle
- transformation d'une question en action

Sous-vues :
- `Assistant Acheteur`
- `Assistant Vendeur`
- `Assistant lie a un bien`
- `Assistant lie a une etape projet`
- `Assistant lie a une offre`

Sorties principales :
- vers `Projet`
- vers `Coach humain`
- vers generation de checklist, email ou plan d'action

### Projet

Role :
- colonne vertebrale du produit
- vue macro d'avancement

Sous-vues Acheteur :
- `Projet Acheteur Overview`
- `Detail etape`
- `Documents Acheteur`
- `Preparation d'offre`

Sous-vues Vendeur :
- `Projet Vendeur Overview`
- `Documents Vendeur`
- `Preparation de la mise en vente`
- `Analyse d'offre recue`

### Profil

Role :
- confiance
- preferences
- relation

Sous-vues :
- `Preferences projet`
- `Notifications`
- `Partage coach humain`
- `Securite et confidentialite`
- `Contact coach`

## Parcours principal Acheteur

### Niveau 1

- `Accueil Acheteur`
- `Onboarding Acheteur`
- `Projet Acheteur Overview`

### Niveau 2

- `Liste des biens`
- `Detail bien`
- `Preparation de visite`
- `Assistant Acheteur`

### Niveau 3

- `Comparaison de deux biens`
- `Preparation d'offre`
- `Escalade Coach Humain Acheteur`

## Parcours principal Vendeur

### Niveau 1

- `Accueil Vendeur`
- `Onboarding Vendeur`
- `Projet Vendeur Overview`

### Niveau 2

- `Estimation Vendeur`
- `Documents Vendeur`
- `Assistant Vendeur`

### Niveau 3

- `Comparables marche`
- `Preparation de la mise en vente`
- `Analyse d'offre recue`
- `Escalade Coach Humain Vendeur`

## Parcours transverse Estimation

Role :
- porte d'entree specialisee vendeur
- point de bascule entre information et decision

Ecrans :
- `Accueil Estimation`
- `Estimation Vendeur`
- `Comparables marche`
- `Actions recommandees`

Sorties :
- vers `Projet Vendeur`
- vers `Assistant Vendeur`
- vers `Coach humain`

## Parcours transverse Coach humain

Role :
- arbitrage premium
- securisation des decisions a consequence

Points d'entree :
- depuis `Projet`
- depuis `Assistant IA`
- depuis `Preparation d'offre`
- depuis `Analyse d'offre recue`
- depuis `Estimation`

Sous-vues :
- `Pourquoi consulter un coach`
- `Demande de retour coach`
- `Choix du format`
- `Confirmation de transmission`

## Etats de produit a prevoir

### Etats vides

- aucun projet
- aucun bien
- aucun document
- aucune conversation

### Etats actifs

- projet en cours
- plusieurs biens en cours d'analyse
- chat deja demarre
- documents partiellement completes

### Etats critiques

- document manquant
- offre risquee
- financement fragile
- prix mal cadre

### Etats premium

- estimation de valeur
- arbitrage strategique
- contact coach humain

## Sitemap par profondeur

### Niveau 0

- `Accueil`
- `Biens`
- `Assistant IA`
- `Projet`
- `Profil`

### Niveau 1

- `Accueil Acheteur`
- `Accueil Vendeur`
- `Accueil Estimation`
- `Projet Acheteur Overview`
- `Projet Vendeur Overview`
- `Assistant Acheteur`
- `Assistant Vendeur`
- `Documents Acheteur`
- `Documents Vendeur`
- `Estimation Vendeur`

### Niveau 2

- `Liste des biens`
- `Detail bien`
- `Preparation de visite`
- `Comparaison de deux biens`
- `Preparation d'offre`
- `Comparables marche`
- `Preparation de la mise en vente`
- `Analyse d'offre recue`
- `Escalade Coach Humain`

## Ordre de priorite produit

### Priorite 1

- `Accueil Acheteur`
- `Accueil Vendeur`
- `Projet Acheteur Overview`
- `Projet Vendeur Overview`
- `Assistant IA`
- `Estimation Vendeur`

### Priorite 2

- `Liste des biens`
- `Detail bien`
- `Documents Vendeur`
- `Preparation d'offre`
- `Preparation de la mise en vente`

### Priorite 3

- `Comparaison de deux biens`
- `Comparables marche`
- `Analyse d'offre recue`
- `Escalade Coach Humain`

## Lecture simple du produit

Si on devait resumer CoachImmoIA en une phrase de structure :

> `Accueil` donne le cap, `Projet` donne la trajectoire, `Biens` donne la matiere, `Assistant IA` donne l'aide immediate, et `Coach humain` securise les decisions engageantes.
