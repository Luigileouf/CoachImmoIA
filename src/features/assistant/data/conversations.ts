import type { AssistantConversationMessage, ProjectMode } from "../../../types/product";

export const assistantConversations: Record<ProjectMode, AssistantConversationMessage[]> = {
  buyer: [
    {
      from: "assistant",
      text: "Bonjour Loic, j'ai resume votre situation : budget cadre, 4 visites utiles et un besoin de securiser l'offre.",
    },
    {
      from: "user",
      text: "Je veux preparer la visite de demain sans oublier les points sensibles.",
    },
    {
      from: "assistant",
      text: "Parfait. Je vous propose un plan en 3 temps : copropriete, travaux, financement. Je peux aussi generer les questions mot pour mot.",
    },
  ],
  seller: [
    {
      from: "assistant",
      text: "Bonjour Loic, j'ai analyse votre projet vendeur : le point critique reste la preparation du dossier avant diffusion.",
    },
    {
      from: "user",
      text: "Je veux envoyer un message au syndic pour obtenir les pieces manquantes.",
    },
    {
      from: "assistant",
      text: "Je peux vous preparer un email concis avec la liste exacte des documents et le niveau d'urgence associe.",
    },
  ],
};
