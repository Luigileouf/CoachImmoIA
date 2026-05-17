import type { AgentActionName, DossierAgentMemory, DossierQuestionKind } from "../types";

function normalize(value: string) {
  return value.toLowerCase();
}

const dossierSignals = [
  "mon dossier",
  "mes documents",
  "ce document",
  "ce pdf",
  "ce fichier",
  "que dit",
  "que contient",
  "selon le document",
  "selon mes documents",
  "d'apres mon dossier",
  "d'après mon dossier",
  "dans mon dossier",
  "dans mes documents",
  "sur ma simulation",
  "sur mon document",
];

const financingSignals = [
  "capacite d'emprunt",
  "capacite d emprunt",
  "emprunt",
  "simulation bancaire",
  "financement",
  "taux d'endettement",
  "taux d endettement",
  "mensualite",
  "apport",
  "pret",
];

const coproSignals = [
  "copropriete",
  "copro",
  "syndic",
  "pv d ag",
  "pv ag",
  "assemblee generale",
  "carnet d entretien",
  "charges",
  "travaux votes",
];

const diagnosticsSignals = [
  "diagnostic",
  "diagnostics",
  "dpe",
  "amiante",
  "plomb",
  "gaz",
  "electricite",
  "energetique",
  "performance energetique",
  "termites",
];

const compromiseSignals = [
  "compromis",
  "promesse",
  "condition suspensive",
  "conditions suspensives",
  "offre acceptee",
];

const sellerDocumentSignals = [
  "titre de propriete",
  "taxe fonciere",
  "dossier vendeur",
  "pieces vendeur",
  "documents vendeur",
];

export function classifyDossierQuestion(input: string): DossierQuestionKind {
  const normalized = normalize(input);
  const isDossierQuestion = dossierSignals.some((signal) => normalized.includes(signal));
  const isFinancingQuestion = financingSignals.some((signal) => normalized.includes(signal));
  const isCoproQuestion = coproSignals.some((signal) => normalized.includes(signal));
  const isDiagnosticsQuestion = diagnosticsSignals.some((signal) => normalized.includes(signal));
  const isCompromiseQuestion = compromiseSignals.some((signal) => normalized.includes(signal));
  const isSellerDocumentsQuestion = sellerDocumentSignals.some((signal) =>
    normalized.includes(signal),
  );

  if (isFinancingQuestion) {
    return "financing";
  }

  if (isCoproQuestion) {
    return "copro";
  }

  if (isDiagnosticsQuestion) {
    return "diagnostics";
  }

  if (isCompromiseQuestion) {
    return "compromise";
  }

  if (isSellerDocumentsQuestion) {
    return "seller_documents";
  }

  if (isDossierQuestion) {
    return "dossier";
  }

  return "coaching";
}

export function chooseNextAction(memory: DossierAgentMemory): AgentActionName {
  if (!memory.steps.includes("search_document_context")) {
    return "search_document_context";
  }

  if (memory.sources.length === 0 && memory.questionKind !== "coaching") {
    return "respond_missing_context";
  }

  if (!memory.groundedAttempted) {
    if (memory.questionKind === "financing") {
      return "build_grounded_financial_answer";
    }

    if (memory.questionKind === "copro") {
      return "build_grounded_copro_answer";
    }

    if (memory.questionKind === "diagnostics") {
      return "build_grounded_diagnostics_answer";
    }

    if (memory.questionKind === "compromise") {
      return "build_grounded_compromise_answer";
    }

    if (memory.questionKind === "seller_documents") {
      return "build_grounded_seller_documents_answer";
    }
  }

  return "respond_with_model";
}
