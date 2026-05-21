import type { MistralRequestBody } from "./mistral-types.js";

type MistralRuntimeConfig = {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
};

export function getMistralRuntimeConfig({
  apiKey = process.env.MISTRAL_API_KEY,
  model = process.env.MISTRAL_MODEL || "mistral-small-latest",
  baseUrl = process.env.MISTRAL_API_BASE_URL || "https://api.mistral.ai",
}: MistralRuntimeConfig = {}) {
  return {
    apiKey,
    model,
    baseUrl,
  };
}

export async function forwardMistralChat(
  body: MistralRequestBody,
  runtime = getMistralRuntimeConfig(),
) {
  if (!runtime.apiKey) {
    throw new Error(
      "La variable MISTRAL_API_KEY est absente. Ajoutez-la dans les variables d'environnement du projet.",
    );
  }

  const upstream = await fetch(`${runtime.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${runtime.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: runtime.model,
      messages: body.messages ?? [],
    }),
  });

  return {
    upstream,
    text: await upstream.text(),
  };
}
