import type { RagContextResponse } from "../api";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findPattern(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function dedupeDocumentLabels(sources: RagContextResponse["sources"]) {
  return Array.from(new Set(sources.map((source) => source.label)));
}

function buildSourceCorpus(sources: RagContextResponse["sources"]) {
  return sources.map((source) => `${source.label} ${source.summary} ${source.excerpt}`).join(" ");
}

function filterSourcesByTerms(
  sources: RagContextResponse["sources"],
  terms: string[],
) {
  return sources.filter((source) => {
    const haystack = normalize(`${source.label} ${source.summary} ${source.excerpt}`).toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });
}

function sanitizeExcerpt(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function buildExtractiveSourceAnswer({
  intro,
  sources,
  limit = 3,
  fallbackSummary,
  vigilance,
}: {
  intro: string;
  sources: RagContextResponse["sources"];
  limit?: number;
  fallbackSummary?: string;
  vigilance?: string;
}) {
  if (sources.length === 0) {
    return null;
  }

  const lines = [intro];
  const seen = new Set<string>();

  for (const source of sources) {
    const key = `${source.label}:${source.excerpt}`;
    if (seen.has(key)) {
      continue;
    }

    const detail = sanitizeExcerpt(source.excerpt || source.summary);

    if (!detail) {
      continue;
    }

    lines.push(`- ${source.label} : ${detail}`);
    seen.add(key);

    if (seen.size >= limit) {
      break;
    }
  }

  if (lines.length === 1 && fallbackSummary) {
    lines.push(`- ${fallbackSummary}`);
  }

  if (vigilance) {
    lines.push(`Point de vigilance : ${vigilance}`);
  }

  return lines.length > 1 ? lines.join("\n") : null;
}

export function buildGroundedFinancialAnswer(
  query: string,
  sources: RagContextResponse["sources"],
) {
  const normalizedQuery = normalize(query).toLowerCase();
  const isFinancingQuestion =
    normalizedQuery.includes("capacite d emprunt") ||
    normalizedQuery.includes("capacite d'emprunt") ||
    normalizedQuery.includes("emprunt") ||
    normalizedQuery.includes("simulation bancaire") ||
    normalizedQuery.includes("financement") ||
    normalizedQuery.includes("taux d endettement") ||
    normalizedQuery.includes("taux d'endettement");

  if (!isFinancingQuestion || sources.length === 0) {
    return null;
  }

  const rawCorpus = buildSourceCorpus(sources);
  const corpus = normalize(rawCorpus);

  const borrowedAmount = findPattern(corpus, [
    /montant emprunte retenu ([0-9 ]+ eur)/i,
    /pret immobilier principal ([0-9 ]+ eur)/i,
  ]);
  const contribution = findPattern(corpus, [/apport personnel ([0-9 ]+ eur)/i]);
  const duration = findPattern(corpus, [
    /duree retenue ([0-9]+ ans, soit [0-9 ]+ mois)/i,
    /duree ([0-9]+ ans)/i,
  ]);
  const nominalRate = findPattern(corpus, [
    /taux nominal fixe ([0-9]+[.,][0-9]+ ?%)/i,
    /taux nominal ([0-9]+[.,][0-9]+ ?%)/i,
  ]);
  const monthlyPayment = findPattern(corpus, [
    /mensualite totale estimee ([0-9 ]+ eur assurance incluse)/i,
    /mensualite assurance incluse ([0-9 ]+ eur)/i,
  ]);
  const correctedDebtRatio = findPattern(rawCorpus, [
    /taux d['’]endettement bancaire corrige\s+([0-9]+[.,][0-9]+\s*%)/i,
    /quel est le taux d['’]endettement la banque retient-elle\s*\??\s*([0-9]+[.,][0-9]+\s*%)/i,
    /taux d['’]endettement la banque retient-elle\s*\??\s*([0-9]+[.,][0-9]+\s*%)/i,
  ]);
  const grossDebtRatio = findPattern(rawCorpus, [
    /taux d['’]endettement brut\s+([0-9]+[.,][0-9]+\s*%)/i,
  ]);
  const decision = findPattern(rawCorpus, [
    /decision simulee\s+([A-Za-zÀ-ÿ'’ -]+sous conditions)/i,
    /conclusion bancaire simulee\s*:\s*([A-Za-zÀ-ÿ'’ -]+sous reserve [A-Za-zÀ-ÿ'’ -]+)/i,
    /(accord de principe favorable sous conditions)/i,
  ]);

  const exactFields = [
    borrowedAmount,
    contribution,
    duration,
    nominalRate,
    monthlyPayment,
    correctedDebtRatio,
  ].filter(Boolean);

  if (exactFields.length < 3) {
    return null;
  }

  const labels = dedupeDocumentLabels(sources).join(", ");
  const lines = [
    `D'après le document ${labels}, voici ce que je trouve sur votre capacité d'emprunt :`,
  ];

  if (borrowedAmount) {
    lines.push(`- Montant emprunté retenu : ${borrowedAmount}`);
  }
  if (contribution) {
    lines.push(`- Apport personnel : ${contribution}`);
  }
  if (duration) {
    lines.push(`- Durée retenue : ${duration}`);
  }
  if (nominalRate) {
    lines.push(`- Taux nominal fixe : ${nominalRate}`);
  }
  if (monthlyPayment) {
    lines.push(`- Mensualité estimée : ${monthlyPayment}`);
  }
  if (correctedDebtRatio) {
    lines.push(`- Taux d'endettement retenu par la banque : ${correctedDebtRatio}`);
  }
  if (grossDebtRatio) {
    lines.push(`- Taux d'endettement brut : ${grossDebtRatio}`);
  }
  if (decision) {
    lines.push(`- Décision indiquée : ${decision}`);
  }

  lines.push(
    "Point de vigilance : le document indique qu'il s'agit d'une simulation et non d'une offre de prêt définitive.",
  );

  return lines.join("\n");
}

export function buildGroundedCoproAnswer(
  query: string,
  sources: RagContextResponse["sources"],
) {
  const normalizedQuery = normalize(query).toLowerCase();
  const isCoproQuestion =
    normalizedQuery.includes("copro") ||
    normalizedQuery.includes("copropriete") ||
    normalizedQuery.includes("syndic") ||
    normalizedQuery.includes("pv d ag") ||
    normalizedQuery.includes("pv ag") ||
    normalizedQuery.includes("charges");

  if (!isCoproQuestion || sources.length === 0) {
    return null;
  }

  const relatedSources = filterSourcesByTerms(sources, [
    "copro",
    "copropriete",
    "syndic",
    "pv ag",
    "assemblee generale",
    "carnet d entretien",
    "charges",
    "travaux",
  ]);

  return buildExtractiveSourceAnswer({
    intro: "D'après les documents de copropriété disponibles :",
    sources: relatedSources,
    fallbackSummary:
      "Les pièces de copropriété signalent des éléments à vérifier avec le syndic avant tout engagement.",
    vigilance:
      "vérifiez les travaux votés, les charges récurrentes et toute décision récente d'assemblée générale.",
  });
}

export function buildGroundedDiagnosticsAnswer(
  query: string,
  sources: RagContextResponse["sources"],
) {
  const normalizedQuery = normalize(query).toLowerCase();
  const isDiagnosticsQuestion =
    normalizedQuery.includes("diagnostic") ||
    normalizedQuery.includes("diagnostics") ||
    normalizedQuery.includes("dpe") ||
    normalizedQuery.includes("amiante") ||
    normalizedQuery.includes("plomb") ||
    normalizedQuery.includes("gaz") ||
    normalizedQuery.includes("electricite");

  if (!isDiagnosticsQuestion || sources.length === 0) {
    return null;
  }

  const relatedSources = filterSourcesByTerms(sources, [
    "diagnostic",
    "diagnostics",
    "dpe",
    "amiante",
    "plomb",
    "gaz",
    "electricite",
    "energetique",
    "termites",
  ]);

  return buildExtractiveSourceAnswer({
    intro: "D'après les diagnostics ou extraits liés à ce sujet :",
    sources: relatedSources,
    fallbackSummary:
      "Les diagnostics chargés doivent être relus point par point avant diffusion ou engagement.",
    vigilance:
      "confirmez la date de validité, les anomalies relevées et les obligations de mise à jour avant partage.",
  });
}

export function buildGroundedCompromiseAnswer(
  query: string,
  sources: RagContextResponse["sources"],
) {
  const normalizedQuery = normalize(query).toLowerCase();
  const isCompromiseQuestion =
    normalizedQuery.includes("compromis") ||
    normalizedQuery.includes("promesse") ||
    normalizedQuery.includes("condition suspensive") ||
    normalizedQuery.includes("conditions suspensives");

  if (!isCompromiseQuestion || sources.length === 0) {
    return null;
  }

  const relatedSources = filterSourcesByTerms(sources, [
    "compromis",
    "promesse",
    "condition suspensive",
    "conditions suspensives",
    "offre",
    "signature",
  ]);

  return buildExtractiveSourceAnswer({
    intro: "D'après les pièces liées au compromis ou à l'offre :",
    sources: relatedSources,
    fallbackSummary:
      "Les passages récupérés montrent des points contractuels à valider avant signature.",
    vigilance:
      "confirmez toujours les conditions suspensives, le calendrier et les clauses sensibles avec le coach ou le notaire.",
  });
}

export function buildGroundedSellerDocumentsAnswer(
  query: string,
  sources: RagContextResponse["sources"],
) {
  const normalizedQuery = normalize(query).toLowerCase();
  const isSellerDocumentsQuestion =
    normalizedQuery.includes("titre de propriete") ||
    normalizedQuery.includes("taxe fonciere") ||
    normalizedQuery.includes("dossier vendeur") ||
    normalizedQuery.includes("documents vendeur") ||
    normalizedQuery.includes("pieces vendeur");

  if (!isSellerDocumentsQuestion || sources.length === 0) {
    return null;
  }

  const relatedSources = filterSourcesByTerms(sources, [
    "titre de propriete",
    "taxe fonciere",
    "diagnostics",
    "pv ag",
    "carnet d entretien",
    "dossier vendeur",
    "pieces vendeur",
  ]);

  return buildExtractiveSourceAnswer({
    intro: "D'après les documents vendeur retrouvés :",
    sources: relatedSources,
    fallbackSummary:
      "Le dossier vendeur contient plusieurs pièces utiles, mais il faut vérifier qu'elles sont toutes à jour.",
    vigilance:
      "vérifiez quelles pièces sont complètes, lesquelles manquent encore et qui doit les fournir avant la mise en vente.",
  });
}
