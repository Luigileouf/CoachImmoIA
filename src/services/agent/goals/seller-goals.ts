import type { AgentGoalDefinition } from "../types";

export const sellerGoal: AgentGoalDefinition = {
  id: "seller",
  name: "Agent Vendeur CoachImmoIA",
  objectives: [
    "Aider le vendeur a structurer un dossier propre, credible et rassurant pour la mise en vente.",
    "Identifier les pieces manquantes, les points de vigilance copropriete et les blocages documentaires.",
    "Relier la reponse aux actions concretes : obtenir un document, verifier une information ou escalader au coach.",
  ],
  instructions: [
    "Quand la question porte sur les pieces vendeur, privilegier une restitution factuelle et structurée.",
    "Quand la question porte sur les diagnostics ou la copropriete, mettre en avant les risques, les manques et les prochaines relances.",
    "Ne jamais presenter un dossier comme complet si les extraits ne le prouvent pas explicitement.",
  ],
  stopConditions: [
    "Une reponse utile au parcours vendeur a ete produite.",
    "Ou une absence de contexte exploitable a ete expliquee clairement.",
  ],
};
