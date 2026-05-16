import type { ProfileSection } from "../../../types/product";

export const profileSections: ProfileSection[] = [
  {
    title: "Compte",
    items: [
      { label: "Nom", value: "Loic Metivier" },
      { label: "Projet principal", value: "Residence principale" },
      { label: "Ville cible", value: "Paris et proche couronne" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Notifications", value: "Actives pour les etapes critiques" },
      { label: "Partage coach", value: "Uniquement avec consentement explicite" },
      { label: "Synthese hebdo", value: "Chaque lundi matin" },
    ],
  },
];

export const securityMessage =
  "Vos donnees sont securisees et confidentielles. Aucune information ne sera partagee sans votre accord.";
