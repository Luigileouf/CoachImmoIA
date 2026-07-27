# CoachImmoIA - Plan d'action issu de l'audit UX/UI 2026

## 1. Objectif

Transformer CoachImmoIA d'une maquette haute fidélité partiellement connectée en un MVP fiable, compréhensible et testable sans accompagnement.

Le résultat attendu est le suivant :

> Un nouvel utilisateur choisit son objectif, crée un projet, comprend sa prochaine action et obtient une première valeur utile en moins de trois minutes, sans tutoriel et sans ambiguïté sur l'origine de ses données.

Ce plan traduit l'audit de la version publique testée le 27 juillet 2026 en lots de développement ordonnés. Les nouveaux ajouts fonctionnels non liés à ce plan sont suspendus jusqu'à la validation des lots P0 et P1.

## 2. Principes de réalisation

### Vérité de l'interface

- Toute donnée affichée provient de l'utilisateur, du système ou d'un jeu de démonstration explicitement identifié.
- Tout bouton visible produit un résultat observable ou est retiré.
- Tout statut affiché correspond à l'état réel du backend.
- Toute erreur propose une explication en français et une possibilité de reprise.
- Toute réponse IA distingue les faits sourcés, les incertitudes et les recommandations.

### Projet comme objet central

Le rôle Acheteur/Vendeur ne doit plus être un interrupteur global. Un utilisateur peut posséder plusieurs projets de types différents :

- achat ;
- vente ;
- estimation.

Chaque conversation, bien, document, demande au coach et action doit être rattaché à un projet.

### Démonstration séparée de l'espace personnel

Deux états doivent être distingués :

- `Démo` : données fictives clairement signalées, sans confusion avec un compte réel ;
- `Personnel` : données créées ou importées par l'utilisateur authentifié.

### Livraison par tranche verticale

Chaque lot doit couvrir, lorsque cela s'applique :

1. contrat de données ;
2. backend et persistance ;
3. interface ;
4. états vide, chargement, succès et erreur ;
5. accessibilité ;
6. tests ;
7. vérification en production.

## 3. Indicateur principal de réussite

Le scénario de référence est :

1. ouvrir l'application sans compte existant ;
2. comprendre la proposition de valeur ;
3. choisir Acheter, Vendre ou Estimer ;
4. renseigner les quatre informations essentielles ;
5. créer un projet ;
6. voir une feuille de route cohérente ;
7. accomplir la première action proposée.

La réussite est atteinte si cinq utilisateurs sur cinq terminent ce scénario sans guidage, et si le temps médian jusqu'à la première valeur utile est inférieur à trois minutes.

## 4. Ordre d'exécution

| Lot | Priorité | Finalité | Dépend de |
| --- | --- | --- | --- |
| 0 | P0 | Poser les règles de données et les états de référence | Aucun |
| 1 | P0 | Stabiliser IA, authentification et estimation | Lot 0 |
| 2 | P1 | Créer un vrai projet et une navigation persistante | Lots 0 et 1 |
| 3 | P1 | Restaurer confiance, cohérence et accessibilité | Lots 1 et 2 |
| 4 | P2 | Renforcer la valeur métier différenciante | Lots 1 à 3 |
| 5 | Validation | Tester avec des utilisateurs et un coach professionnel | Lots 0 à 4 |

Les lots sont séquentiels. Des tickets d'un même lot peuvent être menés en parallèle lorsque leurs dépendances sont indépendantes.

## 5. Lot 0 - Cadrage et vérité des données

### DATA-00 - Cartographier les données affichées

**Résultat utilisateur**

L'utilisateur sait immédiatement quelles données sont personnelles, calculées ou fictives.

**Actions**

- Inventorier les données statiques présentes dans `src/features/**/data`.
- Identifier leur futur propriétaire : utilisateur, projet, bien, document ou système.
- Marquer les données temporaires comme `demo`.
- Définir les états `empty`, `demo`, `loading`, `ready`, `error`.
- Interdire les valeurs personnelles fictives non signalées.

