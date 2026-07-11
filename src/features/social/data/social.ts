import type {
  Metric,
  ProjectMode,
  SocialCircle,
  SocialHighlight,
  SocialThread,
} from "../../../types/product.js";

export const socialHighlights: Record<ProjectMode, SocialHighlight> = {
  buyer: {
    eyebrow: "Communauté vérifiée",
    title: "Confrontez vos intuitions avant une visite, une offre ou une négociation.",
    summary:
      "Des retours de pairs qui vivent les mêmes étapes, structurés par l'IA et transmissibles au coach si le sujet devient sensible.",
    cta: "Poser une question",
    secondaryCta: "Ouvrir l'assistant",
    trustSignals: ["Pair vérifié", "Coach validé", "Synthèse IA"],
  },
  seller: {
    eyebrow: "Communauté vérifiée",
    title: "Cadrez votre prix, votre dossier et vos offres avec des retours terrain utiles.",
    summary:
      "Un espace social sobre pour débloquer une stratégie vendeur, partager une relance au syndic ou comprendre une offre sans rester seul.",
    cta: "Lancer une discussion",
    secondaryCta: "Voir les groupes",
    trustSignals: ["Retour vécu", "Coach validé", "Modération forte"],
  },
};

export const socialStats: Record<ProjectMode, Metric[]> = {
  buyer: [
    { label: "Cercles actifs", value: "6" },
    { label: "Questions utiles cette semaine", value: "18" },
    { label: "Synthèses IA disponibles", value: "7" },
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
      title: "Première acquisition",
      audience: "Acheteurs débutants",
      description:
        "Questions de posture, négociation, stress et arbitrages pour une première résidence principale.",
      members: "324 membres",
      activity: "12 fils actifs",
      trust: "Modération forte",
      prompt: "Idéal pour challenger un doute avant une offre ou une visite clé.",
      tags: ["Début de projet", "Offre", "Stress"],
    },
    {
      id: "visits-condo",
      title: "Visites et copropriété",
      audience: "Acheteurs en recherche active",
      description:
        "Retours sur les questions à poser, les travaux votés, les charges et les signaux faibles à repérer.",
      members: "281 membres",
      activity: "Question chaude",
      trust: "Coach présent",
      prompt: "Le bon cercle pour objectiver une visite et préparer un suivi clair.",
      tags: ["Visite", "Charges", "PV AG"],
    },
    {
      id: "financing-offer",
      title: "Financement et offre",
      audience: "Acheteurs prêts à se positionner",
      description:
        "Aides concrètes pour relier banque, apport, délais et conditions suspensives.",
      members: "198 membres",
      activity: "9 synthèses IA",
      trust: "Pair vérifié",
      prompt:
        "Utile pour remettre de l'ordre entre émotions, calendrier bancaire et niveau d'offre.",
      tags: ["Banque", "Apport", "Offre"],
    },
  ],
  seller: [
    {
      id: "seller-file",
      title: "Dossier vendeur",
      audience: "Vendeurs en préparation",
      description:
        "Pièces critiques, relances au syndic, diagnostics et manques fréquents avant diffusion.",
      members: "246 membres",
      activity: "16 relances partagées",
      trust: "Modération forte",
      prompt: "Le cercle pour nettoyer son dossier avant d'exposer le bien au marché.",
      tags: ["Documents", "Syndic", "Diagnostics"],
    },
    {
      id: "pricing-strategy",
      title: "Prix et stratégie",
      audience: "Vendeurs en cadrage prix",
      description:
        "Retours sur la mise en vente, la marge de négociation, la vente directe ou en agence et les erreurs de positionnement.",
      members: "219 membres",
      activity: "11 débats utiles",
      trust: "Coach validé",
      prompt: "Aide à transformer une intuition de prix en stratégie plus défendable.",
      tags: ["Prix", "Mandat", "Stratégie"],
    },
    {
      id: "offers-sorting",
      title: "Offres reçues",
      audience: "Vendeurs en phase active",
      description:
        "Partages d'expérience pour trier les offres, lire les signaux faibles et répondre sans précipitation.",
      members: "187 membres",
      activity: "7 arbitrages en cours",
      trust: "Pair vérifié",
      prompt:
        "Le bon espace pour comparer conditions, financement et calendrier sans s'isoler.",
      tags: ["Offres", "Négociation", "Compromis"],
    },
  ],
};

