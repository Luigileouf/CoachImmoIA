# Inventaire des données CoachImmoIA

Dernière mise à jour : 27 juillet 2026.

## Règles de présentation

- Une donnée issue de Supabase est une donnée utilisateur uniquement après authentification et contrôle de propriété.
- Une donnée statique utilisée pour présenter le produit est toujours associée au mode `demo`.
- Une donnée calculée doit conserver la référence des données source qui permettent de l'expliquer.
- Aucune identité, adresse, capacité financière ou progression fictive ne doit être présentée comme réelle.
- Les états de référence sont `empty`, `demo`, `loading`, `ready` et `error`.

## Sources par domaine

| Domaine | Source actuelle | Propriétaire cible | État sans donnée réelle | Évolution attendue |
| --- | --- | --- | --- | --- |
| Projets | Supabase `projects` et `project_steps`, avec repli de démonstration | Utilisateur et projet | `demo` ou `empty` | Supprimer le repli démo après généralisation des états vides |
| Documents | Supabase `documents`, `document_chunks` et Storage, avec jeu statique | Utilisateur et projet | `demo` ou `empty` | Contrôler systématiquement l'utilisateur et le `project_id` |
| Assistant IA | Mistral ou Gemma, contexte RAG issu des documents | Projet et conversation | `empty` si aucune source | Persister les conversations par projet |
| Biens | `src/features/listings/data/listings.ts` | Projet et bien | `demo` | Créer les tables de biens et de favoris |
| Tableau de bord | Scénarios et étapes statiques, complétés par le dernier projet | Projet | `demo` | Calculer les cartes depuis le projet actif |
| Communauté | Supabase `social_circles` et `social_threads`, avec données statiques | Utilisateur, cercle et projet | `demo` ou `empty` | Ajouter auteur authentifié, modération et rattachement projet |
| Profil | `src/features/profile/data/profile.ts` et session Supabase | Utilisateur | `demo` pour les champs métier | Persister les préférences et retirer les valeurs fictives |
| Coach humain | Contenus d'interface et table `coach_requests` | Utilisateur et projet | `empty` | Brancher la création et le suivi d'une demande |

## Données statiques à considérer comme démonstration

- `src/features/core/data/scenarios.ts`
- `src/features/home/data/action-cards.ts`
- `src/features/listings/data/listings.ts`
- `src/features/assistant/data/conversations.ts`
- `src/features/projects/data/steps.ts`
- `src/features/platform/data/workspace.ts`
- `src/features/social/data/social.ts`
- `src/features/profile/data/profile.ts`

Ces fichiers décrivent la proposition de valeur et les états visuels. Ils ne constituent pas un dossier client.

## Propriété et cloisonnement

| Objet | Clé propriétaire | Clé de contexte |
| --- | --- | --- |
| Projet | `projects.owner_id` | `projects.id` |
| Étape | Propriétaire du projet parent | `project_steps.project_id` |
| Document | Propriétaire du projet parent | `documents.project_id` |
| Extrait RAG | Propriétaire du document parent | `document_chunks.document_id` |
| Conversation | À créer : propriétaire du projet parent | À créer : `conversations.project_id` |
| Bien | À créer : propriétaire du projet parent | À créer : `properties.project_id` |
| Demande coach | `coach_requests.user_id` | `coach_requests.project_id` |

Le backend utilisant une clé `service_role`, chaque lecture et écriture doit vérifier le jeton Supabase puis filtrer explicitement sur l'utilisateur propriétaire. La clé `service_role` ne doit jamais être exposée au navigateur.

## État d'implémentation

- Le mode démonstration est signalé dans l'interface.
- La création de projet exige désormais localisation, type de bien, budget ou prix et échéance.
- L'API Projet authentifie la requête et filtre les projets par `owner_id`.
- La migration multi-types et saisie projet est prête dans `supabase/migrations/20260727195500_expand_project_types_and_intake.sql`.
- L'application distante de cette migration reste à vérifier après réactivation du projet Supabase.
- Les API Documents, RAG et Communauté doivent encore recevoir le même contrôle propriétaire systématique.

