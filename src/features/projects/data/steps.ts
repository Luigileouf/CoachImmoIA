import type { ProjectMode, ProjectStep } from "../../../types/product";

export const projectSteps: Record<ProjectMode, ProjectStep[]> = {
  buyer: [
    {
      title: "Budget et capacite d'emprunt",
      detail: "Simulation obtenue et budget deja cadre avec marge de securite.",
      status: "done",
    },
    {
      title: "Visites et analyse des biens",
      detail: "Comparer objectivement les biens et remonter les alertes avant offre.",
      status: "active",
    },
    {
      title: "Offre et dossier de financement",
      detail: "Structurer l'offre, les conditions suspensives et le paquet banque.",
      status: "next",
    },
  ],
  seller: [
    {
      title: "Preparation du dossier",
      detail: "Rassembler les pieces et identifier les documents encore manquants.",
      status: "active",
    },
    {
      title: "Positionnement prix et strategie",
      detail: "Arbitrer entre mandat agence, vente directe et niveau de prix cible.",
      status: "next",
    },
    {
      title: "Mise en vente et tri des offres",
      detail: "Orchestrer les visites et qualifier les offres sans precipiter la decision.",
      status: "next",
    },
  ],
};