export const socialThreads: Record<ProjectMode, SocialThread[]> = {
  buyer: [
    {
      id: "buyer-thread-1",
      circleId: "visits-condo",
      title: "Comment vérifier qu'une copropriété ne cache pas de gros travaux avant de faire une offre ?",
      author: "Claire",
      role: "Acheteuse · Paris 11e",
      trust: "Pair vérifié",
      excerpt:
        "Je veux poser les bonnes questions en visite sans paraître agressive ni me faire noyer dans le jargon.",
      replies: "28 réponses",
      lastActivity: "Mis à jour il y a 14 min",
      aiSummary:
        "Les pairs convergent sur trois questions clés : travaux déjà votés, calendrier d'appel de fonds et réactions du vendeur sur les PV.",
      projectLink: "Ajouter les questions au projet visite",
      actionLabel: "Ouvrir le fil",
    },
    {
      id: "buyer-thread-2",
      circleId: "financing-offer",
      title: "Ma banque redemande des justificatifs après la visite. Comment garder la main sur le calendrier ?",
      author: "Hugo",
      role: "Acheteur · Première acquisition",
      trust: "Synthèse IA",
      excerpt:
        "Je crains que le délai bancaire m'oblige à reformuler mon offre alors que le bien avance vite.",
      replies: "11 réponses",
      lastActivity: "Mis à jour il y a 41 min",
      aiSummary:
        "Le fil recommande de séparer les pièces urgentes des pièces complémentaires et de confirmer rapidement le calendrier cible avec la banque.",
      projectLink: "Lier au plan de financement",
      actionLabel: "Voir les retours",
    },
    {
      id: "buyer-thread-3",
      circleId: "first-purchase",
      title: "Comment négocier sans casser la relation avec le vendeur quand on adore le bien ?",
      author: "Manon",
      role: "Acheteuse · Résidence principale",
      trust: "Coach validé",
      excerpt:
        "Je veux proposer un ajustement de prix sans donner l'impression que mon dossier est fragile.",
      replies: "17 réponses",
      lastActivity: "Mis à jour il y a 1 h",
      aiSummary:
        "Les réponses utiles suggèrent une négociation argumentée sur des faits vérifiables, jamais sur le simple désir de payer moins.",
      projectLink: "Envoyer vers l'assistant IA",
      actionLabel: "Lire le fil",
    },
  ],
  seller: [
    {
      id: "seller-thread-1",
      circleId: "pricing-strategy",
      title: "Comment annoncer un prix ambitieux sans perdre les bons acheteurs dès la première semaine ?",
      author: "Nicolas",
      role: "Vendeur · Appartement familial",
      trust: "Coach validé",
      excerpt:
        "Je veux tester une fourchette haute sans transformer l'annonce en repoussoir.",
      replies: "21 réponses",
      lastActivity: "Mis à jour il y a 19 min",
      aiSummary:
        "Le fil recommande d'adosser le prix à trois comparables lisibles et de préparer une présentation simple des forces du bien.",
      projectLink: "Ajouter au cadrage prix",
      actionLabel: "Ouvrir le fil",
    },
    {
      id: "seller-thread-2",
      circleId: "seller-file",
      title: "Quels documents envoyer avant le compromis pour rassurer sans noyer l'acheteur ?",
      author: "Sarah",
      role: "Vendeuse · Copropriété",
      trust: "Pair vérifié",
      excerpt:
        "J'hesite entre tout envoyer d'un coup ou garder certains documents pour plus tard.",
      replies: "14 réponses",
      lastActivity: "Mis à jour il y a 52 min",
      aiSummary:
        "Les retours recommandent un envoi progressif : diagnostics, taxe et points critiques d'abord, puis détails de copropriété selon la maturité du dossier.",
      projectLink: "Lier aux documents vendeur",
      actionLabel: "Voir les réponses",
    },
    {
      id: "seller-thread-3",
      circleId: "offers-sorting",
      title: "Je reçois deux offres proches, mais l'une est plus floue côté financement. Comment arbitrer ?",
      author: "Elise",
      role: "Vendeuse · Mise en vente active",
      trust: "Synthèse IA",
      excerpt:
        "Je veux comparer sereinement les conditions sans me laisser absorber par le montant affiché.",
      replies: "9 réponses",
      lastActivity: "Mis à jour il y a 1 h",
      aiSummary:
        "Le fil insiste sur la lisibilité du plan de financement, la qualité du calendrier et la solidité du dossier avant le montant facial.",
      projectLink: "Ajouter à l'espace projet",
      actionLabel: "Consulter le fil",
    },
  ],
};