**Critères d'acceptation**

- Aucune donnée fictive n'est présentée comme une donnée utilisateur.
- Chaque écran possède un état vide exploitable.
- Un bandeau `Données de démonstration` est visible lorsque le mode démo est actif.
- Le rechargement ne transforme pas des données de démonstration en données personnelles.

**Preuves**

- Inventaire des données versionné dans la documentation.
- Captures des états vide et démo.
- Tests des sélecteurs d'état.

### DATA-01 - Définir le modèle projet

**Actions**

- Créer un identifiant stable par projet.
- Définir les types `buyer`, `seller` et `valuation`.
- Rattacher biens, documents, conversations et demandes coach à `project_id`.
- Définir le cycle de vie : brouillon, actif, en pause, terminé, archivé.

**Critères d'acceptation**

- Un utilisateur peut posséder simultanément un projet d'achat et un projet de vente.
- Aucun écran métier ne dépend d'un interrupteur Acheteur/Vendeur global.
- Les autorisations Supabase isolent les données par utilisateur et par projet.

## 6. Lot 1 - P0 bloquants

### IA-01 - Sécuriser les réponses Gemma

**Actions**

- Ne rendre que le contenu final du modèle.
- Filtrer toute instruction interne, plan de génération ou contenu intermédiaire.
- Ajouter une validation serveur de la forme de la réponse.
- Journaliser les réponses rejetées sans exposer de données sensibles.

**Critères d'acceptation**

- Aucun raisonnement interne ni consigne système n'est visible.
- La réponse finale est en français.
- Une sortie invalide produit une erreur récupérable et un bouton `Réessayer`.
- Les tests couvrent une réponse normale, vide, incomplète et contenant du contenu interne.

### IA-02 - Empêcher les réponses tronquées

**Actions**

- Détecter les réponses interrompues par limite de tokens ou erreur réseau.
- Ajuster les limites de génération au format attendu.
- Ajouter `Continuer` lorsque la réponse peut être complétée.
- Ajouter `Réessayer` en cas d'échec.
- Afficher un état de génération et permettre l'annulation.

**Critères d'acceptation**

- Chaque réponse se termine proprement ou porte le statut `Réponse incomplète`.
- Une réponse interrompue n'est jamais présentée comme finalisée.
- L'utilisateur peut continuer, réessayer ou annuler.

### IA-03 - Simplifier le choix du fournisseur

**Actions**

- Retirer le sélecteur Mistral/Gemma du parcours utilisateur standard.
- Sélectionner le fournisseur via la configuration serveur.
- Conserver le choix dans un mode de test interne.
- Prévoir un fournisseur de secours contrôlé.

**Critères d'acceptation**

- L'utilisateur final ne doit connaître aucun nom de modèle pour utiliser l'assistant.
- Le fournisseur actif reste observable dans les journaux techniques.
- Un changement de fournisseur ne modifie pas le contrat de réponse du frontend.

### AUTH-01 - Réparer l'authentification

**Actions**

- Vérifier les variables Supabase en local, Preview et Production.
- Vérifier les règles CORS, URL de redirection et domaines autorisés.
- Séparer connexion, inscription, déconnexion et récupération du mot de passe.
- Traduire les erreurs techniques en messages utiles.

**Critères d'acceptation**

- Inscription, connexion, déconnexion et récupération du mot de passe fonctionnent en production.
- `Failed to fetch` n'est jamais affiché à l'utilisateur.
- Une indisponibilité réseau propose `Réessayer`.
- Une session valide est restaurée après actualisation.

### AUTH-02 - Valider les formulaires

**Actions**

- Utiliser un champ de type `email`.
- Ajouter labels persistants et autocomplétion.
- Définir et afficher les règles du mot de passe.
- Valider au fil de la saisie et au serveur.
- Désactiver la soumission tant que le formulaire est invalide.

**Critères d'acceptation**

