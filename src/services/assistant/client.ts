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
  const groundingMessage =
    contextSnippets.length > 0
      ? [
          "Regle de grounding dossier :",
          "Pour toute question sur le dossier, reponds uniquement a partir des extraits ci-dessous.",
          "Si l'information n'est pas ecrite explicitement dans ces extraits, dis que tu ne la trouves pas dans les documents charges.",
          "N'infere pas des montants, taux, durees ou statuts bancaires a partir du nom d'un document.",
        ].join("\n")
      : [
          "Regle de grounding dossier :",
          "Aucune source dossier pertinente n'a ete retrouvee pour cette question.",
          "Si l'utilisateur demande ce que dit son dossier ou un document, reponds que tu ne trouves pas cette information dans les documents charges.",
          "Tu peux ensuite proposer quoi verifier ou quel document ajouter, sans inventer de contenu documentaire.",
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
