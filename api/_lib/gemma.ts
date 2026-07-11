import type { GemmaGenerateResponse, GemmaRequestBody } from "./gemma-types.js";

type GemmaRuntimeConfig = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
};

export function getGemmaRuntimeConfig({
  apiKey = process.env.GOOGLE_API_KEY,
  model = process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it",
  baseUrl = process.env.GOOGLE_GENERATIVE_API_BASE_URL || "https://generativelanguage.googleapis.com/v1beta",
}: GemmaRuntimeConfig = {}) {
  return {
    apiKey,
    model,
    baseUrl,
  };
}

function buildGemmaPayload(body: GemmaRequestBody) {
  const messages = body.messages ?? [];
  const systemInstruction = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  return {
    ...(systemInstruction
      ? {
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
        }
      : {}),
    contents,
  };
}

export async function forwardGemmaChat(
  body: GemmaRequestBody,
  runtime = getGemmaRuntimeConfig(),
) {
  if (!runtime.apiKey) {
    throw new Error(
      "La variable GOOGLE_API_KEY est absente. Ajoutez-la dans les variables d'environnement du projet.",
    );
  }

  const upstream = await fetch(
    `${runtime.baseUrl}/models/${encodeURIComponent(runtime.model || "gemma-4-26b-a4b-it")}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": runtime.apiKey,
      },
      body: JSON.stringify(buildGemmaPayload(body)),
    },
  );
  const payload = (await upstream.json()) as GemmaGenerateResponse;
  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text?.trim() || "")
    .filter(Boolean)
    .join("\n")
    .trim();

  return {
    content,
    error: payload.error?.message,
    status: upstream.status,
  };
}
