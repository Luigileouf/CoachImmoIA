import type { ProjectMode, Scenario } from "../../../types/product.js";

export const scenarios: Record<ProjectMode, Scenario> = {
  buyer: {
    greeting: "Bonjour Loic,",
    title: "votre coach immobilier",
    accent: "IA",
    intro: "Demarrez votre projet immobilier en moins de 3 minutes.",
    introHighlight: "3 minutes",
    cta: "Demarrer mon projet acheteur",
    projectStatus: "Projet acheteur en recherche active",
    projectNote: "Budget valide, visites a prioriser et offre a preparer sur les bons biens.",
    checklist: [
      "Valider les criteres non negociables",
      "Preparer la prochaine visite",
      "Compiler les pieces pour le financement",
    ],
    coachHint: "Un coach peut reprendre la main avant une offre ou un compromis.",
    assistantIntro:
      "Je peux vous aider a cadrer une visite, negocier une offre ou rassurer votre dossier banque.",
    assistantPrompts: [
      "Quelles questions poser pendant une visite ?",
      "Comment negocier sans fragiliser mon dossier ?",
      "Quels documents donner a ma banque en premier ?",
    ],
    listingsTitle: "Biens a prioriser cette semaine",
    listingsSubtitle:
      "Une selection alignee sur votre budget, vos criteres et votre vitesse d'execution.",
    listingFilters: ["Paris 11e", "T3-T4", "Budget 500k-700k"],
    stats: [
      { label: "Budget cadre", value: "620 kEUR" },
      { label: "Visites retenues", value: "4" },
      { label: "Offre cible", value: "1 a preparer" },
    ],
    projectDocuments: [
      "Piece d'identite",
      "Simulation bancaire",
      "Plan de financement",
      "Questions de visite",
    ],
  },
  seller: {
    greeting: "Bonjour Loic,",
    title: "votre coach immobilier",
    accent: "IA",
    intro: "Organisez votre vente avec une feuille de route simple et rassurante.",
    introHighlight: "feuille de route",
    cta: "Demarrer mon projet vendeur",
    projectStatus: "Projet vendeur en phase de preparation",
    projectNote: "Documents a reunir, prix a cadrer et strategie de mise en vente a arbitrer.",
    checklist: [
      "Rassembler les diagnostics",
      "Demander les pieces de copropriete",
      "Preparer le prix et le calendrier de vente",
    ],
    coachHint: "Un coach peut arbitrer le prix, le mandat et les negociations sensibles.",
    assistantIntro:
      "Je peux vous aider a structurer votre dossier, preparer un message au syndic ou cadrer votre prix.",
    assistantPrompts: [
      "Quelle liste envoyer au syndic ?",
      "Comment fixer un prix de mise en vente credibile ?",
      "Que verifier avant d'accepter une offre ?",
    ],
    listingsTitle: "Biens comparables dans votre secteur",
    listingsSubtitle:
      "Des references utiles pour cadrer la valeur de votre bien avant la mise en marche.",
    listingFilters: ["Biens vendus", "90 derniers jours", "Surface proche"],
    stats: [
      { label: "Prix vise", value: "785 kEUR" },
      { label: "Docs critiques", value: "3 manquants" },
      { label: "Strategie", value: "Agence ou direct" },
    ],
    projectDocuments: [
      "Titre de propriete",
      "Taxe fonciere",
      "Diagnostics",
      "PV d'AG et carnet d'entretien",
    ],
  },
};
