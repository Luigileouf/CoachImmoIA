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

  const rawCorpus = sources.map((source) => `${source.label} ${source.summary} ${source.excerpt}`).join(" ");
  const corpus = normalize(
    sources.map((source) => `${source.label} ${source.summary} ${source.excerpt}`).join(" "),
  );

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
    `D'apres le document ${labels}, voici ce que je trouve sur votre capacite d'emprunt :`,
  ];

  if (borrowedAmount) {
    lines.push(`- Montant emprunte retenu : ${borrowedAmount}`);
  }
  if (contribution) {
    lines.push(`- Apport personnel : ${contribution}`);
  }
  if (duration) {
    lines.push(`- Duree retenue : ${duration}`);
  }
  if (nominalRate) {
    lines.push(`- Taux nominal fixe : ${nominalRate}`);
  }
  if (monthlyPayment) {
    lines.push(`- Mensualite estimee : ${monthlyPayment}`);
  }
  if (correctedDebtRatio) {
    lines.push(`- Taux d'endettement retenu par la banque : ${correctedDebtRatio}`);
  }
  if (grossDebtRatio) {
    lines.push(`- Taux d'endettement brut : ${grossDebtRatio}`);
  }
  if (decision) {
    lines.push(`- Decision indiquee : ${decision}`);
  }

  lines.push(
    "Point de vigilance : le document indique qu'il s'agit d'une simulation et non d'une offre de pret definitive.",
  );

  return lines.join("\n");
}
