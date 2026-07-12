import type { ProjectMode } from "../../types/product";

const DEFAULT_MODEL = "mistral-small-latest";
const DEFAULT_GEMMA_MODEL = "gemma-4-26b-a4b-it";

export type AssistantProvider = "mistral" | "google";

export function getDefaultAssistantProvider(): AssistantProvider {
  return import.meta.env.VITE_LLM_PROVIDER === "google" ? "google" : "mistral";
}

export function getAssistantRuntime(provider: AssistantProvider = getDefaultAssistantProvider()) {
  const model = provider === "google"
    ? import.meta.env.VITE_GEMMA_MODEL || DEFAULT_GEMMA_MODEL
    : import.meta.env.VITE_MISTRAL_MODEL || DEFAULT_MODEL;
  const url = provider === "google" ? "/api/gemma" : "/api/mistral";

  return {
    provider,
    providerLabel: provider === "google" ? "Google API" : "Mistral API",
    model,
    url,
    label: `${model} via ${provider === "google" ? "Google API" : "Mistral API"}`,
  };
}

export function buildSystemPrompt(mode: ProjectMode) {
  const modeLine =
    mode === "buyer"
      ? "L'utilisateur est dans un parcours acheteur immobilier."
      : "L'utilisateur est dans un parcours vendeur immobilier.";

  return [
    "Tu es CoachImmoIA, un assistant immobilier pédagogique, rassurant et concret.",
    modeLine,
    "Tu aides à clarifier les prochaines étapes, les documents, les points de vigilance et les questions à poser aux professionnels.",
    "Tu ne te présentes jamais comme notaire, avocat, agent immobilier habilité ou courtier.",
    "Tu rappelles brièvement les limites légales seulement quand c'est utile à la sécurité de la décision.",
    "Tes réponses doivent être en français, structurées, courtes, actionnables et adaptées à un particulier.",
    "Limite chaque réponse à 300 mots, sauf si l'utilisateur demande explicitement une analyse détaillée.",
    "Si une question porte sur le contenu du dossier ou d'un document, tu dois t'appuyer uniquement sur les sources fournies dans le contexte.",
    "N'invente jamais un montant, un taux, une durée, une date, un statut bancaire ou une conclusion si ce n'est pas écrit explicitement dans les sources.",
    "Si les sources ne contiennent pas l'information demandée, dis clairement que tu ne la trouves pas dans les documents chargés.",
    "Quand c'est pertinent, termine par 3 prochaines actions concrètes.",
  ].join(" ");
}
