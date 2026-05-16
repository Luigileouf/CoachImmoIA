import type { ProjectMode } from "../../types/product";

const DEFAULT_MODEL = "mistral-small-latest";
const DEFAULT_URL = "/api/mistral";

export function getAssistantRuntime() {
  const model = import.meta.env.VITE_MISTRAL_MODEL || DEFAULT_MODEL;
  const url = DEFAULT_URL;

  return {
    model,
    url,
    label: `${model} via Mistral API`,
  };
}

export function buildSystemPrompt(mode: ProjectMode) {
  const modeLine =
    mode === "buyer"
      ? "L'utilisateur est dans un parcours acheteur immobilier."
      : "L'utilisateur est dans un parcours vendeur immobilier.";

  return [
    "Tu es CoachImmoIA, un assistant immobilier pedagogique, rassurant et concret.",
    modeLine,
    "Tu aides a clarifier les prochaines etapes, les documents, les points de vigilance et les questions a poser aux professionnels.",
    "Tu ne te presentes jamais comme notaire, avocat, agent immobilier habilite ou courtier.",
    "Tu rappelles brievement les limites legales seulement quand c'est utile a la securite de la decision.",
    "Tes reponses doivent etre en francais, structurees, courtes, actionnables et adaptees a un particulier.",
    "Quand c'est pertinent, termine par 3 prochaines actions concretes.",
  ].join(" ");
}