- `abc` n'est pas accepté comme adresse e-mail.
- Un mot de passe insuffisant n'active pas la soumission.
- Les messages d'erreur sont associés aux champs et annoncés aux technologies d'assistance.

### EST-01 - Décider et livrer le parcours Estimer

**Décision**

Si un calcul explicable ne peut pas être livré dans le lot, masquer l'entrée `Estimer` en production. Un simple changement d'onglet n'est pas acceptable.

**Parcours minimal**

- adresse ou micro-localisation ;
- type, surface et pièces ;
- étage, extérieur, stationnement et état ;
- DPE, charges et travaux ;
- fourchette basse, médiane et haute ;
- hypothèses, données manquantes et niveau de confiance ;
- recommandation de validation par un professionnel.

**Critères d'acceptation**

- Le parcours produit un résultat structuré à partir des données saisies.
- Aucun prix n'est affiché avant la saisie.
- La provenance et la date des références sont visibles.
- Le résultat est présenté comme une fourchette, jamais comme une certitude.

### Porte de sortie P0

Le lot 1 est terminé uniquement si :

- les tests IA ne révèlent ni contenu interne ni réponse faussement complète ;
- les scénarios d'authentification passent sur l'URL Vercel publique ;
- Estimer fonctionne de bout en bout ou n'est plus exposé ;
- aucune donnée de démonstration ne ressemble à une donnée personnelle réelle.

## 7. Lot 2 - P1 parcours principal

### PROJ-01 - Créer un projet par une action métier réelle

**Premier écran**

Présenter une seule question : `Que souhaitez-vous faire aujourd'hui ?`

- Acheter un bien.
- Vendre un bien.
- Estimer un bien.

**Saisie progressive**

- localisation ;
- type de bien ;
- budget ou prix envisagé ;
- échéance.

Chaque réponse est sauvegardée immédiatement dans un brouillon.

**Critères d'acceptation**

- La création affiche une confirmation explicite.
- Le projet nouvellement créé apparaît dans `Mes projets`.
- Le tableau de bord utilise uniquement les données saisies ou calculées à partir de celles-ci.
- Une interruption permet de reprendre le brouillon.
- Le bouton ne disparaît jamais sans confirmation.

### PROJ-02 - Construire le tableau de bord utile

Le tableau de bord doit répondre à :

- Où en suis-je ?
- Que dois-je faire maintenant ?
- Qui peut m'aider ?

**Contenu maximal**

- étape actuelle et prochaines étapes ;
- une action prioritaire ;
- deux indicateurs utiles ;
- trois points de vigilance au maximum ;
- documents manquants, à vérifier ou prêts ;
- accès adapté à l'assistant ou au coach.

**Critères d'acceptation**

- Aucun faux pourcentage de progression.
- Une seule action est visuellement principale.
- Tous les indicateurs sont explicables depuis les données du projet.

### NAV-01 - Ajouter un routage stable

**Routes minimales**

- `/`
- `/projects`
- `/projects/:projectId`
- `/projects/:projectId/properties`
- `/projects/:projectId/documents`
- `/projects/:projectId/assistant`
- `/community`
- `/coach`
- `/account`

**Critères d'acceptation**

- Chaque écran possède une URL partageable.
- Retour et Suivant du navigateur fonctionnent.
- Une actualisation conserve le projet et l'écran.
- Une route inaccessible affiche un état explicite.
- Le contrôle d'accès empêche l'ouverture d'un projet appartenant à un autre utilisateur.

### NOTIF-01 - Brancher ou retirer les notifications

**Critères d'acceptation**

- Le bouton ouvre une liste réelle avec états vide, non lu et lu, ou il est absent.
- Le nombre affiché correspond au nombre réel de notifications non lues.

## 8. Lot 3 - P1 confiance, cohérence et accessibilité

### DOC-01 - Simplifier l'espace Documents

**Vocabulaire utilisateur**

