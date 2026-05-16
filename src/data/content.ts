export type ProjectMode = "buyer" | "seller";
export type AppScreen = "home" | "listings" | "assistant" | "projects" | "documents" | "social" | "profile";

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

export type SocialCircle = {
  id: string;
  title: string;
  audience: string;
  description: string;
  members: string;
  activity: string;
  trust: string;
  prompt: string;
  tags: string[];
};

export type SocialThread = {
  id: string;
  circleId: string;
  title: string;
  author: string;
  role: string;
  trust: string;
  excerpt: string;
  replies: string;
  lastActivity: string;
  aiSummary: string;
  projectLink: string;
  actionLabel: string;
};

export type SocialHighlight = {
  eyebrow: string;
  title: string;
  summary: string;
  cta: string;
  secondaryCta: string;
  trustSignals: string[];
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

export const socialHighlights: Record<ProjectMode, SocialHighlight> = {
  buyer: {
    eyebrow: "Communaute verifiee",
    title: "Confrontez vos intuitions avant une visite, une offre ou une negociation.",
    summary:
      "Des retours de pairs qui vivent les memes etapes, structures par l'IA et escaladables au coach si le sujet devient sensible.",
    cta: "Poser une question",
    secondaryCta: "Ouvrir l'assistant",
    trustSignals: ["Pair verifie", "Coach valide", "Synthese IA"],
  },
  seller: {
    eyebrow: "Communaute verifiee",
    title: "Cadrez votre prix, votre dossier et vos offres avec des retours terrain utiles.",
    summary:
      "Un espace social sobre pour debloquer une strategie vendeur, partager une relance syndic ou comprendre une offre sans rester seul.",
    cta: "Lancer une discussion",
    secondaryCta: "Voir les groupes",
    trustSignals: ["Retour vecu", "Coach valide", "Moderation forte"],
  },
};

export const socialStats: Record<ProjectMode, Metric[]> = {
  buyer: [
    { label: "Cercles actifs", value: "6" },
    { label: "Questions utiles cette semaine", value: "18" },
    { label: "Syntheses IA disponibles", value: "7" },
  ],
  seller: [
    { label: "Cercles actifs", value: "5" },
    { label: "Retours vendeur cette semaine", value: "14" },
    { label: "Escalades coach en cours", value: "3" },
  ],
};

export const socialCircles: Record<ProjectMode, SocialCircle[]> = {
  buyer: [
    {
      id: "first-purchase",
      title: "Premiere acquisition",
      audience: "Acheteurs debutants",
      description: "Questions de posture, negociation, stress et arbitrages de premiere residence principale.",
      members: "324 membres",
      activity: "12 fils actifs",
      trust: "Moderation forte",
      prompt: "Ideal pour challenger un doute avant une offre ou une visite cle.",
      tags: ["Debut de projet", "Offre", "Stress"],
    },
    {
      id: "visits-condo",
      title: "Visites et copropriete",
      audience: "Acheteurs en recherche active",
      description: "Retours sur les questions a poser, les travaux votes, les charges et les signaux faibles a reperer.",
      members: "281 membres",
      activity: "Question chaude",
      trust: "Coach present",
      prompt: "Le bon cercle pour objectiver une visite et preparer un follow-up propre.",
      tags: ["Visite", "Charges", "PV AG"],
    },
    {
      id: "financing-offer",
      title: "Financement et offre",
      audience: "Acheteurs prets a se positionner",
      description: "Aides concretes pour relier banque, apport, delais et conditions suspensives.",
      members: "198 membres",
      activity: "9 syntheses IA",
      trust: "Pair verifie",
      prompt: "Utile pour remettre de l'ordre entre emotions, tempo banque et niveau d'offre.",
      tags: ["Banque", "Apport", "Offre"],
    },
  ],
  seller: [
    {
      id: "seller-file",
      title: "Dossier vendeur",
      audience: "Vendeurs en preparation",
      description: "Pieces critiques, relances syndic, diagnostics et manques frequents avant diffusion.",
      members: "246 membres",
      activity: "16 relances partagees",
      trust: "Moderation forte",
      prompt: "Le cercle pour nettoyer son dossier avant d'exposer le bien au marche.",
      tags: ["Documents", "Syndic", "Diagnostics"],
    },
    {
      id: "pricing-strategy",
      title: "Prix et strategie",
      audience: "Vendeurs en cadrage prix",
      description: "Retours sur la mise en vente, la marge de nego, le direct vs agence et les erreurs de positionnement.",
      members: "219 membres",
      activity: "11 debats utiles",
      trust: "Coach valide",
      prompt: "Aide a transformer une intuition prix en strategie plus defendable.",
      tags: ["Prix", "Mandat", "Strategie"],
    },
    {
      id: "offers-sorting",
      title: "Offres recues",
      audience: "Vendeurs en phase active",
      description: "Partages d'experience pour trier les offres, lire les signaux faibles et repondre sans precipiter.",
      members: "187 membres",
      activity: "7 arbitrages en cours",
      trust: "Pair verifie",
      prompt: "Le bon espace pour comparer conditions, financement et calendrier sans s'isoler.",
      tags: ["Offres", "Negociation", "Compromis"],
    },
  ],
};

export const socialThreads: Record<ProjectMode, SocialThread[]> = {
  buyer: [
    {
      id: "buyer-thread-1",
      circleId: "visits-condo",
      title: "Comment verifier qu'une copropriete ne cache pas de gros travaux avant de faire une offre ?",
      author: "Claire",
      role: "Acheteuse · Paris 11e",
      trust: "Pair verifie",
      excerpt: "Je veux poser les bonnes questions en visite sans paraitre agressive ni me faire noyer dans le jargon.",
      replies: "28 reponses",
      lastActivity: "Mis a jour il y a 14 min",
      aiSummary: "Les pairs convergent sur trois questions cle : travaux deja votes, calendrier d'appel de fonds et reactions du vendeur sur les PV.",
      projectLink: "Ajouter les questions au projet visite",
      actionLabel: "Ouvrir le fil",
    },
    {
      id: "buyer-thread-2",
      circleId: "financing-offer",
      title: "Ma banque redemande des justificatifs apres la visite. Comment garder la main sur le tempo ?",
      author: "Hugo",
      role: "Acheteur · Premiere acquisition",
      trust: "Synthese IA",
      excerpt: "Je crains que le delai banque m'oblige a reformuler mon offre alors que le bien avance vite.",
      replies: "11 reponses",
      lastActivity: "Mis a jour il y a 41 min",
      aiSummary: "Le fil recommande de separer les pieces urgentes des pieces de confort et de reposer tres vite le calendrier cible a la banque.",
      projectLink: "Lier au plan de financement",
      actionLabel: "Voir les retours",
    },
    {
      id: "buyer-thread-3",
      circleId: "first-purchase",
      title: "Comment negocier sans casser la relation avec le vendeur quand on adore le bien ?",
      author: "Manon",
      role: "Acheteuse · Residence principale",
      trust: "Coach valide",
      excerpt: "Je veux proposer un ajustement de prix sans donner l'impression que mon dossier est fragile.",
      replies: "17 reponses",
      lastActivity: "Mis a jour il y a 1 h",
      aiSummary: "Les reponses utiles suggerent une nego argumentee sur faits verifiables, jamais sur le simple desir de payer moins.",
      projectLink: "Envoyer vers l'assistant IA",
      actionLabel: "Lire le fil",
    },
  ],
  seller: [
    {
      id: "seller-thread-1",
      circleId: "pricing-strategy",
      title: "Comment annoncer un prix ambitieux sans perdre les bons acheteurs des la premiere semaine ?",
      author: "Nicolas",
      role: "Vendeur · Appartement familial",
      trust: "Coach valide",
      excerpt: "Je veux tester une fourchette haute sans transformer l'annonce en repoussoir.",
      replies: "21 reponses",
      lastActivity: "Mis a jour il y a 19 min",
      aiSummary: "Le fil recommande d'adosser le prix a trois comparables lisibles et de preparer une narration simple sur les forces du bien.",
      projectLink: "Ajouter au cadrage prix",
      actionLabel: "Ouvrir le fil",
    },
    {
      id: "seller-thread-2",
      circleId: "seller-file",
      title: "Quels documents envoyer avant le compromis pour rassurer sans noyer l'acheteur ?",
      author: "Sarah",
      role: "Vendeuse · Copropriete",
      trust: "Pair verifie",
      excerpt: "J'hesite entre tout envoyer d'un coup ou garder certains documents pour plus tard.",
      replies: "14 reponses",
      lastActivity: "Mis a jour il y a 52 min",
      aiSummary: "Les retours poussent vers un envoi progressif : diagnostic, taxe et points critiques d'abord, puis detail copropriete selon maturite.",
      projectLink: "Lier aux documents vendeur",
      actionLabel: "Voir les reponses",
    },
    {
      id: "seller-thread-3",
      circleId: "offers-sorting",
      title: "Je recois deux offres proches, mais l'une est plus floue cote financement. Comment arbitrer ?",
      author: "Elise",
      role: "Vendeuse · Mise en vente active",
      trust: "Synthese IA",
      excerpt: "Je veux comparer serenement les conditions sans me laisser absorber par le montant affiché.",
      replies: "9 reponses",
      lastActivity: "Mis a jour il y a 1 h",
      aiSummary: "Le fil insiste sur la lisibilite du plan de financement, la qualite du calendrier et la solidite du dossier avant le montant facial.",
      projectLink: "Ajouter a l'espace projet",
      actionLabel: "Consulter le fil",
    },
  ],
};
