import type { ProjectMode } from "../data/content";

export type AssistantRole = "system" | "user" | "assistant";

export type AssistantMessage = {
  role: AssistantRole;
  content: string;
};

type AssistantRequest = {
  mode: ProjectMode;
  messages: AssistantMessage[];
};

type MistralChatResponse = {
  choices?: Array<{
    message?: {
      role?: string;
      content?: MistralContent;
    };
  }>;
  error?: string;
};

type MistralContent =
  | string
  | Array<{
      type?: string;
      text?: string;
    }>;

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

function buildSystemPrompt(mode: ProjectMode) {
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

export async function sendAssistantMessage({
  mode,
  messages,
}: AssistantRequest): Promise<{ content: string; model: string }> {
  const runtime = getAssistantRuntime();

  const response = await fetch(runtime.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(mode),
        },
        ...messages,
      ],
    }),
  });

  const payload = (await response.json()) as MistralChatResponse;

  if (!response.ok) {
    throw new Error(
      payload.error ||
        `L'API Mistral a repondu avec ${response.status}. Verifiez la cle API et le modele configure.`,
    );
  }

  const content = extractContent(payload.choices?.[0]?.message?.content);

  if (!content) {
    throw new Error("Le modele n'a pas retourne de reponse exploitable.");
  }

  return {
    content,
    model: runtime.model,
  };
}

function extractContent(content: MistralContent | undefined) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .filter((item) => item.type === "text" && item.text)
      .map((item) => item.text?.trim() || "")
      .join("\n")
      .trim();
  }

  return "";
}
