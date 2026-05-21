import type {
  Metric,
  ProjectMode,
  SocialCircle,
  SocialHighlight,
  SocialThread,
} from "../../../types/product.js";

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
      description:
        "Questions de posture, negociation, stress et arbitrages de premiere residence principale.",
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
      description:
        "Retours sur les questions a poser, les travaux votes, les charges et les signaux faibles a reperer.",
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
      description:
        "Aides concretes pour relier banque, apport, delais et conditions suspensives.",
      members: "198 membres",
      activity: "9 syntheses IA",
      trust: "Pair verifie",
      prompt:
        "Utile pour remettre de l'ordre entre emotions, tempo banque et niveau d'offre.",
      tags: ["Banque", "Apport", "Offre"],
    },
  ],
  seller: [
    {
      id: "seller-file",
      title: "Dossier vendeur",
      audience: "Vendeurs en preparation",
      description:
        "Pieces critiques, relances syndic, diagnostics et manques frequents avant diffusion.",
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
      description:
        "Retours sur la mise en vente, la marge de nego, le direct vs agence et les erreurs de positionnement.",
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
      description:
        "Partages d'experience pour trier les offres, lire les signaux faibles et repondre sans precipiter.",
      members: "187 membres",
      activity: "7 arbitrages en cours",
      trust: "Pair verifie",
      prompt:
        "Le bon espace pour comparer conditions, financement et calendrier sans s'isoler.",
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
      excerpt:
        "Je veux poser les bonnes questions en visite sans paraitre agressive ni me faire noyer dans le jargon.",
      replies: "28 reponses",
      lastActivity: "Mis a jour il y a 14 min",
      aiSummary:
        "Les pairs convergent sur trois questions cle : travaux deja votes, calendrier d'appel de fonds et reactions du vendeur sur les PV.",
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
      excerpt:
        "Je crains que le delai banque m'oblige a reformuler mon offre alors que le bien avance vite.",
      replies: "11 reponses",
      lastActivity: "Mis a jour il y a 41 min",
      aiSummary:
        "Le fil recommande de separer les pieces urgentes des pieces de confort et de reposer tres vite le calendrier cible a la banque.",
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
      excerpt:
        "Je veux proposer un ajustement de prix sans donner l'impression que mon dossier est fragile.",
      replies: "17 reponses",
      lastActivity: "Mis a jour il y a 1 h",
      aiSummary:
        "Les reponses utiles suggerent une nego argumentee sur faits verifiables, jamais sur le simple desir de payer moins.",
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
      excerpt:
        "Je veux tester une fourchette haute sans transformer l'annonce en repoussoir.",
      replies: "21 reponses",
      lastActivity: "Mis a jour il y a 19 min",
      aiSummary:
        "Le fil recommande d'adosser le prix a trois comparables lisibles et de preparer une narration simple sur les forces du bien.",
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
      excerpt:
        "J'hesite entre tout envoyer d'un coup ou garder certains documents pour plus tard.",
      replies: "14 reponses",
      lastActivity: "Mis a jour il y a 52 min",
      aiSummary:
        "Les retours poussent vers un envoi progressif : diagnostic, taxe et points critiques d'abord, puis detail copropriete selon maturite.",
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
      excerpt:
        "Je veux comparer serenement les conditions sans me laisser absorber par le montant affiche.",
      replies: "9 reponses",
      lastActivity: "Mis a jour il y a 1 h",
      aiSummary:
        "Le fil insiste sur la lisibilite du plan de financement, la qualite du calendrier et la solidite du dossier avant le montant facial.",
      projectLink: "Ajouter a l'espace projet",
      actionLabel: "Consulter le fil",
    },
  ],
};
