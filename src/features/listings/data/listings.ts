import type { ListingItem, ProjectMode } from "../../../types/product.js";

export const listingFeeds: Record<ProjectMode, ListingItem[]> = {
  buyer: [
    {
      title: "Appartement lumineux avec balcon",
      location: "Paris 11e - Saint Ambroise",
      price: "648 kEUR",
      badge: "Visite prioritaire",
      detail: "3 pieces, 61 m2, copropriete saine, peu de travaux a prevoir.",
      scene: "house",
    },
    {
      title: "Duplex calme proche commerces",
      location: "Montreuil - Croix de Chavaux",
      price: "598 kEUR",
      badge: "A challenger",
      detail: "4 pieces, 78 m2, fort potentiel mais DPE a verifier en detail.",
      scene: "living",
    },
    {
      title: "Appartement ancien bien optimise",
      location: "Paris 20e - Gambetta",
      price: "612 kEUR",
      badge: "Bon rapport surface",
      detail: "3 pieces, 67 m2, etage eleve, charges maitrisees, cave incluse.",
      scene: "building",
    },
  ],
  seller: [
    {
      title: "Reference vendue en 18 jours",
      location: "Boulogne - Marcel Sembat",
      price: "10 450 EUR / m2",
      badge: "Comparable fort",
      detail: "Appartement de 74 m2 avec exterieur, mise en vente bien preparee.",
      scene: "building",
    },
    {
      title: "Bien similaire avec marge de nego faible",
      location: "Issy - Corentin Celton",
      price: "9 980 EUR / m2",
      badge: "Reference utile",
      detail: "Presentation tres soignee, diagnostics complets et calendrier clair.",
      scene: "house",
    },
    {
      title: "Vente directe bien documentee",
      location: "Paris 15e - Convention",
      price: "10 120 EUR / m2",
      badge: "Signal marche",
      detail: "Annonce selective, dossier complet, faible friction pendant les offres.",
      scene: "living",
    },
  ],
};
