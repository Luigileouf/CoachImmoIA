import type { ProjectMode, Scenario } from "../../../types/product.js";

export const scenarios: Record<ProjectMode, Scenario> = {
  buyer: {
    greeting: "Bonjour Loïc,",
    title: "votre coach immobilier",
    accent: "IA",
    intro: "Démarrez votre projet immobilier en moins de 3 minutes.",
    introHighlight: "3 minutes",
    cta: "Démarrer mon projet acheteur",
    projectStatus: "Projet acheteur en recherche active",
    projectNote: "Budget validé, visites à prioriser et offre à préparer sur les bons biens.",
    checklist: [
      "Valider les critères non négociables",
      "Préparer la prochaine visite",
      "Compiler les pièces pour le financement",
    ],
    coachHint: "Un coach peut reprendre la main avant une offre ou un compromis.",
    assistantIntro:
      "Je peux vous aider à cadrer une visite, négocier une offre ou sécuriser votre dossier bancaire.",
    assistantPrompts: [
      "Quelles questions poser pendant une visite ?",
      "Comment négocier sans fragiliser mon dossier ?",
      "Quels documents donner à ma banque en premier ?",
    ],
    listingsTitle: "Biens à prioriser cette semaine",
    listingsSubtitle:
      "Une sélection alignée sur votre budget, vos critères et votre vitesse d'exécution.",
    listingFilters: ["Paris 11e", "T3-T4", "Budget 500k-700k"],
    stats: [
      { label: "Budget cadre", value: "620 kEUR" },
      { label: "Visites retenues", value: "4" },
      { label: "Offre cible", value: "1 à préparer" },
    ],
    projectDocuments: [
      "Pièce d'identité",
      "Simulation bancaire",
      "Plan de financement",
      "Questions de visite",
    ],
  },
  seller: {
    greeting: "Bonjour Loïc,",
    title: "votre coach immobilier",
    accent: "IA",
    intro: "Organisez votre vente avec une feuille de route simple et rassurante.",
    introHighlight: "feuille de route",
    cta: "Démarrer mon projet vendeur",
    projectStatus: "Projet vendeur en phase de préparation",
    projectNote: "Documents à réunir, prix à cadrer et stratégie de mise en vente à arbitrer.",
    checklist: [
      "Rassembler les diagnostics",
      "Demander les pièces de copropriété",
      "Préparer le prix et le calendrier de vente",
    ],
    coachHint: "Un coach peut arbitrer le prix, le mandat et les négociations sensibles.",
    assistantIntro:
      "Je peux vous aider à structurer votre dossier, préparer un message au syndic ou cadrer votre prix.",
    assistantPrompts: [
      "Quelle liste envoyer au syndic ?",
      "Comment fixer un prix de mise en vente crédible ?",
      "Que vérifier avant d'accepter une offre ?",
    ],
    listingsTitle: "Biens comparables dans votre secteur",
    listingsSubtitle:
      "Des références utiles pour cadrer la valeur de votre bien avant la mise en marché.",
    listingFilters: ["Biens vendus", "90 derniers jours", "Surface proche"],
    stats: [
      { label: "Prix visé", value: "785 kEUR" },
      { label: "Docs critiques", value: "3 manquants" },
      { label: "Stratégie", value: "Agence ou direct" },
    ],
    projectDocuments: [
      "Titre de propriété",
      "Taxe foncière",
      "Diagnostics",
      "PV d'AG et carnet d'entretien",
    ],
  },
};
