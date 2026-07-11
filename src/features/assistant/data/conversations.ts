import type { AssistantConversationMessage, ProjectMode } from "../../../types/product.js";

export const assistantConversations: Record<ProjectMode, AssistantConversationMessage[]> = {
  buyer: [
    {
      from: "assistant",
      text: "Bonjour Loïc, j'ai résumé votre situation : budget cadré, 4 visites utiles et un besoin de sécuriser l'offre.",
    },
    {
      from: "user",
      text: "Je veux préparer la visite de demain sans oublier les points sensibles.",
    },
    {
      from: "assistant",
      text: "Parfait. Je vous propose un plan en 3 temps : copropriété, travaux, financement. Je peux aussi générer les questions mot pour mot.",
    },
  ],
  seller: [
    {
      from: "assistant",
      text: "Bonjour Loïc, j'ai analysé votre projet vendeur : le point critique reste la préparation du dossier avant diffusion.",
    },
    {
      from: "user",
      text: "Je veux envoyer un message au syndic pour obtenir les pièces manquantes.",
    },
    {
      from: "assistant",
      text: "Je peux vous préparer un email concis avec la liste exacte des documents et le niveau d'urgence associé.",
    },
  ],
};
