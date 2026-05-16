import { buildSystemPrompt, getAssistantRuntime } from "./runtime";
import type { AssistantRequest, MistralChatResponse, MistralContent } from "./types";

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
  messages,
  contextSnippets = [],
}: AssistantRequest): Promise<{ content: string; model: string }> {
  const runtime = getAssistantRuntime();
  const contextMessage =
    contextSnippets.length > 0
      ? [
          "Contexte dossier utilisateur :",
          ...contextSnippets.map((snippet, index) => `${index + 1}. ${snippet}`),
          "Utilise ce contexte en priorite si la question porte sur le dossier.",
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
