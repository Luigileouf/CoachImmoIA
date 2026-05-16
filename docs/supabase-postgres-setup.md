# Supabase / Postgres

## Objectif

Poser un socle base de donnees realiste pour `CoachImmoIA` sans casser le prototype existant.

## Ce qui est deja en place

- client navigateur : [browser.ts](/Users/lmetivier/Dev/CoachImoIA/src/services/supabase/browser.ts)
- helper serveur : [supabase.ts](/Users/lmetivier/Dev/CoachImoIA/api/_lib/supabase.ts)
- migration initiale : [20260516152000_initial_platform.sql](/Users/lmetivier/Dev/CoachImoIA/supabase/migrations/20260516152000_initial_platform.sql)
- endpoints metier :
  - [documents](/Users/lmetivier/Dev/CoachImoIA/api/documents/index.ts)
  - [projects](/Users/lmetivier/Dev/CoachImoIA/api/projects/index.ts)
  - [social](/Users/lmetivier/Dev/CoachImoIA/api/social/index.ts)

## Variables d'environnement attendues

Frontend :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Backend :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Mode actuel

L'application tourne encore sur les donnees locales du domaine produit.

Le backend expose deja des contrats JSON stables, mais il renvoie encore des donnees derivees du prototype tant que Supabase n'est pas raccorde.

## Prochaine etape pour brancher la vraie base

1. creer le projet Supabase
2. appliquer la migration SQL
3. renseigner les variables d'environnement
4. remplacer progressivement les sources mock des endpoints par des requetes Supabase
5. brancher `Documents`, puis `Projects`, puis `Social`

## Notes

- Le CLI Supabase n'etait pas disponible dans cet environnement au moment de cette passe, donc la migration a ete creee dans le repo directement.
- La migration active `RLS` sur toutes les tables exposees.
- Le schema prepare deja le terrain pour le futur RAG avec `document_chunks` et `vector`.
