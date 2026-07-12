import { buildSystemPrompt, getAssistantRuntime } from "./runtime";
import type { AssistantRequest, MistralChatResponse, MistralContent } from "./types";

function extractApiError(error: unknown) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const details = error as { message?: unknown; detail?: unknown };
    const message = typeof details.message === "string" ? details.message : details.detail;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return null;
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

export async function sendAssistantMessage({
  mode,
  provider,
  messages,
  contextSnippets = [],
}: AssistantRequest): Promise<{ content: string; model: string }> {
  const runtime = getAssistantRuntime(provider);
  const groundingMessage =
    contextSnippets.length > 0
      ? [
          "Règle d'ancrage au dossier :",
          "Pour toute question sur le dossier, réponds uniquement à partir des extraits ci-dessous.",
          "Si l'information n'est pas écrite explicitement dans ces extraits, dis que tu ne la trouves pas dans les documents chargés.",
          "N'infère pas de montants, taux, durées ou statuts bancaires à partir du nom d'un document.",
        ].join("\n")
      : [
          "Règle d'ancrage au dossier :",
          "Aucune source dossier pertinente n'a été retrouvée pour cette question.",
          "Si l'utilisateur demande ce que dit son dossier ou un document, réponds que tu ne trouves pas cette information dans les documents chargés.",
          "Tu peux ensuite proposer quoi vérifier ou quel document ajouter, sans inventer de contenu documentaire.",
        ].join("\n");
  const contextMessage =
    contextSnippets.length > 0
      ? [
          "Contexte dossier utilisateur :",
          ...contextSnippets.map((snippet, index) => `${index + 1}. ${snippet}`),
          "Fin du contexte dossier.",
        ].join("\n")
      : null;

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
        {
          role: "system",
          content: groundingMessage,
        },
        ...(contextMessage
          ? [
              {
                role: "system" as const,
                content: contextMessage,
              },
            ]
          : []),
        ...messages,
      ],
    }),
  });

  const payload = (await response.json()) as MistralChatResponse;

  if (!response.ok) {
    throw new Error(
      extractApiError(payload.error) ||
        `L'API ${runtime.providerLabel} a répondu avec ${response.status}. Vérifiez la clé API et le modèle configuré.`,
    );
  }

  const content = extractContent(payload.choices?.[0]?.message?.content);

  if (!content) {
    throw new Error("Le modèle n'a pas retourné de réponse exploitable.");
  }

  return {
    content,
    model: runtime.model,
  };
}
