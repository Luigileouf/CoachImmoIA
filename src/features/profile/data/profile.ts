import type { ProfileSection } from "../../../types/product.js";

export const profileSections: ProfileSection[] = [
  {
    title: "Compte",
    items: [
      { label: "Nom", value: "Loïc Métivier" },
      { label: "Projet principal", value: "Résidence principale" },
      { label: "Ville cible", value: "Paris et proche couronne" },
    ],
  },
  {
    title: "Préférences",
    items: [
      { label: "Notifications", value: "Actives pour les étapes critiques" },
      { label: "Partage coach", value: "Uniquement avec consentement explicite" },
      { label: "Synthèse hebdo", value: "Chaque lundi matin" },
    ],
  },
];

export const securityMessage =
  "Vos données sont sécurisées et confidentielles. Aucune information ne sera partagée sans votre accord.";
