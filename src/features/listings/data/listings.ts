import type { ListingItem, ProjectMode } from "../../../types/product.js";

export const listingFeeds: Record<ProjectMode, ListingItem[]> = {
  buyer: [
    {
      title: "Appartement lumineux avec balcon",
      location: "Paris 11e - Saint Ambroise",
      price: "648 k€",
      badge: "Visite prioritaire",
      detail: "3 pièces, 61 m², copropriété saine, peu de travaux à prévoir.",
      scene: "house",
    },
    {
      title: "Duplex calme proche commerces",
      location: "Montreuil - Croix de Chavaux",
      price: "598 k€",
      badge: "À challenger",
      detail: "4 pièces, 78 m², fort potentiel mais DPE à vérifier en détail.",
      scene: "living",
    },
    {
      title: "Appartement ancien bien optimisé",
      location: "Paris 20e - Gambetta",
      price: "612 k€",
      badge: "Bon rapport surface",
      detail: "3 pièces, 67 m², étage élevé, charges maîtrisées, cave incluse.",
      scene: "building",
    },
  ],
  seller: [
    {
      title: "Référence vendue en 18 jours",
      location: "Boulogne - Marcel Sembat",
      price: "10 450 EUR / m2",
      badge: "Comparable fort",
      detail: "Appartement de 74 m² avec extérieur, mise en vente bien préparée.",
      scene: "building",
    },
    {
      title: "Bien similaire avec faible marge de négociation",
      location: "Issy - Corentin Celton",
      price: "9 980 EUR / m2",
      badge: "Référence utile",
      detail: "Présentation très soignée, diagnostics complets et calendrier clair.",
      scene: "house",
    },
    {
      title: "Vente directe bien documentée",
      location: "Paris 15e - Convention",
      price: "10 120 EUR / m2",
      badge: "Signal marché",
      detail: "Annonce sélective, dossier complet, faible friction pendant les offres.",
      scene: "living",
    },
  ],
};