| Technique | Produit |
| --- | --- |
| RAG ready | Prêt à être utilisé par l'assistant |
| RAG indexed | Disponible pour l'assistant |
| RAG status | Utilisation par l'assistant |
| Chunks | Passages analysés |
| Retirer du contexte IA | Ne plus utiliser dans les réponses |
| Choose File | Choisir un fichier |

**Actions**

- Séparer disponibles, manquants et nécessitant une action.
- Afficher propriétaire, date, confidentialité et usage par l'IA.
- Ajouter prévisualisation, remplacement, téléchargement et suppression.
- Unifier les états : en attente, analysé, erreur, action requise.
- Supprimer l'action d'indexation lorsque le document est déjà analysé.

**Critères d'acceptation**

- Aucun jargon RAG n'est visible en parcours standard.
- L'état affiché correspond au traitement backend.
- L'utilisateur sait quels documents ont été utilisés dans une réponse IA.
- Les actions sensibles demandent confirmation et produisent un retour visible.

### A11Y-01 - Corriger les interactions

**Actions**

- Ajouter `aria-current` à la navigation active.
- Utiliser `tablist`, `tab` et `aria-selected` uniquement pour de vrais onglets.
- Supprimer les boutons imbriqués.
- Assurer une hiérarchie H1, H2 et H3 cohérente.
- Ajouter labels persistants et focus visible.
- Annoncer chargements, confirmations et erreurs via `aria-live`.
- Piéger correctement le focus dans les modales puis le restituer.

**Critères d'acceptation**

- Les parcours principaux sont réalisables au clavier.
- Aucun composant interactif ne contient un autre bouton.
- Le focus reste visible et suit un ordre logique.
- Les changements asynchrones importants sont annoncés.

### MOB-01 - Compléter le parcours mobile

**Critères d'acceptation**

- Projets, Biens, Documents, Assistant, Communauté et Compte restent accessibles.
- Une fonction principale est accessible en deux actions maximum.
- Aucun contenu critique n'est tronqué à 320 px de largeur.
- Les zones tactiles respectent une taille minimale confortable.

### EDIT-01 - Harmoniser les textes

**Actions**

- Éliminer les mélanges français/anglais.
- Corriger accents, accords et unités.
- Utiliser `€/m²`, `Responsable`, `Échéance`, `Activité`.
- Remplacer les erreurs techniques par des messages orientés reprise.
- Uniformiser `Accueil` ou `Tableau de bord`.

**Critères d'acceptation**

- Aucun libellé technique ou anglais non justifié n'est visible.
- Les pluriels et unités sont générés correctement.
- Une relecture éditoriale couvre tous les états, y compris les erreurs.

### COACH-01 - Fiabiliser le relais humain

**Actions**

- Afficher projet, bien, écran et documents transmis.
- Permettre de retirer des éléments du contexte.
- Proposer des délais concrets : sans urgence, sous 48 h, aujourd'hui.
- Afficher canal et délai moyen.
- Confirmer l'envoi et montrer son statut.

**Critères d'acceptation**

- Aucun contexte n'est transmis sans consentement explicite.
- La demande apparaît dans un historique.
- L'utilisateur connaît son statut, le canal et le délai attendu.

### Porte de sortie P1

Le produit peut passer au pilote lorsque :

- la première création de projet fonctionne sans guidage ;
- navigation, actualisation et liens directs conservent le contexte ;
- les documents et statuts sont compréhensibles sans jargon ;
- les parcours principaux sont utilisables au clavier et sur mobile ;
- toute action importante affiche chargement, succès ou erreur.

## 9. Lot 4 - P2 différenciation

### BIEN-01 - Ajouter ou importer un bien

- Saisie manuelle minimale.
- Import d'une URL d'annonce lorsque cela est légalement et techniquement possible.
- Affichage de la provenance des données extraites.
- Modification et validation manuelle avant sauvegarde.

### IA-04 - Transformer une réponse en action

