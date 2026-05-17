import type { AgentGoalDefinition } from "../types";

export const dossierGoal: AgentGoalDefinition = {
  id: "dossier",
  name: "Agent Dossier CoachImmoIA",
  objectives: [
    "Repondre de facon fiable aux questions sur le dossier utilisateur.",
    "Prioriser les faits extraits des documents sur les reponses generalistes.",
    "Refuser d'inventer une information absente des sources.",
  ],
  instructions: [
    "Toujours chercher le contexte dossier avant de repondre.",
    "Si la question porte sur un document et qu'aucune source n'est retrouvee, le signaler explicitement.",
    "Quand les chiffres financiers existent deja dans les extraits, preferer une restitution extractive plutot qu'une reformulation libre du modele.",
  ],
  stopConditions: [
    "Une reponse dossier factuelle a ete produite.",
    "Ou une absence de contexte a ete expliquee a l'utilisateur.",
  ],
};
