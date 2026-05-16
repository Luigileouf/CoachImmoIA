export type ProjectMode = "buyer" | "seller";
export type AppScreen = "home" | "listings" | "assistant" | "projects" | "documents" | "profile";

export type ActionCard = {
  id: "buyer" | "seller" | "estimate";
  title: string;
  description: string;
  icon: "home" | "key" | "chart";
  scene: "house" | "living" | "building";
};

export type Metric = {
  label: string;
  value: string;
};

export type ListingItem = {
  title: string;
  location: string;
  price: string;
  badge: string;
  detail: string;
  scene: ActionCard["scene"];
};

export type AssistantMessage = {
  from: "assistant" | "user";
  text: string;
};

export type ProjectStep = {
  title: string;
  detail: string;
  status: "done" | "active" | "next";
};

export type ProfileSection = {
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
};

type Scenario = {
  greeting: string;
  title: string;
  accent: string;
  intro: string;
  introHighlight: string;
  cta: string;
  projectStatus: string;
  projectNote: string;
  checklist: string[];
  coachHint: string;
  assistantIntro: string;
  assistantPrompts: string[];
  listingsTitle: string;
  listingsSubtitle: string;
  listingFilters: string[];
  stats: Metric[];
  projectDocuments: string[];
};

export const actionCards: ActionCard[] = [
  {
    id: "buyer",
    title: "Acheter",
    description: "Trouvez le bien ideal qui vous correspond",
    icon: "home",
    scene: "house",
  },
  {
    id: "seller",
    title: "Vendre",
    description: "Vendez au meilleur prix et en toute serenite",
    icon: "key",
    scene: "living",
  },
  {
    id: "estimate",
    title: "Estimer",
    description: "Obtenez une estimation precise de votre bien",
    icon: "chart",
    scene: "building",
  },
];

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
    assistantIntro: "Je peux vous aider a cadrer une visite, negocier une offre ou rassurer votre dossier banque.",
    assistantPrompts: [
      "Quelles questions poser pendant une visite ?",
      "Comment negocier sans fragiliser mon dossier ?",
      "Quels documents donner a ma banque en premier ?",
    ],
    listingsTitle: "Biens a prioriser cette semaine",
    listingsSubtitle: "Une selection alignee sur votre budget, vos criteres et votre vitesse d'execution.",
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
    assistantIntro: "Je peux vous aider a structurer votre dossier, preparer un message au syndic ou cadrer votre prix.",
    assistantPrompts: [
      "Quelle liste envoyer au syndic ?",
      "Comment fixer un prix de mise en vente credibile ?",
      "Que verifier avant d'accepter une offre ?",
    ],
    listingsTitle: "Biens comparables dans votre secteur",
    listingsSubtitle: "Des references utiles pour cadrer la valeur de votre bien avant la mise en marche.",
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

export const assistantConversations: Record<ProjectMode, AssistantMessage[]> = {
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