- Créer une check-list.
- Ajouter une tâche au projet.
- Enregistrer une note liée à un bien.
- Préparer une question au coach.

### COMM-01 - Décomposer la communauté

- Découverte des groupes.
- Vue d'un groupe.
- Création d'une publication avec aperçu des données partagées.
- Fil de discussion, synthèse et réponses vérifiées.

Tous les compteurs, badges et validations doivent provenir de données réelles ou porter la mention `Démonstration`.

### ANALYTICS-01 - Instrumenter les parcours

Événements minimaux :

- objectif sélectionné ;
- création commencée, reprise, abandonnée et terminée ;
- projet créé ;
- erreur d'authentification ;
- question IA envoyée, interrompue, continuée ou relancée ;
- document envoyé, analysé ou en erreur ;
- demande coach créée ;
- première valeur utile atteinte.

Les événements ne doivent contenir aucun document, message libre ou donnée personnelle sensible.

## 10. Lot 5 - Validation avant exposition

### Matrice de tests

| Scénario | Condition de réussite |
| --- | --- |
| Première visite | 5 utilisateurs créent un projet sans guidage |
| Acheteur | Ajout d'un bien, check-list, comparaison et préparation d'offre sans impasse |
| Vendeur | Description, documents, estimation et stratégie sans donnée inventée |
| Estimation | Fourchette explicable, hypothèses et niveau de confiance visibles |
| IA | Réponses complètes, sourcées, sans contenu interne |
| Authentification | Inscription, connexion, erreur, déconnexion et récupération fonctionnent |
| Navigation | Retour, actualisation, lien direct et multi-projets conservent le contexte |
| Mobile | Parcours complet sans fonction principale inaccessible |
| Clavier | Ordre logique, focus visible et modales maîtrisées |
| Documents | PDF textuel, scan, mauvais format et fichier lourd produisent un état clair |

### Pilote avec le coach immobilier

Le pilote professionnel doit évaluer :

- conformité du parcours avec la pratique réelle ;
- pertinence des étapes acheteur et vendeur ;
- qualité et prudence des conseils IA ;
- moments nécessitant un relais humain ;
- informations indispensables manquantes ;
- valeur perçue par rapport aux outils actuels du coach.

Le pilote n'est ouvert qu'après validation des portes P0 et P1.

## 11. Définition de terminé pour chaque ticket

Un ticket n'est terminé que si :

- le comportement est relié à une donnée réelle ou explicitement de démonstration ;
- les états vide, chargement, succès et erreur sont traités ;
- le contrôle d'accès est vérifié lorsque des données personnelles sont concernées ;
- le clavier et le mobile ont été testés ;
- un test automatisé couvre la logique critique ;
- le build de production passe ;
- le comportement est vérifié sur une Preview Vercel ;
- le critère d'acceptation possède une preuve.

## 12. Indicateurs de pilotage

- Taux de création de projet depuis le premier écran.
- Temps médian jusqu'à la première valeur utile.
- Taux d'abandon par étape et type de projet.
- Taux de réussite de l'authentification.
- Taux de réponses IA interrompues ou relancées.
- Part des réponses IA utilisant une source identifiable.
- Taux de documents correctement analysés.
- Part des demandes transférées au coach.
- Délai moyen de réponse du coach.
- Satisfaction après visite, estimation ou préparation d'offre.

## 13. Prochaine séquence de développement

1. Réaliser `DATA-00` et `DATA-01`.
2. Corriger `IA-01`, `IA-02`, `AUTH-01` et `AUTH-02`.
3. Décider immédiatement si `EST-01` est livré ou masqué.
4. Exécuter la porte de validation P0 en production.
5. Construire `PROJ-01`, `PROJ-02` et `NAV-01`.
6. Simplifier Documents et corriger accessibilité, mobile et textes.
7. Exécuter la porte de validation P1.
8. Organiser le test avec le coach immobilier.
9. N'engager les optimisations P2 qu'à partir des retours du pilote.
